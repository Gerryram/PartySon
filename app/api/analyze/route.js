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
      const { business, category, answers } = body.evaluation;
      const evalText = Object.entries(answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system: "Eres un experto en auditoría de experiencia de cliente (mystery shopper) en México. Analiza la evaluación y devuelve SOLO JSON sin markdown. Campos requeridos: score (número 0-100), resumen (string, 2-3 oraciones), fortalezas (string, lista con saltos de línea), areas_mejora (string, lista con saltos de línea), recomendaciones (string, 3 acciones concretas).",
          messages: [{
            role: "user",
            content: `Negocio: ${business}\nCategoría: ${category}\n\nResultados de la evaluación:\n${evalText}`,
          }],
        }),
      });
      const d = await r.json();
      if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });
      const t = (d.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(t));
    }

    return NextResponse.json({ error: "Missing prompt or messages" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
