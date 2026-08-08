// HTML de la plataforma anti-fraude. Exportado como string para servirlo
// desde Lambda sin S3 ni archivos estáticos adicionales.

export const ANTIFRAUDE_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AntiFraude AI — Detecta phishing y estafas</title>
<style>
  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface2: #1e2530;
    --border: #30363d;
    --accent: #238636;
    --accent-hover: #2ea043;
    --danger: #da3633;
    --warning: #d29922;
    --safe: #238636;
    --text: #e6edf3;
    --muted: #8b949e;
    --radius: 10px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
    min-height: 100vh;
    padding: 24px 16px 48px;
  }

  /* ── Header ── */
  header {
    text-align: center;
    margin-bottom: 36px;
  }
  header .shield {
    font-size: 48px;
    line-height: 1;
    margin-bottom: 8px;
  }
  header h1 {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #58a6ff, #3fb950);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  header p {
    color: var(--muted);
    font-size: 14px;
    margin-top: 6px;
  }

  /* ── Layout ── */
  .container { max-width: 800px; margin: 0 auto; }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 16px;
  }
  .card-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--muted);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Textarea ── */
  textarea {
    width: 100%;
    min-height: 160px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    padding: 12px;
    resize: vertical;
    outline: none;
    transition: border-color .15s;
    font-family: inherit;
    line-height: 1.6;
  }
  textarea:focus { border-color: #58a6ff; }
  textarea::placeholder { color: var(--muted); }

  /* ── Drop zone ── */
  #drop-zone {
    border: 2px dashed var(--border);
    border-radius: 8px;
    padding: 32px 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color .15s, background .15s;
    position: relative;
  }
  #drop-zone:hover, #drop-zone.drag-over {
    border-color: #58a6ff;
    background: rgba(88, 166, 255, .05);
  }
  #drop-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  #drop-zone .dz-icon { font-size: 32px; margin-bottom: 8px; }
  #drop-zone p { color: var(--muted); font-size: 13px; }
  #drop-zone strong { color: var(--text); }

  /* ── Image preview ── */
  #img-preview-wrap { display: none; margin-top: 12px; text-align: center; }
  #img-preview {
    max-width: 100%;
    max-height: 240px;
    border-radius: 8px;
    border: 1px solid var(--border);
    object-fit: contain;
  }
  #img-clear {
    display: block;
    margin: 6px auto 0;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }
  #img-clear:hover { color: var(--danger); }

  /* ── Submit button ── */
  #analyze-btn {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s, transform .1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  #analyze-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
  #analyze-btn:disabled { opacity: .5; cursor: default; transform: none; }

  /* ── Results ── */
  #result-section { display: none; }

  .verdict-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  .verdict-badge.SEGURO           { background: rgba(35,134,54,.2); border: 1px solid var(--safe);    color: #3fb950; }
  .verdict-badge.SOSPECHOSO       { background: rgba(210,153,34,.2); border: 1px solid var(--warning); color: #e3b341; }
  .verdict-badge.FRAUDE_CONFIRMADO{ background: rgba(218,54,51,.2); border: 1px solid var(--danger);  color: #f85149; }

  .risk-bar-wrap { margin-bottom: 16px; }
  .risk-label { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
  .risk-bar-bg {
    height: 8px;
    background: var(--surface2);
    border-radius: 4px;
    overflow: hidden;
  }
  .risk-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s ease;
  }

  .detail-block {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
  }
  .detail-block h4 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .indicators-list { list-style: none; padding: 0; }
  .indicators-list li { padding: 4px 0; }
  .indicators-list li::before { content: "⚠ "; }

  .recommendation {
    background: rgba(88,166,255,.08);
    border: 1px solid rgba(88,166,255,.3);
    border-radius: 8px;
    padding: 14px;
    font-size: 14px;
    line-height: 1.6;
  }
  .recommendation strong { color: #58a6ff; }

  /* ── Spinner ── */
  .spinner {
    display: inline-block;
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Tool call pill ── */
  #tool-status {
    display: none;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 12px;
    width: fit-content;
    margin: 0 auto 12px;
  }
  #tool-status.visible { display: flex; }

  /* ── Raw stream (debug) ── */
  #raw-stream {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: var(--muted);
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 24px;
  }

  /* ── Footer ── */
  footer { text-align: center; color: var(--muted); font-size: 12px; margin-top: 32px; }
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <header>
    <div class="shield">🛡️</div>
    <h1>AntiFraude AI</h1>
    <p>Detecta phishing, estafas y mensajes fraudulentos usando Inteligencia Artificial</p>
  </header>

  <!-- Input: Texto -->
  <div class="card">
    <div class="card-title">
      <span>📝</span> Mensaje o correo sospechoso
    </div>
    <textarea id="msg-text"
      placeholder="Pega aquí el mensaje, SMS, correo o texto que quieres analizar...
Ejemplo: 'Felicitaciones! Ganaste un iPhone 15. Haz clic en paypa1.com/reclamar para recibirlo. Actúa rápido, expira en 24h.'"
    ></textarea>
  </div>

  <!-- Input: Imagen -->
  <div class="card">
    <div class="card-title">
      <span>🖼️</span> Captura de pantalla (opcional)
    </div>
    <div id="drop-zone">
      <input type="file" id="img-input" accept="image/*">
      <div class="dz-icon">📎</div>
      <p><strong>Arrastra una imagen aquí</strong> o haz clic para seleccionar</p>
      <p style="margin-top:4px">PNG, JPG, WEBP · máx. 4 MB</p>
    </div>
    <div id="img-preview-wrap">
      <img id="img-preview" src="" alt="Vista previa">
      <button id="img-clear">✕ Quitar imagen</button>
    </div>
  </div>

  <!-- Botón analizar -->
  <button id="analyze-btn">
    <span id="btn-icon">🔍</span>
    <span id="btn-label">Analizar ahora</span>
  </button>

  <!-- Estado del agente (herramienta en uso) -->
  <div id="tool-status" style="margin-top:14px;">
    <span class="spinner"></span>
    <span id="tool-name">Analizando...</span>
  </div>

  <!-- Resultados -->
  <div id="result-section" style="margin-top:24px;">
    <div class="card">
      <div id="verdict-area"></div>

      <div class="risk-bar-wrap">
        <div class="risk-label">Nivel de riesgo: <span id="risk-num">-</span>/10</div>
        <div class="risk-bar-bg">
          <div class="risk-bar-fill" id="risk-bar" style="width:0%"></div>
        </div>
      </div>

      <div class="detail-block">
        <h4>Justificación</h4>
        <div id="justificacion">—</div>
      </div>

      <div class="detail-block" id="indicators-wrap" style="display:none">
        <h4>Indicadores detectados</h4>
        <ul class="indicators-list" id="indicators-list"></ul>
      </div>

      <div class="recommendation" id="recomendacion-wrap" style="display:none">
        <strong>Recomendación:</strong>
        <span id="recomendacion"></span>
      </div>
    </div>

    <!-- Stream raw para debug (oculto por defecto) -->
    <details style="margin-top:8px;">
      <summary style="font-size:12px; color:var(--muted); cursor:pointer;">Ver respuesta raw del agente</summary>
      <div class="card" style="margin-top:8px;"><div id="raw-stream"></div></div>
    </details>
  </div>

</div>

<footer>
  Powered by Amazon Bedrock · Claude · AWS Lambda &nbsp;|&nbsp; AntiFraude AI &copy; 2025
</footer>

<script>
"use strict";

// ─── Estado ───────────────────────────────────────────────────────────────────
let imageBase64 = null;
let imageMimeType = "image/jpeg";

// ─── Drop zone ────────────────────────────────────────────────────────────────
const dropZone      = document.getElementById("drop-zone");
const imgInput      = document.getElementById("img-input");
const imgPreviewWrap= document.getElementById("img-preview-wrap");
const imgPreview    = document.getElementById("img-preview");
const imgClear      = document.getElementById("img-clear");

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  if (file.size > 4 * 1024 * 1024) {
    alert("La imagen supera los 4 MB. Por favor elige una más pequeña.");
    return;
  }
  imageMimeType = file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    // Separar el prefijo "data:image/png;base64," del contenido real
    imageBase64 = dataUrl.split(",")[1];
    imgPreview.src = dataUrl;
    imgPreviewWrap.style.display = "block";
    dropZone.style.display = "none";
  };
  reader.readAsDataURL(file);
}

imgInput.addEventListener("change", (e) => loadFile(e.target.files[0]));

dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  loadFile(e.dataTransfer.files[0]);
});

