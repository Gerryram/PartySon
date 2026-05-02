"use client";
import { useState, useRef, useEffect } from "react";

const PURPLE  = "#1a0a2e";
const PURPLE_M = "#3d1560";
const BLUE    = "#1B6FE8";
const GOLD    = "#FFD600";
const GRAY1   = "#111";
const GRAY3   = "#888";
const GRAY5   = "#f0f0f0";
const BORDER  = "#e4e4e4";
const WHITE   = "#fff";

const FLOWS = [
  {
    reply: "¡Perfecto! Agosto es nuestro mes estrella con descuentos de hasta 35% 🎉 ¿Para cuántos invitados aproximadamente?",
    opts: ["Menos de 100", "100 – 200", "Más de 200"],
  },
  {
    reply: "Excelente. ¿Qué paquete te llama más la atención?",
    opts: ["Starter – $28,000", "Pro – $55,000 ★", "VIP – $89,000"],
  },
  {
    reply: "Buena elección 👑 ¿Te interesa agregar el show de streaming \"Reina Live\"?",
    opts: ["Sí, con streaming", "Solo el paquete base", "Cuéntame más"],
  },
  {
    reply: "¡Genial! Aquí está tu propuesta completa. ¿Quieres que te la enviemos por WhatsApp con las opciones de financiamiento?",
    opts: ["Sí, por WhatsApp", "Ver financiamiento", "Descargar PDF"],
  },
  {
    reply: "¡Listo! Un asesor de Reina XV te contactará en menos de 2 horas con tu cotización personalizada. 🎊",
    opts: [],
  },
];

export default function CotizadorPrincesa({ onBack }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy Princesa, tu asistente de Reina XV 👑\n¿Para cuándo estás pensando la fiesta?" },
  ]);
  const [opts, setOpts] = useState(["Este año — agosto", "Este año — otro mes", "2026"]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text) {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: "user", text }]);
    setOpts([]);
    setInput("");
    setTyping(true);

    const flow = FLOWS[step % FLOWS.length];
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: flow.reply }]);
      setOpts(flow.opts);
      setStep(s => s + 1);
    }, 700);
  }

  return (
    <div style={{ minHeight: "100vh", background: WHITE, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .opt-chip { transition: all 0.15s; }
        .opt-chip:hover { background: ${BLUE} !important; color: ${WHITE} !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_M} 100%)`, padding: "12px 16px 14px", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}
        >← Volver</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,214,0,0.2)", border: "1.5px solid rgba(255,214,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👑</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: WHITE }}>Cotizador IA — Princesa</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Tu asistente personal para Reina XV</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>En línea</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 4px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            {msg.from === "bot" && (
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_M})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginRight: 6, flexShrink: 0, alignSelf: "flex-end" }}>👑</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "9px 12px", borderRadius: msg.from === "user" ? "14px 3px 14px 14px" : "3px 14px 14px 14px",
              background: msg.from === "user" ? BLUE : GRAY5,
              color: msg.from === "user" ? WHITE : GRAY1,
              fontSize: 11, lineHeight: 1.55,
              whiteSpace: "pre-line",
            }}>{msg.text}</div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_M})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👑</div>
            <div style={{ background: GRAY5, borderRadius: "3px 14px 14px 14px", padding: "10px 14px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: GRAY3, animation: `bounce 1s ${i * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
        <div ref={bottomRef} />
      </div>

      {/* Option chips */}
      {opts.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "6px 14px 10px" }}>
          {opts.map((o, i) => (
            <button
              key={i}
              className="opt-chip"
              onClick={() => sendMessage(o)}
              style={{ fontSize: 10, padding: "6px 13px", borderRadius: 999, border: `1px solid ${BLUE}`, color: BLUE, cursor: "pointer", background: WHITE, fontFamily: "'DM Sans',sans-serif" }}
            >{o}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "8px 14px 14px", display: "flex", gap: 8, borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Escribe aquí..."
          style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "9px 14px", fontSize: 11, color: GRAY1, fontFamily: "'DM Sans',sans-serif", outline: "none", background: WHITE }}
        />
        <button
          onClick={() => sendMessage(input)}
          style={{ width: 34, height: 34, borderRadius: "50%", background: BLUE, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: WHITE, fontSize: 15, flexShrink: 0 }}
        >↑</button>
      </div>
    </div>
  );
}
