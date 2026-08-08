/**
 * antifraude/agent.mjs
 *
 * Agente de IA anti-fraude construido con Strands Agents SDK sobre Bedrock.
 * Herramientas estáticas rápidas (URLs, dominios de email) + análisis
 * semántico de texto e imágenes usando visión del modelo.
 */

import { Agent, BedrockModel, tool } from "@strands-agents/sdk";
import { z } from "zod";

// ─── Modelo ───────────────────────────────────────────────────────────────────
// Claude Sonnet 4.5 tiene soporte de visión (imágenes base64) y razonamiento.
const model = new BedrockModel({
  modelId: "us.anthropic.claude-sonnet-4-5-20251001-v1:0",
});

// ─── Lista negra de dominios de phishing conocidos ────────────────────────────
const PHISHING_DOMAINS = new Set([
  "paypa1.com", "paypai.com", "paypa-l.com",
  "arnazon.com", "amaz0n.com", "amazon-seguro.com",
  "netflix-actualiza.com", "netflix-pago.net",
  "bancoamerica-seguro.com", "bancomer-verify.com", "bbva-acceso.net",
  "mercadolibre-promo.com", "ml-verificacion.com",
  "whatsapp-premium.net", "whatsapp-gratis.com",
  "soporte-microsoft.com", "microsoft-alerta.net",
  "apple-id-verify.com", "appleid-support.net",
  "dhl-entrega.com", "fedex-tracking-mx.com",
  "covid-ayuda.com", "gobierno-bono.com",
  "crypto-ganancias.com", "bitcoin-duplica.net",
  "hacienda-devolucion.com", "sat-reembolso.net",
]);

// ─── Lista negra de dominios de email desechables / fraudulentos ──────────────
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
  "spam4.me", "yopmail.com", "10minutemail.com", "trashmail.com",
  "dispostable.com", "maildrop.cc", "fakeinbox.com", "nwldx.com",
  "mailnull.com", "spamgourmet.com", "spamgourmet.net", "spamgourmet.org",
  "tempr.email", "discard.email", "getairmail.com", "filzmail.com",
]);

// ─── Herramienta 1: check_suspicious_url ─────────────────────────────────────
const checkSuspiciousUrl = tool({
  name: "check_suspicious_url",
  description:
    "Verifica si una URL o dominio aparece en la lista negra de dominios de " +
    "phishing conocidos. Úsala siempre que el texto analizado contenga alguna URL.",
  inputSchema: z.object({
    url: z.string().describe("La URL o dominio a verificar, ej: 'paypa1.com/login'"),
  }),
  callback: ({ url }) => {
    // Extraer solo el hostname de la URL
    let hostname = url.toLowerCase().trim();
    try {
      // Si viene con scheme, parsear normalmente
      if (hostname.startsWith("http")) {
        hostname = new URL(hostname).hostname;
      } else {
        // Quitar path/query manualmente
        hostname = hostname.split("/")[0].split("?")[0];
      }
    } catch {
      hostname = hostname.split("/")[0];
    }
    // Quitar "www."
    hostname = hostname.replace(/^www\./, "");

    const isPhishing = PHISHING_DOMAINS.has(hostname);
    return JSON.stringify({
      url,
      hostname,
      is_phishing: isPhishing,
      verdict: isPhishing ? "FRAUDE_CONFIRMADO" : "NO_EN_LISTA_NEGRA",
      detail: isPhishing
        ? `El dominio "${hostname}" está en la lista negra de phishing conocido.`
        : `El dominio "${hostname}" no está en la lista negra estática (requiere análisis adicional).`,
    });
  },
});