imgClear.addEventListener("click", () => {
  imageBase64 = null;
  imgInput.value = "";
  imgPreviewWrap.style.display = "none";
  dropZone.style.display = "block";
});

// ─── Helpers UI ───────────────────────────────────────────────────────────────
const btn        = document.getElementById("analyze-btn");
const btnIcon    = document.getElementById("btn-icon");
const btnLabel   = document.getElementById("btn-label");
const toolStatus = document.getElementById("tool-status");
const toolName   = document.getElementById("tool-name");

function setLoading(on) {
  btn.disabled = on;
  btnIcon.innerHTML = on ? '<span class="spinner"></span>' : "🔍";
  btnLabel.textContent = on ? "Analizando…" : "Analizar ahora";
  if (!on) {
    toolStatus.classList.remove("visible");
  }
}

function showTool(name) {
  const labels = {
    check_suspicious_url:  "🔗 Verificando URL en lista negra…",
    check_email_domain:    "📧 Verificando dominio de email…",
  };
  toolName.textContent = labels[name] ?? ("🔧 Usando herramienta: " + name);
  toolStatus.classList.add("visible");
}

function hideTool() {
  toolStatus.classList.remove("visible");
}

const VERDICT_ICONS = {
  SEGURO:            { icon: "✅", label: "SEGURO" },
  SOSPECHOSO:        { icon: "⚠️",  label: "SOSPECHOSO" },
  FRAUDE_CONFIRMADO: { icon: "🚨",  label: "FRAUDE CONFIRMADO" },
};

