"use client";

const NAVY  = "#1a1a2e";
const NAVY2 = "#16213e";
const BLUE  = "#1B6FE8";
const BLUE_L = "#EBF1FD";
const GOLD  = "#FFD600";
const PURPLE_L = "#ede8f5";
const GRAY1 = "#111";
const GRAY3 = "#888";
const BORDER = "#e4e4e4";
const WHITE  = "#fff";
const GRAY6  = "#f8f8f8";

const STATS = [
  { val: "$42,800", label: "Comisiones" },
  { val: "18",      label: "Eventos XV" },
  { val: "4.9★",    label: "Rating" },
];

const ACTIONS = [
  { icon: "🔗", bg: BLUE_L,    name: "Mi link Reina XV",         sub: "reinaxv.mx/ref/cmendoza" },
  { icon: "👑", bg: PURPLE_L,  name: "Leads de XV activos",      sub: "5 cotizaciones pendientes" },
  { icon: "🤖", bg: "#FFF7ED", name: "Asistente IA ventas XV",   sub: "Scripts y manejo de objeciones" },
  { icon: "💰", bg: "#F0FDF4", name: "Retirar comisiones",       sub: "$12,400 disponibles → SPEI" },
  { icon: "📅", bg: "#EFF6FF", name: "Calendario Agosto XV",     sub: "3 de tus clientes en agosto" },
];

export default function PartnerScreen({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: GRAY6, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pa-btn { transition: all 0.15s; }
        .pa-btn:hover { transform: translateX(3px); }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "12px 16px 18px" }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}
        >← Volver</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 2 }}>Carlos Mendoza</div>
            <div style={{ fontSize: 10, color: GOLD, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>⭐ Partner Gold · Reina XV Specialist</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: WHITE }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: WHITE, padding: "12px 16px", borderBottom: `0.5px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: GRAY3, marginBottom: 6 }}>
          <span>Progreso a Partner Platinum</span>
          <span style={{ color: BLUE, fontWeight: 600 }}>68%</span>
        </div>
        <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3 }}>
          <div style={{ height: "100%", width: "68%", borderRadius: 3, background: `linear-gradient(90deg, ${BLUE}, ${GOLD})` }} />
        </div>
        <div style={{ fontSize: 9, color: GRAY3, marginTop: 4 }}>$13,200 más en comisiones para subir de nivel</div>
      </div>

      {/* Actions */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: GRAY1, marginBottom: 2, paddingLeft: 2 }}>Acciones rápidas</div>
        {ACTIONS.map((a, i) => (
          <button
            key={i}
            className="pa-btn"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 14, border: `0.5px solid ${BORDER}`, background: WHITE, cursor: "pointer", textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", width: "100%" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: GRAY1 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: GRAY3, marginTop: 1 }}>{a.sub}</div>
            </div>
            <div style={{ color: "#bbb", fontSize: 16 }}>›</div>
          </button>
        ))}
      </div>

      {/* CTA nuevo lead */}
      <div style={{ padding: "4px 14px 24px" }}>
        <button style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px 16px", cursor: "pointer", background: `linear-gradient(135deg, ${BLUE} 0%, #1044b8 100%)`, color: WHITE, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 14px rgba(27,111,232,0.3)", textAlign: "left" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>➕</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Registrar nuevo lead XV</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Captura datos y genera cotización automática</div>
          </div>
          <span style={{ fontSize: 18, opacity: 0.7 }}>›</span>
        </button>
      </div>
    </div>
  );
}