// ─── Herramienta 2: check_email_domain ───────────────────────────────────────
const checkEmailDomain = tool({
  name: "check_email_domain",
  description:
    "Verifica si una dirección de email usa un dominio desechable (throwaway) " +
    "o frecuentemente asociado a fraudes. Úsala cuando el mensaje contenga " +
    "una dirección de correo electrónico.",
  inputSchema: z.object({
    email: z.string().describe("La dirección de email a verificar, ej: 'soporte@yopmail.com'"),
  }),
  callback: ({ email }) => {
    const parts = email.toLowerCase().trim().split("@");
    if (parts.length !== 2) {
      return JSON.stringify({ error: "Formato de email inválido", email });
    }
    const domain = parts[1];
    const isDisposable = DISPOSABLE_EMAIL_DOMAINS.has(domain);
    return JSON.stringify({
      email,
      domain,
      is_disposable: isDisposable,
      verdict: isDisposable ? "SOSPECHOSO" : "DOMINIO_NORMAL",
      detail: isDisposable
        ? `El dominio "${domain}" es un servicio de email desechable muy usado en fraudes.`
        : `El dominio "${domain}" no está en la lista de dominios desechables conocidos.`,
    });
  },
});

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres un experto en ciberseguridad y detección de fraudes.
Tu misión es analizar mensajes, correos electrónicos e imágenes para determinar
si son intentos de phishing, estafas o fraudes.

PROCESO DE ANÁLISIS:
1. Si el contenido tiene URLs, usa la herramienta check_suspicious_url.
2. Si el contenido tiene emails, usa la herramienta check_email_domain.
3. Analiza el texto semánticamente buscando: urgencia artificial, amenazas,
   solicitudes de datos personales/bancarios, premios inesperados, suplantación
   de identidad, errores ortográficos o gramaticales atípicos, redirecciones
   sospechosas, presión para actuar rápido.
4. Si hay una imagen, analízala visualmente en busca de logos falsos, texto
   urgente, QR codes sospechosos o formularios que solicitan datos sensibles.

VEREDICTO FINAL:
Responde SIEMPRE con este formato JSON:
{
  "veredicto": "SEGURO" | "SOSPECHOSO" | "FRAUDE_CONFIRMADO",
  "nivel_riesgo": 1-10,
  "justificacion": "Explicación breve en español de los indicadores encontrados",
  "indicadores": ["lista", "de", "señales", "detectadas"],
  "recomendacion": "Qué debe hacer el usuario"
}

Sé preciso, directo y usa lenguaje claro para usuarios no técnicos.`;

// ─── Función principal del agente ─────────────────────────────────────────────

/**
 * Analiza texto e imagen opcional en busca de fraude.
 * @param {string} text        - Mensaje o correo a analizar
 * @param {string|null} imageBase64 - Imagen en base64 (opcional)
 * @param {string}      mimeType    - MIME type de la imagen, ej: "image/png"
 * @yields {{ type: "token"|"tool"|"done"|"error", text?: string, name?: string }}
 */
export async function* analyzeContent(text, imageBase64 = null, mimeType = "image/jpeg") {
  // Construir el mensaje del usuario. Si hay imagen, incluirla como bloque vision.
  let userMessage;

  if (imageBase64) {
    // Strands SDK acepta el formato multi-modal de Anthropic:
    // un array de content blocks con texto e imagen.
    userMessage = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType,
          data: imageBase64,
        },
      },
      {
        type: "text",
        text: text
          ? `Analiza esta imagen Y el siguiente texto en busca de fraude:\n\n${text}`
          : "Analiza esta imagen en busca de indicios de fraude o phishing.",
      },
    ];
  } else {
    userMessage = `Analiza el siguiente contenido en busca de fraude o phishing:\n\n${text}`;
  }

  const agent = new Agent({
    model,
    systemPrompt: SYSTEM_PROMPT,
    tools: [checkSuspiciousUrl, checkEmailDomain],
    printer: false,
  });

  for await (const ev of agent.stream(userMessage)) {
    if (
      ev.type === "modelStreamUpdateEvent" &&
      ev.event.type === "modelContentBlockDeltaEvent" &&
      ev.event.delta?.type === "textDelta"
    ) {
      yield { type: "token", text: ev.event.delta.text };
    } else if (ev.type === "beforeToolCallEvent") {
      yield { type: "tool", name: ev.toolUse?.name ?? "tool" };
    }
  }
}
