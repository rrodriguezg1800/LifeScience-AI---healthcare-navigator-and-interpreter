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
    --accent: #1f6feb;
    --accent-hover: #388bfd;
    --danger: #da3633;
    --warning: #d29922;
    --safe: #238636;
    --text: #e6edf3;
    --muted: #8b949e;
    --radius: 12px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
    min-height: 100vh;
    padding: 0 0 60px;
  }

  /* ── Nav ── */
  nav {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 16px;
    background: linear-gradient(135deg, #58a6ff, #3fb950);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .nav-tabs {
    display: flex;
    gap: 4px;
  }
  .nav-tab {
    padding: 7px 18px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s, color .15s;
  }
  .nav-tab:hover { background: var(--surface2); color: var(--text); }
  .nav-tab.active {
    background: var(--surface2);
    color: #58a6ff;
    border: 1px solid var(--border);
  }

  /* ── Hero ── */
  .hero {
    text-align: center;
    padding: 44px 16px 36px;
  }
  .hero .shield { font-size: 52px; line-height: 1; margin-bottom: 12px; }
  .hero h1 {
    font-size: 30px;
    font-weight: 800;
    background: linear-gradient(135deg, #58a6ff, #3fb950);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  .hero p { color: var(--muted); font-size: 14px; max-width: 480px; margin: 0 auto; line-height: 1.6; }

  /* ── Page layout ── */
  .page { display: none; }
  .page.active { display: block; }
  .container { max-width: 760px; margin: 0 auto; padding: 0 16px; }

  /* ── Card ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
    margin-bottom: 16px;
  }
  .card-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: var(--muted);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* ── Textarea ── */
  textarea {
    width: 100%;
    min-height: 180px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
    padding: 13px 14px;
    resize: vertical;
    outline: none;
    transition: border-color .15s;
    font-family: inherit;
    line-height: 1.65;
  }
  textarea:focus { border-color: #388bfd; }
  textarea::placeholder { color: var(--muted); }

  /* ── Drop zone ── */
  .drop-zone {
    border: 2px dashed var(--border);
    border-radius: 10px;
    padding: 38px 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color .15s, background .15s;
    position: relative;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: #58a6ff;
    background: rgba(88,166,255,.05);
  }
  .drop-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .drop-zone .dz-icon { font-size: 36px; margin-bottom: 10px; }
  .drop-zone p { color: var(--muted); font-size: 13px; line-height: 1.6; }
  .drop-zone strong { color: var(--text); }

  /* ── Image preview ── */
  .img-preview-wrap { display: none; margin-top: 14px; text-align: center; }
  .img-preview {
    max-width: 100%;
    max-height: 260px;
    border-radius: 8px;
    border: 1px solid var(--border);
    object-fit: contain;
  }
  .img-clear {
    display: block;
    margin: 8px auto 0;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }
  .img-clear:hover { color: var(--danger); }

  /* ── Submit button ── */
  .analyze-btn {
    width: 100%;
    padding: 15px;
    background: var(--accent);
    border: none;
    border-radius: 9px;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s, transform .1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: .01em;
  }
  .analyze-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
  .analyze-btn:disabled { opacity: .45; cursor: default; transform: none; }

  /* ── Tool status pill ── */
  .tool-status {
    display: none;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 14px;
    width: fit-content;
    margin: 14px auto 0;
  }
  .tool-status.visible { display: flex; }

  /* ── Results ── */
  .result-section { display: none; margin-top: 22px; }

  .verdict-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 17px;
    font-weight: 800;
    margin-bottom: 18px;
  }
  .verdict-badge.SEGURO            { background: rgba(35,134,54,.18); border: 1px solid var(--safe);    color: #3fb950; }
  .verdict-badge.SOSPECHOSO        { background: rgba(210,153,34,.18); border: 1px solid var(--warning); color: #e3b341; }
  .verdict-badge.FRAUDE_CONFIRMADO { background: rgba(218,54,51,.18); border: 1px solid var(--danger);  color: #f85149; }

  .risk-bar-wrap { margin-bottom: 18px; }
  .risk-label { font-size: 12px; color: var(--muted); margin-bottom: 5px; }
  .risk-bar-bg { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .risk-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

  .detail-block {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.65;
  }
  .detail-block h4 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: var(--muted);
    margin-bottom: 9px;
  }

  .indicators-list { list-style: none; padding: 0; }
  .indicators-list li { padding: 3px 0; }
  .indicators-list li::before { content: "⚠ "; color: var(--warning); }

  .recommendation {
    background: rgba(88,166,255,.07);
    border: 1px solid rgba(88,166,255,.28);
    border-radius: 8px;
    padding: 14px;
    font-size: 14px;
    line-height: 1.65;
  }
  .recommendation strong { color: #58a6ff; }

  /* ── Spinner ── */
  .spinner {
    display: inline-block;
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Raw stream ── */
  .raw-stream {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: var(--muted);
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 24px;
  }

  /* ── Footer ── */
  footer { text-align: center; color: var(--muted); font-size: 12px; margin-top: 36px; }

  @media (max-width: 480px) {
    nav { padding: 0 14px; }
    .hero h1 { font-size: 24px; }
    .hero { padding: 32px 16px 28px; }
  }
</style>
</head>
<body>

<!-- ── Navegación ── -->
<nav>
  <div class="nav-brand">🛡️ AntiFraude AI</div>
  <div class="nav-tabs">
    <button class="nav-tab active" data-page="text">📝 Texto</button>
    <button class="nav-tab" data-page="image">🖼️ Imagen</button>
  </div>
</nav>

<!-- ── Hero ── -->
<header class="hero">
  <div class="shield">🛡️</div>
  <h1>AntiFraude AI</h1>
  <p>Detecta phishing, estafas y mensajes fraudulentos con Inteligencia Artificial sobre Amazon Bedrock</p>
</header>

<!-- ════════════════ PÁGINA: TEXTO ════════════════ -->
<div id="page-text" class="page active">
<div class="container">

  <div class="card">
    <div class="card-title"><span>📝</span> Mensaje, correo o SMS sospechoso</div>
    <textarea id="text-input"
      placeholder="Pega aquí el mensaje, SMS, correo o texto que quieres analizar...
Ejemplo: 'Felicitaciones! Ganaste un iPhone 15. Haz clic en paypa1.com/reclamar para recibirlo. Actúa rápido, expira en 24h.'"
    ></textarea>
    <p style="font-size:12px; color:var(--muted); margin-top:8px;">Ctrl+Enter para analizar</p>
  </div>

  <button class="analyze-btn" id="text-analyze-btn">
    <span class="btn-icon">🔍</span>
    <span class="btn-label">Analizar texto</span>
  </button>

  <div class="tool-status" id="text-tool-status">
    <span class="spinner"></span>
    <span class="tool-name">Analizando...</span>
  </div>

  <div class="result-section" id="text-result-section">
    <div class="card">
      <div class="verdict-area"></div>
      <div class="risk-bar-wrap">
        <div class="risk-label">Nivel de riesgo: <span class="risk-num">-</span>/10</div>
        <div class="risk-bar-bg"><div class="risk-bar-fill"></div></div>
      </div>
      <div class="detail-block">
        <h4>Justificación</h4>
        <div class="justificacion">—</div>
      </div>
      <div class="detail-block indicators-wrap" style="display:none">
        <h4>Indicadores detectados</h4>
        <ul class="indicators-list"></ul>
      </div>
      <div class="recommendation recomendacion-wrap" style="display:none">
        <strong>Recomendación:</strong> <span class="recomendacion"></span>
      </div>
    </div>
    <details style="margin-top:8px;">
      <summary style="font-size:12px; color:var(--muted); cursor:pointer;">Ver respuesta raw del agente</summary>
      <div class="card" style="margin-top:8px;"><div class="raw-stream"></div></div>
    </details>
  </div>

</div>
</div>

<!-- ════════════════ PÁGINA: IMAGEN ════════════════ -->
<div id="page-image" class="page">
<div class="container">

  <div class="card">
    <div class="card-title"><span>🖼️</span> Captura de pantalla sospechosa</div>
    <div class="drop-zone" id="drop-zone">
      <input type="file" id="img-input" accept="image/*">
      <div class="dz-icon">📎</div>
      <p><strong>Arrastra una imagen aquí</strong> o haz clic para seleccionar</p>
      <p>PNG, JPG, WEBP · máx. 4 MB</p>
    </div>
    <div class="img-preview-wrap" id="img-preview-wrap">
      <img class="img-preview" id="img-preview" src="" alt="Vista previa">
      <button class="img-clear" id="img-clear">✕ Quitar imagen</button>
    </div>
  </div>

  <div class="card" id="img-context-card" style="display:none">
    <div class="card-title"><span>💬</span> Contexto adicional (opcional)</div>
    <textarea id="img-text-input" style="min-height:80px"
      placeholder="¿Quieres agregar algo más? Ej: 'Este mensaje llegó por WhatsApp de un número desconocido'"></textarea>
  </div>

  <button class="analyze-btn" id="img-analyze-btn" disabled>
    <span class="btn-icon">🔍</span>
    <span class="btn-label">Analizar imagen</span>
  </button>

  <div class="tool-status" id="img-tool-status">
    <span class="spinner"></span>
    <span class="tool-name">Analizando...</span>
  </div>

  <div class="result-section" id="img-result-section">
    <div class="card">
      <div class="verdict-area"></div>
      <div class="risk-bar-wrap">
        <div class="risk-label">Nivel de riesgo: <span class="risk-num">-</span>/10</div>
        <div class="risk-bar-bg"><div class="risk-bar-fill"></div></div>
      </div>
      <div class="detail-block">
        <h4>Justificación</h4>
        <div class="justificacion">—</div>
      </div>
      <div class="detail-block indicators-wrap" style="display:none">
        <h4>Indicadores detectados</h4>
        <ul class="indicators-list"></ul>
      </div>
      <div class="recommendation recomendacion-wrap" style="display:none">
        <strong>Recomendación:</strong> <span class="recomendacion"></span>
      </div>
    </div>
    <details style="margin-top:8px;">
      <summary style="font-size:12px; color:var(--muted); cursor:pointer;">Ver respuesta raw del agente</summary>
      <div class="card" style="margin-top:8px;"><div class="raw-stream"></div></div>
    </details>
  </div>

</div>
</div>

<footer>
  Powered by Amazon Bedrock · Claude Sonnet 4.5 · AWS Lambda &nbsp;|&nbsp; AntiFraude AI &copy; 2025
</footer>

<script>
"use strict";

// ─── Navegación por pestañas ──────────────────────────────────────────────────
document.querySelectorAll(".nav-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    var page = tab.dataset.page;
    document.querySelectorAll(".nav-tab").forEach(function(t) { t.classList.remove("active"); });
    document.querySelectorAll(".page").forEach(function(p) { p.classList.remove("active"); });
    tab.classList.add("active");
    document.getElementById("page-" + page).classList.add("active");
  });
});

// ─── Helpers de UI comunes ────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

var VERDICT_ICONS = {
  SEGURO:            { icon: "✅", label: "SEGURO" },
  SOSPECHOSO:        { icon: "⚠️",  label: "SOSPECHOSO" },
  FRAUDE_CONFIRMADO: { icon: "🚨",  label: "FRAUDE CONFIRMADO" },
};

function riskColor(n) {
  if (n <= 3) return "#3fb950";
  if (n <= 6) return "#e3b341";
  return "#f85149";
}

function renderResult(section, parsed) {
  var v = (parsed.veredicto || "SOSPECHOSO").toUpperCase().replace(/ /g, "_");
  var meta = VERDICT_ICONS[v] || { icon: "❓", label: v };
  var riesgo = Math.min(10, Math.max(1, Number(parsed.nivel_riesgo) || 5));

  section.querySelector(".verdict-area").innerHTML =
    '<div class="verdict-badge ' + v + '">' + meta.icon + " " + meta.label + "</div>";

  section.querySelector(".risk-num").textContent = riesgo;
  var bar = section.querySelector(".risk-bar-fill");
  bar.style.width = (riesgo * 10) + "%";
  bar.style.background = riskColor(riesgo);

  section.querySelector(".justificacion").textContent =
    parsed.justificacion || "Sin justificación proporcionada.";

  var indList = section.querySelector(".indicators-list");
  var indWrap = section.querySelector(".indicators-wrap");
  if (parsed.indicadores && parsed.indicadores.length > 0) {
    indList.innerHTML = parsed.indicadores
      .map(function(i) { return "<li>" + escHtml(i) + "</li>"; }).join("");
    indWrap.style.display = "block";
  } else {
    indWrap.style.display = "none";
  }

  var recWrap = section.querySelector(".recomendacion-wrap");
  if (parsed.recomendacion) {
    section.querySelector(".recomendacion").textContent = parsed.recomendacion;
    recWrap.style.display = "block";
  } else {
    recWrap.style.display = "none";
  }

  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

var TOOL_LABELS = {
  check_suspicious_url: "🔗 Verificando URL en lista negra...",
  check_email_domain:   "📧 Verificando dominio de email...",
};

function makeAnalyzer(btnId, toolStatusId, resultSectionId, getPayload) {
  var btn        = document.getElementById(btnId);
  var toolStatus = document.getElementById(toolStatusId);
  var resultSec  = document.getElementById(resultSectionId);

  function setLoading(on) {
    btn.disabled = on;
    btn.querySelector(".btn-icon").innerHTML = on ? '<span class="spinner"></span>' : "🔍";
    btn.querySelector(".btn-label").textContent = on ? "Analizando…" : btn.dataset.label;
    if (!on) toolStatus.classList.remove("visible");
  }

  btn.dataset.label = btn.querySelector(".btn-label").textContent;

  btn.addEventListener("click", async function() {
    var payload = getPayload();
    if (!payload) return;

    setLoading(true);
    resultSec.style.display = "none";
    var rawStream = resultSec.querySelector(".raw-stream");
    rawStream.textContent = "";

    var accumulated = "";

    try {
      var res = await fetch("analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      var reader  = res.body.getReader();
      var decoder = new TextDecoder();
      var buf     = "";

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buf += decoder.decode(chunk.value, { stream: true });
        var lines = buf.split("\\n");
        buf = lines.pop();

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          var msg;
          try { msg = JSON.parse(line); } catch(_) { continue; }

          if (msg.type === "token") {
            accumulated += msg.text;
            rawStream.textContent = accumulated;
            toolStatus.classList.remove("visible");
          } else if (msg.type === "tool") {
            var label = TOOL_LABELS[msg.name] || ("🔧 " + msg.name + "...");
            toolStatus.querySelector(".tool-name").textContent = label;
            toolStatus.classList.add("visible");
          } else if (msg.type === "done") {
            var match = accumulated.match(/\\{[\\s\\S]*\\}/);
            if (match) {
              try {
                renderResult(resultSec, JSON.parse(match[0]));
              } catch(_) {
                renderResult(resultSec, {
                  veredicto: "SOSPECHOSO", nivel_riesgo: 5,
                  justificacion: accumulated, indicadores: [],
                  recomendacion: "Revisa el contenido con cuidado.",
                });
              }
            }
          } else if (msg.type === "error") {
            rawStream.textContent = "Error: " + msg.text;
            resultSec.style.display = "block";
          }
        }
      }
    } catch(err) {
      rawStream.textContent = "Error de red: " + err.message;
      resultSec.style.display = "block";
    }

    setLoading(false);
  });
}

// ─── Agente de texto ──────────────────────────────────────────────────────────
makeAnalyzer("text-analyze-btn", "text-tool-status", "text-result-section", function() {
  var text = document.getElementById("text-input").value.trim();
  if (!text) {
    alert("Por favor ingresa un mensaje o texto para analizar.");
    return null;
  }
  return { text: text, imageBase64: null, mimeType: "image/jpeg" };
});

document.getElementById("text-input").addEventListener("keydown", function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter")
    document.getElementById("text-analyze-btn").click();
});

// ─── Agente de imagen ─────────────────────────────────────────────────────────
var imageBase64  = null;
var imageMime    = "image/jpeg";
var dropZone     = document.getElementById("drop-zone");
var imgInput     = document.getElementById("img-input");
var previewWrap  = document.getElementById("img-preview-wrap");
var imgPreview   = document.getElementById("img-preview");
var imgContextCard = document.getElementById("img-context-card");

function compressImage(file, maxSide, quality) {
  return new Promise(function(resolve) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
        var w = Math.round(img.width * ratio);
        var h = Math.round(img.height * ratio);
        var canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function loadImageFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  imageMime = "image/jpeg";
  compressImage(file, 1024, 0.82).then(function(dataUrl) {
    imageBase64 = dataUrl.split(",")[1];
    imgPreview.src = dataUrl;
    previewWrap.style.display = "block";
    dropZone.style.display = "none";
    imgContextCard.style.display = "block";
    document.getElementById("img-analyze-btn").disabled = false;
  });
}

imgInput.addEventListener("change", function(e) { loadImageFile(e.target.files[0]); });

dropZone.addEventListener("dragover", function(e) {
  e.preventDefault(); dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", function() { dropZone.classList.remove("drag-over"); });
dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  loadImageFile(e.dataTransfer.files[0]);
});

document.getElementById("img-clear").addEventListener("click", function() {
  imageBase64 = null;
  imgInput.value = "";
  previewWrap.style.display = "none";
  dropZone.style.display = "block";
  imgContextCard.style.display = "none";
  document.getElementById("img-analyze-btn").disabled = true;
  document.getElementById("img-result-section").style.display = "none";
});

makeAnalyzer("img-analyze-btn", "img-tool-status", "img-result-section", function() {
  if (!imageBase64) {
    alert("Por favor sube una imagen para analizar.");
    return null;
  }
  var extraText = document.getElementById("img-text-input").value.trim();
  return { text: extraText, imageBase64: imageBase64, mimeType: imageMime };
});

</script>
</body>
</html>`;
