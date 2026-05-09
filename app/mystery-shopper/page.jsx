"use client";
import { useState } from "react";

// ── BRAND ────────────────────────────────────────────────────────────────
const BRAND = { name: "AUDITORTJ", sub: "Auditoría de experiencia · B.C." };

// ── MOCK MISSIONS ────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 1, business: "Restaurante El Greco", category: "restaurante", emoji: "🍽️",
    location: "Zona Río, Tijuana", pay: 350, deadline: "2026-05-15",
    duration: "60–90 min",
    requirements: ["Ordenar 1 platillo principal", "Evaluar tiempo de espera", "Tomar 2 fotos discretas del área"],
    color: "#F59E0B", status: "disponible",
  },
  {
    id: 2, business: "Salon de Belleza Nova", category: "salon", emoji: "💇",
    location: "Playas, Tijuana", pay: 280, deadline: "2026-05-18",
    duration: "45–60 min",
    requirements: ["Solicitar corte básico o manicure", "Evaluar limpieza e higiene", "Registrar tiempo de espera"],
    color: "#EC4899", status: "disponible",
  },
  {
    id: 3, business: "Ferretería del Norte", category: "retail", emoji: "🔧",
    location: "Centro, Tijuana", pay: 200, deadline: "2026-05-20",
    duration: "30–45 min",
    requirements: ["Solicitar ayuda para encontrar producto", "Evaluar conocimiento del vendedor", "Simular consulta de precio"],
    color: "#3B82F6", status: "disponible",
  },
  {
    id: 4, business: "Clínica Dental Smile+", category: "salud", emoji: "🦷",
    location: "Otay, Tijuana", pay: 450, deadline: "2026-05-22",
    duration: "30 min",
    requirements: ["Agendar y asistir a cita de evaluación", "Evaluar instalaciones y trato", "Registrar tiempos de espera"],
    color: "#10B981", status: "disponible",
  },
  {
    id: 5, business: "Hotel Casa Riviera", category: "hotel", emoji: "🏨",
    location: "Rosarito, B.C.", pay: 600, deadline: "2026-05-25",
    duration: "2–3 hrs",
    requirements: ["Realizar check-in como huésped", "Evaluar limpieza de habitación", "Probar servicio a cuarto"],
    color: "#8B5CF6", status: "disponible",
  },
];

const CATEGORY_LABELS = {
  restaurante: "Restaurante",
  salon: "Salón de Belleza",
  retail: "Comercio",
  salud: "Salud",
  hotel: "Hotel / Hostelería",
};

// ── EVALUATION SECTIONS ──────────────────────────────────────────────────
const EVAL_SECTIONS = [
  {
    id: "impresion",
    title: "Primera Impresión",
    emoji: "👁️",
    fields: [
      { key: "limpieza_exterior", label: "Limpieza exterior / fachada", type: "rating" },
      { key: "senalizacion", label: "Señalización y visibilidad", type: "rating" },
      { key: "apariencia_personal", label: "Apariencia del personal", type: "rating" },
      { key: "nota_impresion", label: "Observaciones", type: "textarea", placeholder: "Describe tu primera impresión al llegar..." },
    ],
  },
  {
    id: "atencion",
    title: "Atención al Cliente",
    emoji: "🤝",
    fields: [
      { key: "saludo", label: "Saludo y bienvenida", type: "rating" },
      { key: "tiempo_atencion", label: "Tiempo de espera para ser atendido", type: "select", options: ["< 1 min", "1–3 min", "3–5 min", "5–10 min", "> 10 min"] },
      { key: "amabilidad", label: "Amabilidad y disposición", type: "rating" },
      { key: "conocimiento", label: "Conocimiento del producto/servicio", type: "rating" },
      { key: "nota_atencion", label: "Observaciones", type: "textarea", placeholder: "¿Cómo te trató el personal?" },
    ],
  },
  {
    id: "servicio",
    title: "Servicio / Producto",
    emoji: "⭐",
    fields: [
      { key: "calidad", label: "Calidad del servicio o producto", type: "rating" },
      { key: "presentacion", label: "Presentación e higiene", type: "rating" },
      { key: "precio_valor", label: "Relación precio–valor", type: "rating" },
      { key: "nota_servicio", label: "Observaciones", type: "textarea", placeholder: "Describe el servicio o producto recibido..." },
    ],
  },
  {
    id: "cierre",
    title: "Cobro y Salida",
    emoji: "💳",
    fields: [
      { key: "proceso_cobro", label: "Eficiencia del proceso de cobro", type: "rating" },
      { key: "ticket_recibo", label: "¿Se entregó ticket/recibo?", type: "select", options: ["Sí, sin pedirlo", "Sí, al pedirlo", "No se entregó"] },
      { key: "despedida", label: "Despedida y cierre", type: "rating" },
      { key: "nota_cierre", label: "Observaciones finales", type: "textarea", placeholder: "¿Cómo fue la despedida? ¿Algo que destacar al salir?" },
    ],
  },
];

