"use client";
import { useState } from "react";

const BLUE   = "#1B6FE8";
const BLUE_L = "#EBF1FD";
const PURPLE_M = "#3d1560";
const PURPLE_L = "#ede8f5";
const ORANGE = "#FF6B2B";
const ORANGE_L = "#FFF0EB";
const GRAY1  = "#111";
const GRAY3  = "#888";
const BORDER = "#e4e4e4";
const WHITE  = "#fff";
const GRAY6  = "#f8f8f8";

const TIERS = {
  starter: { label: "Starter", price: "$28,000" },
  pro:     { label: "Pro",     price: "$55,000" },
  vip:     { label: "VIP",     price: "$89,000" },
};

const PACKAGE_DATA = {
  starter: {
    emoji: "🌸",
    heroGradient: "linear-gradient(135deg,#1a0a2e,#4a1580)",
    name: "Reina XV Starter",
    badges: [{ label: "👑 XV Años", style: { background: PURPLE_L, color: PURPLE_M } }],
    desc: "Paquete esencial para una celebración hermosa y memorable. Incluye salón, catering, DJ, fotografía, flores y pastel para hasta 150 invitados.",
  },
  pro: {
    emoji: "👑",
    heroGradient: "linear-gradient(135deg,#1a0a2e,#5b1c9f)",
    name: "Reina XV Pro",
    badges: [
      { label: "👑 XV Años",  style: { background: PURPLE_L, color: PURPLE_M } },
      { label: "⭐ Popular",  style: { background: BLUE_L,   color: BLUE } },
    ],
    desc: "La experiencia completa con show de streaming "Reina Live", mesa de regalos digital y todos los servicios premium para que tu fiesta sea inolvidable.",
  },
  vip: {
    emoji: "✦",
    heroGradient: "linear-gradient(135deg,#1a0a2e,#3d1560,#6b2f9e)",
    name: "Reina XV VIP",
    badges: [
      { label: "✦ VIP",      style: { background: "#FFF9E0", color: "#5c3800" } },
      { label: "👗 Exclusivo", style: { background: ORANGE_L, color: ORANGE } },
    ],
    desc: "Experiencia sin límites. Coordinadora exclusiva, vestido de diseñador, joyería, limousine, maquillaje profesional y todo lo que puedas imaginar.",
  },
};

export default function ExperienciaDetalle({ packageId = "pro", onBack, onFinanciar }) {
  const [activeTier, setActiveTier] = useState(packageId);
  const pkg = PACKAGE_DATA[activeTier] || PACKAGE_DATA.pro;

  return (
    <div style={{ minHeight: "100vh", background: WHITE, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .tier-btn { transition: all 0.15s; }
        .tier-btn:hover { border-color: ${BLUE} !important; }
        .det-cta:hover { opacity: 0.9; }
        .det-cta { transition: opacity 0.15s; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Hero */}
      <div style={{ height: 160, background: pkg.heroGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
        <button
          onClick={onBack}
          style={{ position: "absolute", top: 12, left: 14, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
        >← Volver</button>
        {pkg.emoji}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 16px" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: GRAY1, marginBottom: 8 }}>
          {pkg.name}
        </div>
        <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
          {pkg.badges.map((b, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 999, ...b.style }}>{b.label}</span>
          ))}
        </div>

        {/* Tier selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {Object.entries(TIERS).map(([id, t]) => (
            <div
              key={id}
              className="tier-btn"
              onClick={() => setActiveTier(id)}
              style={{
                border: `1.5px solid ${activeTier === id ? BLUE : BORDER}`,
                background: activeTier === id ? BLUE_L : GRAY6,
                borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: GRAY1 }}>{t.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginTop: 3 }}>{t.price}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: GRAY3, lineHeight: 1.7, marginBottom: 18 }}>{pkg.desc}</p>

        {/* What's included */}
        <div style={{ background: GRAY6, borderRadius: 14, padding: "12px 14px", marginBottom: 18, border: `0.5px solid ${BORDER}` }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: GRAY1, marginBottom: 10 }}>¿Qué incluye?</div>
          {activeTier === "starter" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["🏛️ Salón", "🍽️ Catering", "🎵 DJ", "📸 Fotografía", "🌸 Flores básicas", "🎂 Pastel"].map(item => (
                <span key={item} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 999, background: WHITE, border: `0.5px solid ${BORDER}`, color: GRAY1 }}>{item}</span>
              ))}
            </div>
          )}
          {activeTier === "pro" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["🏛️ Salón Premium", "🍽️ Catering Gourmet", "🎵 DJ + Lights", "📺 Reina Live", "📸 Foto + Video", "🌸 Flores Premium", "🎂 Pastel 5 pisos", "🎁 Mesa regalos", "🧴 Perfume pers."].map(item => (
                <span key={item} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 999, background: WHITE, border: `0.5px solid ${BORDER}`, color: GRAY1 }}>{item}</span>
              ))}
            </div>
          )}
          {activeTier === "vip" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["✦ Todo Pro", "👗 Vestido diseñador", "💎 Joyería", "🚗 Limousine", "💄 Maquillaje pro", "🎠 Arco fotográfico", "🍾 Brindis especial", "👑 Tiara real"].map(item => (
                <span key={item} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 999, background: WHITE, border: `0.5px solid ${BORDER}`, color: GRAY1 }}>{item}</span>
              ))}
            </div>
          )}
        </div>

        {/* CTAs */}
        <button
          className="det-cta"
          style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, background: BLUE, color: WHITE, cursor: "pointer", fontFamily: "'Syne',sans-serif", boxShadow: "0 4px 14px rgba(27,111,232,0.3)", marginBottom: 10 }}
        >
          Cotizar ahora — {TIERS[activeTier].price} MXN
        </button>

        <button
          className="det-cta"
          onClick={onFinanciar}
          style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px 16px", cursor: "pointer", background: `linear-gradient(135deg,#3d1560,#6b2f9e)`, color: WHITE, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 14px rgba(61,21,96,0.25)", textAlign: "left" }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>💳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Financiar este evento</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Kueski, Afirme, HSBC y más opciones</div>
          </div>
          <span style={{ fontSize: 18, opacity: 0.7 }}>›</span>
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
