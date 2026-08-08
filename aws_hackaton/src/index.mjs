/**
 * antifraude/index.mjs
 *
 * Handler Lambda con streaming. Sirve el HTML en GET / y
 * el análisis del agente en POST /analyze.
 */
import { ANTIFRAUDE_HTML } from "./frontend.mjs";
import { analyzeContent } from "./agent.mjs";

export const handler = awslambda.streamifyResponse(
  async (event, responseStream, _context) => {
    // GET / → página principal
    if (event.httpMethod === "GET") {
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
      responseStream.write(ANTIFRAUDE_HTML);
      responseStream.end();
      return;
    }

    // POST /analyze → stream del análisis
    responseStream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/x-ndjson",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const send = (obj) => responseStream.write(JSON.stringify(obj) + "\n");

    try {
      const body = JSON.parse(event.body ?? "{}");
      const { text = "", imageBase64 = null, mimeType = "image/jpeg" } = body;

      if (!text && !imageBase64) {
        send({ type: "error", text: "Debes enviar texto o una imagen para analizar." });
        responseStream.end();
        return;
      }

      for await (const chunk of analyzeContent(text, imageBase64, mimeType)) {
        send(chunk);
      }
      send({ type: "done" });
    } catch (err) {
      send({ type: "error", text: `${err.name}: ${err.message}` });
    }

    responseStream.end();
  }
);