// ── STYLES ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0F0A14; --bg2: #160E22; --bg3: #1C1230;
    --surface: #221640; --violet: #8B5CF6; --violet2: #7C3AED;
    --amber: #F59E0B; --text: #EDE9FE; --muted: #7C6FA0;
    --border: rgba(139,92,246,0.15); --radius: 14px;
    --red: #EF4444; --green: #10B981;
  }
  body, html { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; }
  .app { max-width: 440px; margin: 0 auto; min-height: 100vh; background: var(--bg); overflow: hidden; }
  .screen { min-height: 100vh; overflow-y: auto; padding-bottom: 80px; animation: fadeUp .2s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  /* TOP BAR */
  .top-bar { position: sticky; top:0; z-index:20; background: rgba(15,10,20,0.92);
    backdrop-filter: blur(16px); padding: 14px 20px 12px;
    border-bottom: 1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: var(--violet); }
  .brand-sub { font-size: 9px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
  .back-btn { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--muted);
    cursor:pointer; padding: 6px 0; }
  .back-btn:hover { color: var(--text); }

  /* HERO */
  .hero { padding: 24px 20px 20px; background: linear-gradient(160deg,var(--bg2) 0%,var(--bg3) 100%); }
  .hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(139,92,246,0.15);
    border:1px solid rgba(139,92,246,0.3); border-radius:20px; padding:4px 12px; margin-bottom:12px; }
  .hero-badge span { font-size:10px; color:var(--violet); font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .hero-title { font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing:-1px; }
  .hero-title em { color: var(--violet); font-style:normal; }
  .hero-sub { font-size: 13px; color:var(--muted); margin-top:8px; line-height:1.5; }

  /* STATS ROW */
  .stats-row { display:flex; gap:10px; padding:16px 20px 0; }
  .stat-chip { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px;
    padding:12px 10px; text-align:center; }
  .stat-val { font-size:20px; font-weight:700; color:var(--amber); }
  .stat-lbl { font-size:10px; color:var(--muted); margin-top:2px; line-height:1.3; }

  /* SECTION HEADER */
  .section-hdr { padding:18px 20px 10px; font-size:10px; font-weight:600;
    letter-spacing:1.5px; text-transform:uppercase; color:var(--muted);
    display:flex; justify-content:space-between; align-items:center; }
  .section-hdr span { color:var(--violet); font-size:10px; }

  /* MISSION CARD */
  .mission-list { display:flex; flex-direction:column; gap:12px; padding:0 20px; }
  .mission-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:16px; cursor:pointer; transition:transform .15s, border-color .15s; position:relative; overflow:hidden; }
  .mission-card:hover { transform:translateY(-2px); border-color:rgba(139,92,246,0.4); }
  .mission-card:active { transform:scale(0.98); }
  .mission-accent { position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:var(--radius) 0 0 var(--radius); }
  .mission-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
  .mission-emoji { font-size:22px; line-height:1; }
  .mission-pay { font-size:18px; font-weight:700; color:var(--amber); }
  .mission-pay-sub { font-size:9px; color:var(--muted); text-align:right; }
  .mission-name { font-size:15px; font-weight:600; color:var(--text); margin-bottom:3px; }
  .mission-cat { font-size:10px; color:var(--muted); font-weight:500; }
  .mission-footer { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
  .chip { display:inline-flex; align-items:center; gap:4px; background:rgba(139,92,246,0.1);
    border:1px solid rgba(139,92,246,0.2); border-radius:8px; padding:3px 8px; font-size:10px; color:var(--muted); }

  /* MISSION DETAIL */
  .mission-detail { padding:0 20px; }
  .detail-hero { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:20px; margin-bottom:16px; text-align:center; }
  .detail-emoji { font-size:44px; margin-bottom:10px; }
  .detail-name { font-size:22px; font-weight:700; margin-bottom:4px; }
  .detail-cat { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
  .info-row { display:flex; justify-content:space-between; padding:10px 0;
    border-bottom:1px solid var(--border); font-size:13px; }
  .info-row:last-child { border-bottom:none; }
  .info-label { color:var(--muted); }
  .info-value { font-weight:500; text-align:right; }
  .req-list { list-style:none; display:flex; flex-direction:column; gap:8px; }
  .req-item { display:flex; align-items:flex-start; gap:10px; font-size:13px; padding:10px 12px;
    background:var(--bg3); border-radius:10px; border:1px solid var(--border); }
  .req-dot { width:6px; height:6px; border-radius:50%; background:var(--violet); flex-shrink:0; margin-top:5px; }

  /* BUTTONS */
  .btn-primary { width:100%; padding:15px; background:var(--violet); color:white; border:none;
    border-radius:var(--radius); font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700;
    cursor:pointer; transition:background .12s, transform .12s; letter-spacing:0.3px; }
  .btn-primary:hover { background:var(--violet2); }
  .btn-primary:active { transform:scale(0.98); }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-secondary { width:100%; padding:13px; background:transparent; color:var(--text);
    border:1px solid var(--border); border-radius:var(--radius); font-family:'Space Grotesk',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer; transition:background .12s; }
  .btn-secondary:hover { background:var(--surface); }
  .pad { padding:0 20px; }
  .mt8{margin-top:8px} .mt12{margin-top:12px} .mt16{margin-top:16px} .mt20{margin-top:20px} .mb16{margin-bottom:16px}

  /* EVALUATION FORM */
  .eval-section-hdr { display:flex; align-items:center; gap:10px; padding:20px 20px 12px; }
  .eval-section-emoji { font-size:22px; }
  .eval-section-title { font-size:18px; font-weight:700; }
  .eval-section-sub { font-size:11px; color:var(--muted); margin-top:1px; }
  .field-group { padding:0 20px 12px; }
  .field-label { font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase;
    letter-spacing:1px; margin-bottom:8px; display:block; }
  .rating-row { display:flex; gap:8px; }
  .rating-btn { flex:1; padding:10px 4px; background:var(--surface); border:1px solid var(--border);
    border-radius:10px; text-align:center; cursor:pointer; transition:all .15s; font-size:12px;
    font-weight:600; color:var(--muted); font-family:'Space Grotesk',sans-serif; }
  .rating-btn.selected { background:rgba(139,92,246,0.25); border-color:var(--violet); color:var(--violet); }
  .rating-btn:hover:not(.selected) { border-color:rgba(139,92,246,0.4); color:var(--text); }
  .form-select { width:100%; padding:12px 14px; background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text); font-family:'Space Grotesk',sans-serif; font-size:14px; outline:none; }
  .form-select option { background:var(--bg); }
  .form-textarea { width:100%; padding:12px 14px; background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text); font-family:'Space Grotesk',sans-serif; font-size:14px;
    outline:none; resize:none; min-height:80px; transition:border-color .15s; }
  .form-textarea:focus { border-color:rgba(139,92,246,0.5); }
  .form-textarea::placeholder { color:var(--muted); }

  /* PROGRESS BAR */
  .progress-wrap { padding:14px 20px 0; }
  .progress-label { display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-bottom:6px; }
  .progress-bar { height:4px; background:var(--surface); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--violet),#C084FC); transition:width .4s ease; }

  /* AI REPORT */
  .report-wrap { padding:0 20px; }
  .score-ring { width:120px; height:120px; margin:0 auto 16px; position:relative; }
  .score-ring svg { transform:rotate(-90deg); }
  .score-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .score-num { font-size:32px; font-weight:700; line-height:1; }
  .score-lbl { font-size:10px; color:var(--muted); margin-top:2px; }
  .report-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; margin-bottom:12px; }
  .report-card h3 { font-size:11px; color:var(--violet); text-transform:uppercase; letter-spacing:1px; font-weight:700; margin-bottom:10px; }
  .report-card p { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }
  .dot-pulse { display:flex; gap:5px; align-items:center; padding:16px; }
  .dot-pulse div { width:7px; height:7px; border-radius:50%; background:var(--violet);
    animation:dp 1.2s ease-in-out infinite; }
  .dot-pulse div:nth-child(2){animation-delay:.2s}
  .dot-pulse div:nth-child(3){animation-delay:.4s}
  @keyframes dp{0%,80%,100%{transform:scale(0.6);opacity:.3}40%{transform:scale(1);opacity:1}}

  /* CONFIRM */
  .confirm-screen { min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; text-align:center; padding:40px 24px; gap:14px; animation:fadeUp .3s ease; }
  .confirm-icon { font-size:56px; }
  .confirm-title { font-size:34px; font-weight:700; line-height:1; letter-spacing:-1px; }
  .confirm-title span { color:var(--violet); }
  .confirm-sub { font-size:13px; color:var(--muted); line-height:1.6; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { display:none; }
`;

// ── RATING FIELD ──────────────────────────────────────────────────────────
function RatingField({ label, value, onChange }) {
  const levels = ["1", "2", "3", "4", "5"];
  const labels = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="rating-row">
        {levels.map((v, i) => (
          <button key={v} className={`rating-btn${value === v ? " selected" : ""}`} onClick={() => onChange(v)}>
            <div>{v}</div>
            <div style={{ fontSize: 9, marginTop: 2, fontWeight: 400 }}>{labels[i]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────────────
function TopBar({ onBack, title }) {
  return (
    <div className="top-bar">
      {onBack ? (
        <div className="back-btn" onClick={onBack}>← {title || "Volver"}</div>
      ) : (
        <div>
          <div className="brand">{BRAND.name}</div>
          <div className="brand-sub">{BRAND.sub}</div>
        </div>
      )}
      <div style={{ fontSize: 22 }}>🕵️</div>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────
function HomeScreen({ onSelectMission }) {
  return (
    <div className="screen">
      <TopBar />
      <div className="hero">
        <div className="hero-badge"><span>Mystery Shopper · Baja California</span></div>
        <div className="hero-title">Audita.<br /><em>Gana.</em> Mejora.</div>
        <div className="hero-sub">Evalúa negocios de forma anónima y recibe pago por tu reporte.</div>
      </div>

      <div className="stats-row">
        {[["$2,150", "Ganado este mes"], ["12", "Auditorías hechas"], ["4.9★", "Tu calificación"]].map(([v, l]) => (
          <div key={l} className="stat-chip">
            <div className="stat-val">{v}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      <div className="section-hdr">
        Misiones disponibles <span>{MISSIONS.length} activas</span>
      </div>

      <div className="mission-list">
        {MISSIONS.map((m) => (
          <div key={m.id} className="mission-card" onClick={() => onSelectMission(m)}>
            <div className="mission-accent" style={{ background: m.color }} />
            <div style={{ paddingLeft: 8 }}>
              <div className="mission-header">
                <div>
                  <div className="mission-emoji">{m.emoji}</div>
                  <div className="mission-name">{m.business}</div>
                  <div className="mission-cat">{CATEGORY_LABELS[m.category]}</div>
                </div>
                <div>
                  <div className="mission-pay">${m.pay}</div>
                  <div className="mission-pay-sub">MXN · pago</div>
                </div>
              </div>
              <div className="mission-footer">
                <span className="chip">📍 {m.location}</span>
                <span className="chip">⏱ {m.duration}</span>
                <span className="chip">📅 Hasta {m.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

// ── MISSION DETAIL SCREEN ─────────────────────────────────────────────────
function MissionScreen({ mission: m, onBack, onAccept }) {
  return (
    <div className="screen">
      <TopBar onBack={onBack} title="Misiones" />
      <div className="mission-detail mt16">
        <div className="detail-hero">
          <div className="detail-emoji">{m.emoji}</div>
          <div className="detail-name">{m.business}</div>
          <div className="detail-cat">{CATEGORY_LABELS[m.category]}</div>
          <div style={{ marginTop: 14, fontSize: 28, fontWeight: 700, color: "#F59E0B" }}>${m.pay} MXN</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>Pago al enviar reporte aprobado</div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0 16px", marginBottom: 16 }}>
          {[
            ["📍 Ubicación", m.location],
            ["⏱ Duración estimada", m.duration],
            ["📅 Límite de entrega", m.deadline],
            ["🏷️ Categoría", CATEGORY_LABELS[m.category]],
          ].map(([label, value]) => (
            <div key={label} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
          Qué debes hacer
        </div>
        <ul className="req-list mb16">
          {m.requirements.map((r, i) => (
            <li key={i} className="req-item">
              <div className="req-dot" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "var(--radius)", padding: "12px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--violet)", marginBottom: 4 }}>⚠️ Instrucciones importantes</div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            No reveles tu identidad como auditor. Actúa como cliente normal. El reporte debe enviarse dentro de las 24 hrs posteriores a la visita.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <button className="btn-primary" onClick={onAccept}>Aceptar misión y evaluar →</button>
          <button className="btn-secondary" onClick={onBack}>Volver a misiones</button>
        </div>
      </div>
    </div>
  );
}

// ── EVALUATION SCREEN ─────────────────────────────────────────────────────
function EvaluationScreen({ mission: m, onBack, onSubmit }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const section = EVAL_SECTIONS[sectionIdx];
  const isLast = sectionIdx === EVAL_SECTIONS.length - 1;
  const progress = ((sectionIdx) / EVAL_SECTIONS.length) * 100;

  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const canAdvance = section.fields
    .filter((f) => f.type !== "textarea")
    .every((f) => answers[f.key]);

  const handleNext = async () => {
    if (!isLast) { setSectionIdx((i) => i + 1); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluation: { business: m.business, category: m.category, answers } }),
      });
      const data = await res.json();
      onSubmit(data);
    } catch {
      onSubmit({ score: null, error: "No se pudo generar el reporte. Los datos se guardaron." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: 44, marginBottom: 20 }}>🤖</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Generando reporte con IA</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Analizando tu evaluación...</div>
        <div className="dot-pulse"><div /><div /><div /></div>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar onBack={sectionIdx > 0 ? () => setSectionIdx((i) => i - 1) : onBack} title="Evaluación" />

      <div className="progress-wrap">
        <div className="progress-label">
          <span>Sección {sectionIdx + 1} de {EVAL_SECTIONS.length}</span>
          <span style={{ color: "var(--violet)" }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="eval-section-hdr">
        <div className="eval-section-emoji">{section.emoji}</div>
        <div>
          <div className="eval-section-title">{section.title}</div>
          <div className="eval-section-sub">{m.business}</div>
        </div>
      </div>

      {section.fields.map((f) => {
        if (f.type === "rating") return (
          <RatingField key={f.key} label={f.label} value={answers[f.key] || ""} onChange={(v) => setAnswer(f.key, v)} />
        );
        if (f.type === "select") return (
          <div key={f.key} className="field-group">
            <label className="field-label">{f.label}</label>
            <select className="form-select" value={answers[f.key] || ""} onChange={(e) => setAnswer(f.key, e.target.value)}>
              <option value="">— Selecciona —</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        );
        if (f.type === "textarea") return (
          <div key={f.key} className="field-group">
            <label className="field-label">{f.label}</label>
            <textarea className="form-textarea" placeholder={f.placeholder} value={answers[f.key] || ""} onChange={(e) => setAnswer(f.key, e.target.value)} />
          </div>
        );
        return null;
      })}

      <div className="pad mt12 mb16">
        <button className="btn-primary" onClick={handleNext} disabled={!canAdvance}>
          {isLast ? "Enviar y generar reporte IA →" : `Siguiente: ${EVAL_SECTIONS[sectionIdx + 1]?.title} →`}
        </button>
      </div>
    </div>
  );
}

// ── REPORT SCREEN ─────────────────────────────────────────────────────────
function ReportScreen({ mission: m, report, onHome }) {
  const score = report?.score ?? 0;
  const radius = 48;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="screen">
      <TopBar onBack={onHome} title="Misiones" />
      <div className="report-wrap mt20">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Reporte generado por IA
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{m.business}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{CATEGORY_LABELS[m.category]} · {m.location}</div>
        </div>

        {score > 0 && (
          <div className="score-ring">
            <svg viewBox="0 0 110 110" width="120" height="120">
              <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--surface)" strokeWidth="8" />
              <circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={`${strokeDash} ${circ}`} strokeLinecap="round" />
            </svg>
            <div className="score-text">
              <div className="score-num" style={{ color }}>{score}</div>
              <div className="score-lbl">/ 100</div>
            </div>
          </div>
        )}

        {report?.resumen && (
          <div className="report-card">
            <h3>📋 Resumen ejecutivo</h3>
            <p>{report.resumen}</p>
          </div>
        )}

        {report?.fortalezas && (
          <div className="report-card" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
            <h3 style={{ color: "#10B981" }}>✅ Fortalezas</h3>
            <p>{report.fortalezas}</p>
          </div>
        )}

        {report?.areas_mejora && (
          <div className="report-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <h3 style={{ color: "#EF4444" }}>⚠️ Áreas de mejora</h3>
            <p>{report.areas_mejora}</p>
          </div>
        )}

        {report?.recomendaciones && (
          <div className="report-card" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
            <h3>💡 Recomendaciones</h3>
            <p>{report.recomendaciones}</p>
          </div>
        )}

        {report?.error && (
          <div className="report-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <h3 style={{ color: "#EF4444" }}>⚠️ Aviso</h3>
            <p>{report.error}</p>
          </div>
        )}

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>PAGO POR ESTA AUDITORÍA</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#F59E0B" }}>${m.pay} MXN</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Procesado en 24–48 hrs hábiles</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <button className="btn-primary" onClick={onHome}>← Ver más misiones</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────
export default function MysteryShopperApp() {
  const [view, setView] = useState("home");
  const [mission, setMission] = useState(null);
  const [report, setReport] = useState(null);

  const goHome = () => { setView("home"); setMission(null); setReport(null); };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {view === "home" && (
          <HomeScreen onSelectMission={(m) => { setMission(m); setView("mission"); }} />
        )}
        {view === "mission" && mission && (
          <MissionScreen
            mission={mission}
            onBack={goHome}
            onAccept={() => setView("evaluate")}
          />
        )}
        {view === "evaluate" && mission && (
          <EvaluationScreen
            mission={mission}
            onBack={() => setView("mission")}
            onSubmit={(data) => { setReport(data); setView("report"); }}
          />
        )}
        {view === "report" && mission && (
          <ReportScreen mission={mission} report={report} onHome={goHome} />
        )}
      </div>
    </>
  );
}
