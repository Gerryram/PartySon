import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // ── Partyson: text event analysis ── { prompt }
    if (body.prompt) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Devuelve SOLO JSON sin backticks ni markdown. Campos requeridos: tipo, personas, presupuesto_total, resumen, servicios (array con: categoria, nombre, descripcion, presupuesto_sugerido, prioridad). Categorías válidas: salon, sonido, catering, decoracion, fotografia, entretenimiento, pastel, transporte. Prioridades: alta, media, baja.",
          messages: [{ role: "user", content: body.prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });
      const t = (d.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(t));
    }

    // ── Casatec / Pintatec: vision analysis ── { messages }
    if (body.messages) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: body.messages,
        }),
      });
      const d = await r.json();
      if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });
      const text = d.content?.find((b) => b.type === "text")?.text || "Sin respuesta.";
      return NextResponse.json({ text });
    }

    // ── Mystery Shopper: evaluation analysis ── { evaluation }
    if (body.evaluation) {
      const { business, category, location, totalScore, blockScores = [], failures = [], observations = [] } = body.evaluation;

      const blockScoreText = blockScores.map(b => `  • ${b.section}: ${b.score}%`).join("\n");
      const failuresText = failures.length > 0
        ? failures.map(f => `  • ${f}`).join("\n")
        : "  (Sin incumplimientos registrados)";
      const observationsText = observations.length > 0
        ? observations.join("\n\n")
        : "  (Sin observaciones adicionales)";

      const userContent = `Negocio: ${business}
Categoría: ${category}
Ubicación: ${location || ""}
Puntaje global calculado: ${totalScore}/100

SCORES POR BLOQUE:
${blockScoreText}

ÍTEMS INCUMPLIDOS (respuesta "No"):
${failuresText}

OBSERVACIONES DETALLADAS DEL AUDITOR:
${observationsText}`;

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1800,
          system: `Eres un experto en auditoría de experiencia de cliente (mystery shopper) en México con años de experiencia evaluando restaurantes y negocios de servicio.

Recibirás los resultados estructurados de una visita de mystery shopper con: puntaje global, scores por bloque, ítems incumplidos y observaciones detalladas del auditor.

Devuelve SOLO JSON válido sin markdown, backticks ni texto adicional. Campos requeridos:
- score: número 0-100 (usa el puntaje global calculado proporcionado)
- resumen: string de 3-4 oraciones describiendo la experiencia general, mencionando el nivel de servicio y los aspectos más destacados
- fortalezas: string con lista de puntos fuertes específicos (con saltos de línea \\n entre cada punto), basada en los bloques con mejor score y las observaciones positivas del auditor
- areas_mejora: string con lista de áreas de mejora específicas y concretas (con saltos de línea \\n), basada en los ítems incumplidos y bloques con menor score
- recomendaciones: string con 3-5 acciones concretas y accionables que el negocio debe implementar (con saltos de línea \\n), priorizadas por impacto en la experiencia del cliente`,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      const d = await r.json();
      if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });
      const t = (d.content?.[0]?.text || "{}").replace(/```json\n?|```/g, "").trim();
      return NextResponse.json(JSON.parse(t));
    }

    return NextResponse.json({ error: "Missing prompt or messages" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
