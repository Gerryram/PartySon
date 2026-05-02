"use client";
import { useState, useRef } from "react";

const C = {
  purple: "#1a0a2e",
  purpleM: "#3d1560",
  purpleL: "#ede8f5",
  gold: "#FFD600",
  blue: "#1B6FE8",
  gray1: "#111",
  gray2: "#444",
  gray3: "#888",
  gray4: "#bbb",
  gray5: "#f0f0f0",
  gray6: "#f8f8f8",
  border: "#e4e4e4",
  white: "#fff",
};

const PAQUETES = [
  {
    id: "starter",
    badge: "Starter",
    badgeStyle: { background: "#f1f5f9", color: "#475569" },
    name: "Reina XV Starter",
    desc: "Paquete esencial para una celebración hermosa y memorable. Ideal para hasta 150 invitados.",
    includes: ["🏛️ Salón", "🍽️ Catering", "🎵 DJ", "📸 Foto", "🌸 Flores básicas", "🎂 Pastel"],
    price: "$28,000 MXN",
    cta: "Ver más",
    featured: false,
    vip: false,
  },
  {
    id: "pro",
    badge: "Pro",
    badgeStyle: { background: "#ede8f5", color: "#3d1560" },
    name: "Reina XV Pro",
    desc: 'La experiencia completa con show de streaming "Reina Live" incluido y mesa de regalos digital.',
    includes: [
      "🏛️ Salón Premium", "🍽️ Catering Gourmet", "🎵 DJ + Lights", "📺 Reina Live",
      "📸 Foto + Video", "🌸 Flores Premium", "🎂 Pastel 5 pisos", "🎁 Mesa regalos", "🧴 Perfume pers.",
    ],
    price: "$55,000 MXN",
    cta: "Cotizar",
    featured: true,
    vip: false,
    popular: true,
  },
  {
    id: "vip",
    badge: "✦ VIP",
    badgeStyle: { background: "linear-gradient(90deg,#FFD600 0%,#ffb300 100%)", color: "#5c3800" },
    name: "Reina XV VIP",
    desc: "Experiencia sin límites. Coordinadora exclusiva, vestido de diseñador y todos los servicios premium.",
    includes: [
      "✦ Todo Pro incluido", "👗 Vestido diseñador", "💎 Joyería", "🚗 Limousine",
      "💄 Maquillaje pro", "🎠 Arco fotográfico", "🍾 Brindis especial", "👑 Tiara real",
    ],
    price: "$89,000 MXN",
    priceGold: true,
    cta: "Reservar",
    featured: false,
    vip: true,
  },
];

const EXPERIENCIAS = [
  { color: "#7c3aed", icon: "📺", name: "Reina Live — Show de Streaming",           desc: "Transmisión en vivo tipo TV con conductor, entrevistas y juegos",                      price: "+$8,500 MXN" },
  { color: "#f43f5e", icon: "🧴", name: "Mesa de Regalos — Perfumes Personalizados", desc: "Fragancia exclusiva con nombre y diseño de la festejada",                              price: "+$4,200 MXN" },
  { color: "#f59e0b", icon: "🎁", name: "Mesa de Regalos Digital",                   desc: "Landing personalizada, pagos digitales, entrega el día del evento",                    price: "+$1,800 MXN" },
  { color: "#059669", icon: "🚗", name: "Traslado en Limousine",                      desc: "Llegada espectacular de la quinceañera con decoración y champagne",                    price: "+$6,000 MXN" },
  { color: "#1B6FE8", icon: "🎠", name: "Arco Floral Fotográfico",                   desc: "Arco de flores naturales con iluminación y fondo personalizado",                       price: "+$3,500 MXN" },
  { color: "#ec4899", icon: "💄", name: "Glam Experience — Maquillaje + Peinado",    desc: "Sesión profesional para la festejada y hasta 3 chambelanes",                          price: "+$5,200 MXN" },
];

