import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Vision analysis (image + prompt from Casatec/Pintatec)
    const messages = body.messages;
    if (!messages) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

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
        messages,
      }),
    });

    const d = await r.json();
    if (d.error) return NextResponse.json({ error: d.error.message }, { status: 500 });

    const text = d.content?.find((b) => b.type === "text")?.text || "Sin respuesta.";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
