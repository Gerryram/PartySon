import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    const key = process.env.ANTHROPIC_API_KEY;
    console.log("KEY DEBUG:", key ? `${key.substring(0,10)}...` : "UNDEFINED");

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "Devuelve SOLO JSON sin backticks ni markdown. Campos requeridos: tipo, personas, presupuesto_total, resumen, servicios (array con: categoria, nombre, descripcion, presupuesto_sugerido, prioridad). Categorías válidas: salon, sonido, catering, decoracion, fotografia, entretenimiento, pastel, transporte. Prioridades: alta, media, baja.",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const d = await r.json();
    console.log("ANTHROPIC RESPONSE:", JSON.stringify(d).substring(0, 200));
    if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });

    const t = (d.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(t));
  } catch (e) {
    console.log("CATCH ERROR:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