const RISK_COLORS = (n) => {
  if (n <= 3) return "#3fb950";
  if (n <= 6) return "#e3b341";
  return "#f85149";
};

function renderResult(parsed) {
  const v = (parsed.veredicto || "SOSPECHOSO").toUpperCase().replace(/ /g, "_");
  const meta = VERDICT_ICONS[v] || { icon: "❓", label: v };
  const riesgo = Math.min(10, Math.max(1, Number(parsed.nivel_riesgo) || 5));

  // Badge de veredicto
  document.getElementById("verdict-area").innerHTML =
    '<div class="verdict-badge ' + v + '">' + meta.icon + " " + meta.label + "</div>";

  // Barra de riesgo
  document.getElementById("risk-num").textContent = riesgo;
  const bar = document.getElementById("risk-bar");
  bar.style.width = (riesgo * 10) + "%";
  bar.style.background = RISK_COLORS(riesgo);

  // Justificación
  document.getElementById("justificacion").textContent =
    parsed.justificacion || "Sin justificación proporcionada.";

  // Indicadores
  const indList = document.getElementById("indicators-list");
  const indWrap = document.getElementById("indicators-wrap");
  if (parsed.indicadores && parsed.indicadores.length > 0) {
    indList.innerHTML = parsed.indicadores
      .map((i) => "<li>" + escHtml(i) + "</li>")
      .join("");
    indWrap.style.display = "block";
  } else {
    indWrap.style.display = "none";
  }

  // Recomendación
  const recWrap = document.getElementById("recomendacion-wrap");
  if (parsed.recomendacion) {
    document.getElementById("recomendacion").textContent = parsed.recomendacion;
    recWrap.style.display = "block";
  } else {
    recWrap.style.display = "none";
  }

  document.getElementById("result-section").style.display = "block";
  document.getElementById("result-section").scrollIntoView({ behavior: "smooth" });
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ─── Llamada al backend ────────────────────────────────────────────────────────
async function analyze() {
  const text = document.getElementById("msg-text").value.trim();
  if (!text && !imageBase64) {
    alert("Por favor ingresa un mensaje o sube una imagen para analizar.");
    return;
  }

  setLoading(true);
  document.getElementById("result-section").style.display = "none";
  const rawStream = document.getElementById("raw-stream");
  rawStream.textContent = "";

  // Acumular tokens del agente para parsear el JSON final
  let accumulatedText = "";

  try {
    const res = await fetch("analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, imageBase64, mimeType: imageMimeType }),
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\\n");
      buf = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }

        if (msg.type === "token") {
          accumulatedText += msg.text;
          rawStream.textContent = accumulatedText;
          hideTool();
        } else if (msg.type === "tool") {
          showTool(msg.name);
        } else if (msg.type === "done") {
          // Intentar parsear el JSON del veredicto del stream acumulado
          const match = accumulatedText.match(/\\{[\\s\\S]*\\}/);
          if (match) {
            try {
              renderResult(JSON.parse(match[0]));
            } catch {
              renderResult({
                veredicto: "SOSPECHOSO",
                nivel_riesgo: 5,
                justificacion: accumulatedText,
                indicadores: [],
                recomendacion: "Revisa el contenido con cuidado.",
              });
            }
          }
        } else if (msg.type === "error") {
          rawStream.textContent = "Error: " + msg.text;
          document.getElementById("result-section").style.display = "block";
        }
      }
    }
  } catch (err) {
    rawStream.textContent = "Error de red: " + err.message;
    document.getElementById("result-section").style.display = "block";
  }

  setLoading(false);
}

document.getElementById("analyze-btn").addEventListener("click", analyze);

// Ctrl+Enter en el textarea también analiza
document.getElementById("msg-text").addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") analyze();
});
</script>
</body>
</html>`;