const FIN_OPTIONS = [
  { id: "kueski", icon: "⚡", name: "Kueski Pay",        sub: "Aprobación inmediata en línea", tag: "Hasta 12 MSI",      tagStyle: { background: "#e0f2fe", color: "#0369a1" } },
  { id: "afirme", icon: "🏦", name: "Afirme Crédito",    sub: "Para montos > $60k MXN",        tag: "Hasta 24 MSI",      tagStyle: { background: "#f0fdf4", color: "#166534" } },
  { id: "hsbc",   icon: "🌐", name: "HSBC Plan",          sub: "Meses sin intereses",            tag: "6 / 12 / 18 MSI",  tagStyle: { background: "#fdf4ff", color: "#7e22ce" } },
  { id: "spei",   icon: "💸", name: "Pago directo SPEI",  sub: "5% descuento al liquidar",       tag: "Descuento especial", tagStyle: { background: "#fff7ed", color: "#9a3412" } },
];

const FILTERS = [
  { id: "all",             label: "Todo" },
  { id: "paquetes",        label: "Paquetes" },
  { id: "exclusivas",      label: "Exclusivas" },
  { id: "agosto",          label: "Agosto" },
  { id: "financiamiento",  label: "💳 Financiamiento" },
];

export default function ReinaXVScreen({ onBack, onCotizador, onPackageDetail }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [plazo, setPlazo] = useState(12);
  const [selectedFin, setSelectedFin] = useState(null);
  const finRef = useRef(null);

  const total = 55000;
  const anticipo = total * 0.2;
  const monthly = Math.round((total - anticipo) / plazo / 10) * 10;

  const showPaquetes   = activeFilter === "all" || activeFilter === "paquetes";
  const showExclusivas = activeFilter === "all" || activeFilter === "exclusivas";
  const showAgosto     = activeFilter === "all" || activeFilter === "agosto";
  const showFin        = activeFilter === "all" || activeFilter === "financiamiento";

  function handleFilter(id) {
    setActiveFilter(id);
    if (id === "financiamiento") {
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0eff5", fontFamily: "'DM Sans', sans-serif", color: C.gray1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .xv-pack  { cursor:pointer; transition:transform 0.15s; }
        .xv-pack:active { transform:scale(0.98); }
        .excl-row { transition:transform 0.15s; cursor:pointer; }
        .excl-row:hover { transform:translateX(3px); }
        .fin-opt  { transition:all 0.15s; cursor:pointer; }
        .fin-opt:active { transform:scale(0.97); }
        .xv-cta-btn { transition:all 0.15s; }
        .xv-cta-btn:active { transform:scale(0.98); }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(150deg,#1a0a2e 0%,#4a1580 60%,#6b2f9e 100%)",
        padding: "12px 16px 20px", position: "relative", overflow: "hidden",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)", padding: "5px 12px", borderRadius: 999,
            fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 10,
          }}
        >← Volver</button>
        <div style={{ position: "absolute", right: 16, top: 8, fontSize: 40, color: "rgba(255,214,0,0.12)", pointerEvents: "none" }}>✦</div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: "uppercase", marginBottom: 4 }}>
          PartySon — División Especializada
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1, marginBottom: 2 }}>
          Reina <span style={{ color: C.gold }}>XV</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 12 }}>
          Tu gran noche, perfectamente orquestada
        </div>
        <div style={{
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999, padding: "8px 14px", fontSize: 11,
          color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", gap: 8,
        }}>
          🔍 <span>Buscar servicio o fecha disponible...</span>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => handleFilter(f.id)}
            style={{
              flexShrink: 0, fontSize: 10, fontWeight: 500, padding: "5px 12px", borderRadius: 999,
              border: `1px solid ${activeFilter === f.id ? C.purpleM : "rgba(61,21,96,0.25)"}`,
              background: activeFilter === f.id ? C.purpleM : C.purpleL,
              color: activeFilter === f.id ? C.gold : C.purpleM,
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.15s",
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* ── Agosto Banner ── */}
      {showAgosto && (
        <div style={{
          margin: "4px 14px 10px",
          background: "linear-gradient(90deg,#f0b840 0%,#ff9d00 100%)",
          borderRadius: 16, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "#3d2000", marginBottom: 1 }}>
              Agosto Colectivo — ¡35% de ahorro!
            </div>
            <div style={{ fontSize: 9.5, color: "rgba(61,32,0,0.7)" }}>
              Múltiples fiestas, mismo salón. Lugares limitados.
            </div>
          </div>
          <span style={{
            background: "rgba(0,0,0,0.12)", borderRadius: 999,
            fontSize: 9, fontWeight: 700, padding: "3px 8px", color: "#3d2000", whiteSpace: "nowrap",
          }}>12 fechas</span>
        </div>
      )}

      {/* ── Paquetes ── */}
      {showPaquetes && (
        <>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.gray1, padding: "4px 14px 8px" }}>
            Paquetes XV
          </div>
          <div style={{ padding: "0 14px 8px" }}>
            {PAQUETES.map(p => (
              <div
                key={p.id}
                className="xv-pack"
                style={{
                  borderRadius: 16,
                  border: p.featured ? `1.5px solid ${C.purpleM}` : `1px solid ${C.border}`,
                  background: C.white, marginBottom: 10, overflow: "hidden",
                  boxShadow: p.featured
                    ? "0 4px 16px rgba(61,21,96,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: "3px 8px",
                      borderRadius: 999, textTransform: "uppercase", display: "inline-block",
                      ...p.badgeStyle,
                    }}>{p.badge}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.gray1, margin: "4px 0 2px" }}>
                      {p.name}
                    </div>
                  </div>
                  {p.popular && (
                    <div style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: C.purpleM, color: C.white }}>
                      ⭐ Popular
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 10, color: C.gray3, lineHeight: 1.4, marginBottom: 8, padding: "0 14px" }}>
                  {p.desc}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "0 14px 10px" }}>
                  {p.includes.map((item, i) => (
                    <span key={i} style={{
                      fontSize: 9.5, padding: "3px 8px", borderRadius: 999,
                      background: C.gray6, color: C.gray2, border: `0.5px solid ${C.border}`,
                    }}>{item}</span>
                  ))}
                </div>
                <div style={{
                  borderTop: `0.5px solid ${C.border}`, padding: "10px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", background: C.gray6,
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.gray3 }}>Desde</div>
                    <div style={{
                      fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800,
                      color: p.priceGold ? C.purpleM : C.blue,
                    }}>{p.price}</div>
                  </div>
                  <button
                    onClick={() => onPackageDetail?.(p.id)}
                    style={{
                      fontSize: 10, fontWeight: 600, padding: "6px 14px", borderRadius: 999, border: "none",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                      background: p.vip
                        ? "linear-gradient(90deg,#FFD600 0%,#ffb300 100%)"
                        : p.featured ? C.purpleM : C.blue,
                      color: p.vip ? "#5c3800" : C.white,
                    }}>{p.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Experiencias Exclusivas ── */}
      {showExclusivas && (
        <>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.gray1, padding: "4px 14px 8px" }}>
            Experiencias exclusivas
          </div>
          <div style={{ padding: "0 14px 8px" }}>
            {EXPERIENCIAS.map((e, i) => (
              <div
                key={i}
                className="excl-row"
                style={{
                  borderRadius: 16, overflow: "hidden", marginBottom: 8,
                  border: `0.5px solid ${C.border}`,
                  display: "flex", alignItems: "stretch", height: 72,
                  background: C.white, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ width: 4, background: e.color, flexShrink: 0 }} />
                <div style={{ width: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {e.icon}
                </div>
                <div style={{ flex: 1, padding: "10px 10px 10px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: C.gray1, marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 9.5, color: C.gray3, lineHeight: 1.3 }}>{e.desc}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.blue, marginTop: 2 }}>{e.price}</div>
                </div>
                <div style={{ paddingRight: 12, display: "flex", alignItems: "center", color: C.gray4, fontSize: 14 }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Cotizador Princesa CTA ── */}
      {(activeFilter === "all" || activeFilter === "paquetes") && (
        <div style={{ padding: "0 14px 14px" }}>
          <button
            className="xv-cta-btn"
            onClick={() => onCotizador?.()}
            style={{
              width: "100%", border: "none", borderRadius: 16, padding: "14px 16px", cursor: "pointer",
              background: `linear-gradient(135deg, ${C.purpleM} 0%, #6b2f9e 100%)`,
              color: C.white, display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 4px 14px rgba(61,21,96,0.25)", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>🤖</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Cotizar con Princesa IA</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>Cuéntanos tu evento y te armamos la propuesta</div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.7, flexShrink: 0 }}>›</span>
          </button>
        </div>
      )}

      {/* ── Financiamiento ── */}
      {showFin && (
        <div ref={finRef} style={{ padding: "0 14px 14px" }}>
          <div style={{ height: 0.5, background: C.border, margin: "4px 0 10px" }} />
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.gray1, marginBottom: 8 }}>
            💳 Financia tu fiesta de XV
          </div>

          {/* CTA calcular */}
          <button
            className="xv-cta-btn"
            onClick={() => finRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              width: "100%", border: "none", borderRadius: 16, padding: "14px 16px", cursor: "pointer",
              background: "linear-gradient(135deg,#1B6FE8 0%,#1044b8 100%)",
              color: C.white, display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
              boxShadow: "0 4px 14px rgba(27,111,232,0.3)", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>🧮</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Calcular mi plan de pagos</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>Sin aval · Desde 3 meses · Aprobación inmediata</div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.7, flexShrink: 0 }}>›</span>
          </button>

          {/* Calculadora */}
          <div style={{ background: C.gray6, borderRadius: 16, border: `0.5px solid ${C.border}`, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.gray2, marginBottom: 8 }}>Simulador de financiamiento</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.blue, marginBottom: 6 }}>
              ${monthly.toLocaleString("es-MX")} MXN/mes
            </div>
            {[
              ["Total del paquete",  `$${total.toLocaleString("es-MX")}`],
              ["Plazo seleccionado", `${plazo} meses`],
              ["Anticipo (20%)",     `$${anticipo.toLocaleString("es-MX")}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.gray3, marginBottom: 3 }}>
                <span>{label}</span>
                <strong style={{ color: C.gray1, fontWeight: 600 }}>{val}</strong>
              </div>
            ))}
            <input
              type="range" min="3" max="24" step="3" value={plazo}
              onChange={e => setPlazo(Number(e.target.value))}
              style={{ width: "100%", margin: "8px 0", accentColor: C.blue }}
            />
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
              {[3, 6, 12, 18, 24].map(m => (
                <button
                  key={m}
                  onClick={() => setPlazo(m)}
                  style={{
                    fontSize: 9, fontWeight: 600, padding: "3px 9px", borderRadius: 999,
                    border: `1px solid ${plazo === m ? C.blue : C.border}`,
                    background: plazo === m ? C.blue : C.white,
                    color: plazo === m ? C.white : C.gray2,
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s",
                  }}
                >{m} meses</button>
              ))}
            </div>
          </div>

          {/* Opciones financieras */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 8 }}>
            {FIN_OPTIONS.map(opt => (
              <div
                key={opt.id}
                className="fin-opt"
                onClick={() => setSelectedFin(opt.id)}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${selectedFin === opt.id ? C.purpleM : C.border}`,
                  background: selectedFin === opt.id ? C.purpleL : C.white,
                  padding: 10, display: "flex", flexDirection: "column", gap: 3,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: 18 }}>{opt.icon}</span>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.gray1 }}>{opt.name}</div>
                <div style={{ fontSize: 9, color: C.gray3 }}>{opt.sub}</div>
                <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 999, width: "fit-content", marginTop: 2, ...opt.tagStyle }}>
                  {opt.tag}
                </span>
              </div>
            ))}
          </div>

          {/* CTA solicitar */}
          <button
            className="xv-cta-btn"
            onClick={() => alert("¡Solicitud iniciada! El asesor de Reina XV te contactará en 2 horas.")}
            style={{
              width: "100%", border: "none", borderRadius: 16, padding: "14px 16px", cursor: "pointer",
              background: "linear-gradient(135deg,#3d1560,#6b2f9e)",
              color: C.white, display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 4px 14px rgba(61,21,96,0.3)", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Solicitar financiamiento</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>Un asesor te contacta en &lt; 2 horas</div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.7, flexShrink: 0 }}>›</span>
          </button>
          <div style={{ height: 10 }} />
        </div>
      )}
    </div>
  );
}
