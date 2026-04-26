import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `Eres el motor de cotización de PartySon en Baja California, México. Analiza el evento y devuelve SOLO JSON válido sin backticks ni texto extra con esta estructura exacta: {"tipo":"string","personas":number,"presupuesto_total":number,"resumen":"string (1 oración)","servicios":[{"categoria":"string (una de: sonido, catering, decoracion, fotografia, salon, entretenimiento, pastel, transporte)","nombre":"string","descripcion":"string","presupuesto_sugerido":number,"prioridad":"alta o media o baja"}]}. Ajusta precios a Tijuana/Baja California.`,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "{}";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }
}
