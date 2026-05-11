"use client";
import { useState } from "react";

const BRAND = { name: "AUDITORTJ", sub: "Auditoría de experiencia · B.C." };

// ── MISSIONS ─────────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 1, business: "Restaurante El Greco", category: "restaurante", emoji: "🍽️",
    location: "Zona Río, Tijuana", pay: 350, deadline: "2026-05-15", duration: "60–90 min",
    requirements: ["Ordenar 1 platillo principal y 1 bebida", "Evaluar hostess, mesero y capitán de área", "Revisar sanitarios", "Tomar 2 fotos discretas"],
    color: "#F59E0B",
  },
  {
    id: 2, business: "Salon de Belleza Nova", category: "salon", emoji: "💇",
    location: "Playas, Tijuana", pay: 280, deadline: "2026-05-18", duration: "45–60 min",
    requirements: ["Solicitar corte básico o manicure", "Evaluar limpieza e higiene", "Registrar tiempo de espera"],
    color: "#EC4899",
  },
  {
    id: 3, business: "Ferretería del Norte", category: "retail", emoji: "🔧",
    location: "Centro, Tijuana", pay: 200, deadline: "2026-05-20", duration: "30–45 min",
    requirements: ["Solicitar ayuda para encontrar producto", "Evaluar conocimiento del vendedor", "Simular consulta de precio"],
    color: "#3B82F6",
  },
  {
    id: 4, business: "Clínica Dental Smile+", category: "salud", emoji: "🦷",
    location: "Otay, Tijuana", pay: 450, deadline: "2026-05-22", duration: "30 min",
    requirements: ["Agendar y asistir a cita de evaluación", "Evaluar instalaciones y trato", "Registrar tiempos de espera"],
    color: "#10B981",
  },
  {
    id: 5, business: "Hotel Casa Riviera", category: "hotel", emoji: "🏨",
    location: "Rosarito, B.C.", pay: 600, deadline: "2026-05-25", duration: "2–3 hrs",
    requirements: ["Realizar check-in como huésped", "Evaluar limpieza de habitación", "Probar servicio a cuarto"],
    color: "#8B5CF6",
  },
];

const CATEGORY_LABELS = {
  restaurante: "Restaurante", salon: "Salón de Belleza",
  retail: "Comercio", salud: "Salud", hotel: "Hotel / Hostelería",
};

// ── SCORING UTILS ─────────────────────────────────────────────────────────
function calcBlockScore(section, answers) {
  let earned = 0, possible = 0;
  for (const f of section.fields) {
    if (f.type !== "compliance" || !f.value) continue;
    const ans = answers[f.key];
    if (ans === "na") continue;
    possible += f.value;
    if (ans === "si") earned += f.value;
  }
  return possible > 0 ? Math.round((earned / possible) * 100) : null;
}

function calcTotalScore(sections, answers) {
  let earned = 0, possible = 0;
  for (const sec of sections) {
    for (const f of sec.fields) {
      if (f.type !== "compliance" || !f.value) continue;
      const ans = answers[f.key];
      if (ans === "na") continue;
      possible += f.value;
      if (ans === "si") earned += f.value;
    }
  }
  return possible > 0 ? Math.round((earned / possible) * 100) : 0;
}

function buildAIPayload(mission, sections, answers) {
  const blockScores = sections.map(sec => ({
    section: sec.title,
    score: calcBlockScore(sec, answers),
  })).filter(b => b.score !== null);

  const failures = [];
  const observations = [];

  for (const sec of sections) {
    for (const f of sec.fields) {
      if (f.type === "compliance" && answers[f.key] === "no") {
        failures.push(`[${sec.title}] ${f.label}`);
      }
      if (f.type === "textarea" && answers[f.key]?.trim()) {
        observations.push(`[${sec.title} — ${f.label}]: ${answers[f.key]}`);
      }
    }
  }

  return {
    business: mission.business,
    category: CATEGORY_LABELS[mission.category],
    location: mission.location,
    totalScore: calcTotalScore(sections, answers),
    blockScores,
    failures,
    observations,
  };
}

// ── RESTAURANT SECTIONS (based on real MS questionnaires) ─────────────────
const RESTAURANT_SECTIONS = [
  {
    id: "hostess", title: "Hostess / Recepción", emoji: "🤝",
    fields: [
      { key: "h1", label: "¿Al llegar fue recibido por una persona (Hostess, Mesero o Capitán)?", type: "compliance", value: 3 },
      { key: "h2", label: "¿Le dieron la frase de bienvenida corporativa?", type: "compliance", value: 1 },
      { key: "h3", label: "¿El recibimiento fue amable y cortés?", type: "compliance", value: 1 },
      { key: "h4", label: "¿Le preguntaron el nombre para registrar la mesa?", type: "compliance", value: 1 },
      { key: "h5", label: "¿Lo acompañaron a su mesa?", type: "compliance", value: 1 },
      { key: "h6", label: "¿Al sentarse le mencionaron la carta de vinos?", type: "compliance", value: 1 },
      { key: "h7", label: "¿Le sugirieron la bebida del día?", type: "compliance", value: 3 },
      { key: "h8", label: "¿La Hostess cumplió con la imagen corporativa? (uniforme, higiene, presentación)", type: "compliance", value: 1 },
      { key: "h9", label: "¿La mesa estaba totalmente montada? (mantel, cubiertos, salsas, tend card)", type: "compliance", value: 3 },
      { key: "h_obs", label: "Observaciones de recepción", type: "textarea", placeholder: "Nombre del personal, descripción física, frases exactas, detalles del montaje de mesa..." },
    ],
  },
  {
    id: "mesero_beb", title: "Mesero — Bebidas y Apertura", emoji: "🍹",
    fields: [
      { key: "m1", label: "¿El mesero lo recibió con la frase de bienvenida?", type: "compliance", value: 1 },
      { key: "m2", label: "¿Se presentó diciendo su nombre y que los atendería?", type: "compliance", value: 3 },
      { key: "m3", label: "¿Reafirmó la bebida del día y sugirió algún platillo?", type: "compliance", value: 2 },
      { key: "m4", label: "¿Confirmó la orden de bebidas repitiendo en voz alta?", type: "compliance", value: 1 },
      { key: "m5", label: "¿Entregó bebidas sin preguntar quién pidió qué, mencionando nombre de cada una?", type: "compliance", value: 1 },
      { key: "m6", label: "¿Entregó bebidas con los requerimientos solicitados? (sin hielo, sin escarchar, etc.)", type: "compliance", value: 1 },
      { key: "m7", label: "¿Entregó todas las bebidas en menos de 5 minutos?", type: "compliance", value: 3 },
      { key: "m8", label: "¿Colocó servicio al centro antes de que llegara el entremés?", type: "compliance", value: 1 },
      { key: "m9", label: "¿Preguntó si requería factura antes del plato fuerte?", type: "compliance", value: 3 },
      { key: "m_obs1", label: "Observaciones (bebidas y apertura)", type: "textarea", placeholder: "Nombre del mesero, descripción física, tiempos exactos de entrega, frases usadas..." },
    ],
  },
  {
    id: "mesero_ali", title: "Mesero — Entremeses y Plato Fuerte", emoji: "🍽️",
    fields: [
      { key: "m10", label: "¿Entremés frío entregado en máximo 10 min? (tacos, tostadas, aguachile, ceviche)", type: "compliance", value: 3, hasNA: true },
      { key: "m11", label: "¿Entremés caliente entregado en máximo 14 min? (sopas, antojitos)", type: "compliance", value: 3, hasNA: true },
      { key: "m12", label: "¿Distribuyó el entremés sin preguntar a quién correspondía, mencionando cada platillo?", type: "compliance", value: 3 },
      { key: "m13", label: "¿Llevó cuchara para servir entrada al centro? (si aplica)", type: "compliance", value: 1, hasNA: true },
      { key: "m14", label: "¿Los platillos de entremés llegaron limpios (sin manchas ni chorreos)?", type: "compliance", value: 1 },
      { key: "m15", label: "¿Confirmó la orden del plato fuerte mencionando una característica o solicitud especial?", type: "compliance", value: 1 },
      { key: "m16", label: "¿Realizó cambio de cubiertos cuando fue necesario?", type: "compliance", value: 3 },
      { key: "m17", label: "¿Plato fuerte entregado en máximo 20 minutos?", type: "compliance", value: 3 },
      { key: "m18", label: "¿Entregó platos fuertes sin preguntar a quién correspondían?", type: "compliance", value: 3 },
      { key: "m19", label: "¿Presentación y temperatura del plato fuerte correctas?", type: "compliance", value: 1 },
      { key: "m_obs2", label: "Observaciones (entremeses y plato fuerte)", type: "textarea", placeholder: "Tiempos exactos, descripción de platillos, incidencias de servicio..." },
    ],
  },
  {
    id: "mesero_pos", title: "Mesero — Postres y Cierre", emoji: "🍮",
    fields: [
      { key: "m20", label: "¿Al retirar platos preguntó si el platillo fue de su agrado?", type: "compliance", value: 1 },
      { key: "m21", label: "¿Limpió la mesa completamente antes de sugerir postres?", type: "compliance", value: 3 },
      { key: "m22", label: "¿Mostró postres (tablet u otro medio) con venta sugestiva?", type: "compliance", value: 3 },
      { key: "m23", label: "¿Sugirió café o digestivos?", type: "compliance", value: 3 },
      { key: "m24", label: "¿Postre entregado en máximo 10 minutos?", type: "compliance", value: 3, hasNA: true },
      { key: "m25", label: "¿Plato del postre limpio, sin chorrear?", type: "compliance", value: 1, hasNA: true },
      { key: "m26", label: "¿Entregó postre sin preguntar a quién correspondía?", type: "compliance", value: 1, hasNA: true },
      { key: "m27", label: "¿Limpió mesa por completo al terminar el postre?", type: "compliance", value: 3, hasNA: true },
      { key: "m_obs3", label: "Observaciones (postres y cierre)", type: "textarea", placeholder: "Postres solicitados, trato al cierre de mesa..." },
    ],
  },
  {
    id: "cuenta", title: "Cuenta y Cobro", emoji: "💳",
    fields: [
      { key: "c1", label: "¿La cuenta fue entregada en máximo 5 minutos desde que se solicitó?", type: "compliance", value: 1 },
      { key: "c2", label: "Efectivo: ¿confirmó monto frente al cliente? / Tarjeta: ¿cobró en la mesa?", type: "compliance", value: 3 },
      { key: "c3", label: "¿El mesero NO exigió propina ni sugirió importe? (Solo puede preguntar si desea agregar propina)", type: "compliance", value: 1 },
      { key: "c4", label: "¿La cuenta fue correcta y correspondió al consumo?", type: "compliance", value: 1 },
      { key: "c5", label: "¿Le entregaron factura con fecha, número e importe? (si aplica)", type: "compliance", value: 1, hasNA: true },
      { key: "c_obs", label: "Observaciones de cobro", type: "textarea", placeholder: "Método de pago, importe, incidencias con el cobro o propina..." },
    ],
  },
  {
    id: "capitan", title: "Capitán de Área", emoji: "👨‍💼",
    fields: [
      { key: "cap1", label: "¿El capitán visitó la mesa y entabló conversación real? — 1ª visita (no solo '¿Todo bien?')", type: "compliance", value: 5 },
      { key: "cap2", label: "¿El capitán realizó una segunda visita con conversación genuina?", type: "compliance", value: 5, hasNA: true },
      { key: "cap_obs", label: "Observaciones del capitán", type: "textarea", placeholder: "Nombre y descripción física del capitán, frases exactas, temas de conversación en cada visita..." },
    ],
  },
  {
    id: "despedida", title: "Despedida", emoji: "👋",
    fields: [
      { key: "d1", label: "¿El mesero o capitán agradeció la visita al retirarse o en el lobby?", type: "compliance", value: 1 },
      { key: "d2", label: "¿El personal del lobby despidió al cliente?", type: "compliance", value: 3 },
      { key: "d_obs", label: "Observaciones de despedida", type: "textarea", placeholder: "Frases exactas de despedida, personal que participó..." },
    ],
  },
  {
    id: "imagen", title: "Imagen y Mantenimiento", emoji: "🏛️",
    fields: [
      { key: "i1", label: "¿Sanitarios con papel secamanos?", type: "compliance", value: 1 },
      { key: "i2", label: "¿Sanitarios con hoja de limpieza firmada (capitán + personal) y con fecha actual?", type: "compliance", value: 5 },
      { key: "i3", label: "¿Sanitarios con papel higiénico?", type: "compliance", value: 1 },
      { key: "i4", label: "¿Sanitarios con jabón?", type: "compliance", value: 1 },
      { key: "i5", label: "¿Sanitarios con agua?", type: "compliance", value: 1 },
      { key: "i_obs", label: "Observaciones generales del establecimiento", type: "textarea", placeholder: "Estado sanitarios, limpieza general, temperatura, música, ambiente, iluminación..." },
    ],
  },
  {
    id: "comentarios", title: "Comentarios Finales", emoji: "📝",
    fields: [
      { key: "rec", label: "¿Recomendarías este restaurante a familiares o amigos?", type: "compliance", value: 0 },
      { key: "platillos", label: "Platillos y bebidas solicitados", type: "textarea", placeholder: "Lista todo lo ordenado: bebidas, entremeses, platos fuertes, postres..." },
      { key: "valet", label: "Observaciones de valet parking (si aplica)", type: "textarea", placeholder: "Uniforme, amabilidad, boleto, revisión de auto, tiempo de entrega..." },
      { key: "obs_final", label: "Observaciones adicionales", type: "textarea", placeholder: "Cualquier aspecto relevante no cubierto en el cuestionario..." },
    ],
  },
];

// ── GENERIC SECTIONS (salón, retail, salud, hotel) ────────────────────────
const GENERIC_SECTIONS = [
  {
    id: "recepcion", title: "Recepción e Imagen", emoji: "👁️",
    fields: [
      { key: "g1", label: "¿Fue recibido por personal al llegar?", type: "compliance", value: 3 },
      { key: "g2", label: "¿El saludo fue cordial con frase de bienvenida?", type: "compliance", value: 2 },
      { key: "g3", label: "¿El personal cumple con imagen corporativa? (uniforme, higiene)", type: "compliance", value: 2 },
      { key: "g4", label: "¿Las instalaciones estaban limpias y ordenadas?", type: "compliance", value: 2 },
      { key: "g5", label: "¿La señalización y visibilidad del negocio es adecuada?", type: "compliance", value: 1 },
      { key: "g_obs1", label: "Observaciones de recepción e imagen", type: "textarea", placeholder: "Descripción del personal, frases de bienvenida, estado de instalaciones..." },
    ],
  },
  {
    id: "atencion", title: "Atención al Cliente", emoji: "🤝",
    fields: [
      { key: "a1", label: "¿El tiempo de espera para ser atendido fue adecuado (menos de 5 min)?", type: "compliance", value: 3 },
      { key: "a2", label: "¿El personal se presentó y ofreció ayuda proactivamente?", type: "compliance", value: 2 },
      { key: "a3", label: "¿El personal demostró conocimiento del servicio/producto?", type: "compliance", value: 3 },
      { key: "a4", label: "¿El trato fue amable y personalizado?", type: "compliance", value: 3 },
      { key: "a5", label: "¿Realizó venta sugestiva o recomendaciones relevantes?", type: "compliance", value: 2 },
      { key: "a_obs", label: "Observaciones de atención", type: "textarea", placeholder: "Nombre del personal, frases exactas, calidad del trato..." },
    ],
  },
  {
    id: "servicio", title: "Servicio / Producto", emoji: "⭐",
    fields: [
      { key: "s1", label: "¿El servicio o producto fue entregado en el tiempo adecuado?", type: "compliance", value: 3 },
      { key: "s2", label: "¿La calidad del servicio o producto fue satisfactoria?", type: "compliance", value: 3 },
      { key: "s3", label: "¿La presentación e higiene fueron adecuadas?", type: "compliance", value: 2 },
      { key: "s4", label: "¿La relación precio–valor fue justa?", type: "compliance", value: 2 },
      { key: "s_obs", label: "Observaciones del servicio/producto", type: "textarea", placeholder: "Describe el servicio o producto recibido en detalle..." },
    ],
  },
  {
    id: "cobro", title: "Cobro y Despedida", emoji: "💳",
    fields: [
      { key: "co1", label: "¿El proceso de cobro fue eficiente y sin errores?", type: "compliance", value: 2 },
      { key: "co2", label: "¿Se entregó comprobante o ticket sin necesidad de pedirlo?", type: "compliance", value: 2 },
      { key: "co3", label: "¿La despedida fue cordial?", type: "compliance", value: 1 },
      { key: "co_obs", label: "Observaciones de cobro y despedida", type: "textarea", placeholder: "Proceso de pago, ticket, frase de despedida, observaciones finales..." },
    ],
  },
];

const CATEGORY_SECTIONS = {
  restaurante: RESTAURANT_SECTIONS,
  salon: GENERIC_SECTIONS,
  retail: GENERIC_SECTIONS,
  salud: GENERIC_SECTIONS,
  hotel: GENERIC_SECTIONS,
};

// ── STYLES ────────────────────────────────────────────────────────────────
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
  .screen { min-height: 100vh; overflow-y: auto; padding-bottom: 100px; animation: fadeUp .2s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .top-bar { position: sticky; top:0; z-index:20; background: rgba(15,10,20,0.92);
    backdrop-filter: blur(16px); padding: 14px 20px 12px;
    border-bottom: 1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: var(--violet); }
  .brand-sub { font-size: 9px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
  .back-btn { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--muted); cursor:pointer; padding: 6px 0; }
  .back-btn:hover { color: var(--text); }

  .hero { padding: 24px 20px 20px; background: linear-gradient(160deg,var(--bg2) 0%,var(--bg3) 100%); }
  .hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(139,92,246,0.15);
    border:1px solid rgba(139,92,246,0.3); border-radius:20px; padding:4px 12px; margin-bottom:12px; }
  .hero-badge span { font-size:10px; color:var(--violet); font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .hero-title { font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing:-1px; }
  .hero-title em { color: var(--violet); font-style:normal; }
  .hero-sub { font-size: 13px; color:var(--muted); margin-top:8px; line-height:1.5; }

  .stats-row { display:flex; gap:10px; padding:16px 20px 0; }
  .stat-chip { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 10px; text-align:center; }
  .stat-val { font-size:20px; font-weight:700; color:var(--amber); }
  .stat-lbl { font-size:10px; color:var(--muted); margin-top:2px; line-height:1.3; }

  .section-hdr { padding:18px 20px 10px; font-size:10px; font-weight:600;
    letter-spacing:1.5px; text-transform:uppercase; color:var(--muted);
    display:flex; justify-content:space-between; align-items:center; }
  .section-hdr span { color:var(--violet); font-size:10px; }

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

  .eval-section-hdr { display:flex; align-items:center; gap:10px; padding:20px 20px 12px; }
  .eval-section-emoji { font-size:22px; }
  .eval-section-title { font-size:18px; font-weight:700; }
  .eval-section-sub { font-size:11px; color:var(--muted); margin-top:1px; }

  .field-group { padding:0 20px 14px; }
  .field-label { font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase;
    letter-spacing:1px; margin-bottom:8px; display:block; }
  .field-label-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:8px; }
  .field-label-text { font-size:12px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.8px; flex:1; line-height:1.4; }
  .pts-badge { background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.3); border-radius:6px;
    padding:2px 7px; font-size:10px; color:var(--violet); font-weight:700; flex-shrink:0; white-space:nowrap; }

  .compliance-row { display:flex; gap:8px; }
  .compliance-btn { flex:1; padding:11px 4px; background:var(--surface); border:1px solid var(--border);
    border-radius:10px; text-align:center; cursor:pointer; font-size:13px; font-weight:700;
    color:var(--muted); font-family:'Space Grotesk',sans-serif; transition:all .15s; }
  .compliance-btn.si { background:rgba(16,185,129,0.15); border-color:#10B981; color:#10B981; }
  .compliance-btn.no { background:rgba(239,68,68,0.15); border-color:#EF4444; color:#EF4444; }
  .compliance-btn.na { background:rgba(124,111,160,0.15); border-color:var(--muted); color:var(--muted); }
  .compliance-btn:hover:not(.si):not(.no):not(.na) { border-color:rgba(139,92,246,0.4); color:var(--text); }

  .form-select { width:100%; padding:12px 14px; background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text); font-family:'Space Grotesk',sans-serif; font-size:14px; outline:none; }
  .form-select option { background:var(--bg); }
  .form-textarea { width:100%; padding:12px 14px; background:var(--surface); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text); font-family:'Space Grotesk',sans-serif; font-size:13px;
    outline:none; resize:none; min-height:72px; transition:border-color .15s; line-height:1.5; }
  .form-textarea:focus { border-color:rgba(139,92,246,0.5); }
  .form-textarea::placeholder { color:var(--muted); }

  .progress-wrap { padding:14px 20px 0; }
  .progress-label { display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-bottom:6px; }
  .progress-bar { height:4px; background:var(--surface); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--violet),#C084FC); transition:width .4s ease; }

  .block-score-mini { display:flex; align-items:center; gap:8px; margin:0 20px 12px;
    background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:8px 12px; }
  .block-score-mini-bar { flex:1; height:4px; background:var(--bg3); border-radius:2px; overflow:hidden; }
  .block-score-mini-fill { height:100%; border-radius:2px; transition:width .4s ease; }
  .block-score-mini-val { font-size:12px; font-weight:700; min-width:36px; text-align:right; }

  .report-wrap { padding:0 20px; }
  .score-ring { width:120px; height:120px; margin:0 auto 16px; position:relative; }
  .score-ring svg { transform:rotate(-90deg); }
  .score-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .score-num { font-size:32px; font-weight:700; line-height:1; }
  .score-lbl { font-size:10px; color:var(--muted); margin-top:2px; }
  .report-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; margin-bottom:12px; }
  .report-card h3 { font-size:11px; color:var(--violet); text-transform:uppercase; letter-spacing:1px; font-weight:700; margin-bottom:10px; }
  .report-card p { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }

  .block-scores-table { display:flex; flex-direction:column; gap:8px; margin-bottom:4px; }
  .block-row { display:flex; align-items:center; gap:10px; }
  .block-row-label { font-size:11px; color:var(--muted); width:150px; flex-shrink:0; }
  .block-row-bar { flex:1; height:6px; background:var(--bg3); border-radius:3px; overflow:hidden; }
  .block-row-fill { height:100%; border-radius:3px; }
  .block-row-val { font-size:12px; font-weight:700; min-width:38px; text-align:right; }

  .dot-pulse { display:flex; gap:5px; align-items:center; padding:16px; }
  .dot-pulse div { width:7px; height:7px; border-radius:50%; background:var(--violet);
    animation:dp 1.2s ease-in-out infinite; }
  .dot-pulse div:nth-child(2){animation-delay:.2s}
  .dot-pulse div:nth-child(3){animation-delay:.4s}
  @keyframes dp{0%,80%,100%{transform:scale(0.6);opacity:.3}40%{transform:scale(1);opacity:1}}

  .confirm-screen { min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; text-align:center; padding:40px 24px; gap:14px; animation:fadeUp .3s ease; }
  .confirm-icon { font-size:56px; }
  .confirm-title { font-size:34px; font-weight:700; line-height:1; letter-spacing:-1px; }
  .confirm-title span { color:var(--violet); }
  .confirm-sub { font-size:13px; color:var(--muted); line-height:1.6; }

  ::-webkit-scrollbar { display:none; }
`;

// ── COMPLIANCE FIELD ──────────────────────────────────────────────────────
function ComplianceField({ label, value, answer, onChange, hasNA }) {
  const opts = ["si", "no", ...(hasNA ? ["na"] : [])];
  const display = { si: "✓ Sí", no: "✗ No", na: "N/A" };
  return (
    <div className="field-group">
      <div className="field-label-row">
        <span className="field-label-text">{label}</span>
        {value > 0 && <span className="pts-badge">{value}pts</span>}
      </div>
      <div className="compliance-row">
        {opts.map((opt) => (
          <button
            key={opt}
            className={`compliance-btn${answer === opt ? ` ${opt}` : ""}`}
            onClick={() => onChange(opt)}
          >
            {display[opt]}
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
      <div className="section-hdr">Misiones disponibles <span>{MISSIONS.length} activas</span></div>
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
  const sections = CATEGORY_SECTIONS[m.category] || GENERIC_SECTIONS;
  const totalQuestions = sections.reduce((acc, s) => acc + s.fields.filter(f => f.type === "compliance").length, 0);
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
            ["📋 Preguntas de evaluación", `${totalQuestions} ítems en ${sections.length} secciones`],
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
  const sections = CATEGORY_SECTIONS[m.category] || GENERIC_SECTIONS;
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const section = sections[sectionIdx];
  const isLast = sectionIdx === sections.length - 1;
  const progress = (sectionIdx / sections.length) * 100;
  const blockScore = calcBlockScore(section, answers);

  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const canAdvance = section.fields
    .filter((f) => f.type === "compliance")
    .every((f) => answers[f.key] !== undefined);

  const handleNext = async () => {
    if (!isLast) { setSectionIdx((i) => i + 1); return; }
    setSubmitting(true);
    try {
      const payload = buildAIPayload(m, sections, answers);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluation: payload }),
      });
      const data = await res.json();
      onSubmit({ ...data, blockScores: payload.blockScores, totalScore: payload.totalScore });
    } catch {
      onSubmit({ score: payload.totalScore, error: "No se pudo generar el análisis IA. Los datos se guardaron." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: 44, marginBottom: 20 }}>🤖</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Generando reporte con IA</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Analizando {sections.length} secciones evaluadas...</div>
        <div className="dot-pulse"><div /><div /><div /></div>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar onBack={sectionIdx > 0 ? () => setSectionIdx((i) => i - 1) : onBack} title="Evaluación" />

      <div className="progress-wrap">
        <div className="progress-label">
          <span>Sección {sectionIdx + 1} de {sections.length}</span>
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
        {blockScore !== null && (
          <div style={{ marginLeft: "auto", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: blockScore >= 80 ? "var(--green)" : blockScore >= 60 ? "var(--amber)" : "var(--red)" }}>{blockScore}%</div>
            <div style={{ fontSize: 9, color: "var(--muted)" }}>bloque</div>
          </div>
        )}
      </div>

      {section.fields.map((f) => {
        if (f.type === "compliance") return (
          <ComplianceField
            key={f.key}
            label={f.label}
            value={f.value}
            answer={answers[f.key]}
            hasNA={f.hasNA}
            onChange={(v) => setAnswer(f.key, v)}
          />
        );
        if (f.type === "textarea") return (
          <div key={f.key} className="field-group">
            <label className="field-label">{f.label}</label>
            <textarea
              className="form-textarea"
              placeholder={f.placeholder}
              value={answers[f.key] || ""}
              onChange={(e) => setAnswer(f.key, e.target.value)}
            />
          </div>
        );
        return null;
      })}

      <div className="pad mt12 mb16">
        <button className="btn-primary" onClick={handleNext} disabled={!canAdvance}>
          {isLast ? "Generar reporte IA →" : `Siguiente: ${sections[sectionIdx + 1]?.title} →`}
        </button>
      </div>
    </div>
  );
}

// ── REPORT SCREEN ─────────────────────────────────────────────────────────
function ReportScreen({ mission: m, report, onSend }) {
  const [sending, setSending] = useState(false);
  const score = report?.totalScore ?? report?.score ?? 0;
  const radius = 48;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    onSend();
  };

  return (
    <div className="screen">
      <TopBar title="Reporte" />
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

        {report?.blockScores?.length > 0 && (
          <div className="report-card">
            <h3>📊 Scores por bloque</h3>
            <div className="block-scores-table">
              {report.blockScores.map(({ section, score: bs }) => {
                const bc = bs >= 80 ? "#10B981" : bs >= 60 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={section} className="block-row">
                    <span className="block-row-label">{section}</span>
                    <div className="block-row-bar">
                      <div className="block-row-fill" style={{ width: `${bs}%`, background: bc }} />
                    </div>
                    <span className="block-row-val" style={{ color: bc }}>{bs}%</span>
                  </div>
                );
              })}
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

        <div style={{ background: "var(--surface)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>PAGO POR ESTA AUDITORÍA</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#F59E0B" }}>${m.pay} MXN</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Procesado en 24–48 hrs hábiles tras aprobación</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <button className="btn-primary" onClick={handleSend} disabled={sending}>
            {sending
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 13 }}>Enviando reporte...</span>
                  <span style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F0A14", display: "inline-block", animation: `dp 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                  </span>
                </span>
              : `Enviar reporte oficial · cobrar $${m.pay} MXN →`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS SCREEN ────────────────────────────────────────────────────────
function SuccessScreen({ mission: m, onHome }) {
  return (
    <div className="confirm-screen">
      <div className="confirm-icon">🎉</div>
      <div className="confirm-title">REPORTE<br /><span>ENVIADO</span></div>
      <div className="confirm-sub">
        Tu auditoría de <strong>{m.business}</strong> fue entregada exitosamente.<br />
        El pago se procesará en 24–48 hrs hábiles.
      </div>
      <div style={{ width: "100%", background: "var(--surface)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "var(--radius)", padding: "18px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Pago en camino</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#F59E0B" }}>${m.pay} MXN</div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>📲 Te notificaremos cuando se acredite</div>
      </div>
      <div style={{ width: "100%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "var(--radius)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🕵️</span>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          Recuerda: no compartas detalles de esta auditoría con el negocio evaluado.
        </div>
      </div>
      <button className="btn-primary" style={{ width: "100%" }} onClick={onHome}>Ver más misiones →</button>
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
          <MissionScreen mission={mission} onBack={goHome} onAccept={() => setView("evaluate")} />
        )}
        {view === "evaluate" && mission && (
          <EvaluationScreen
            mission={mission}
            onBack={() => setView("mission")}
            onSubmit={(data) => { setReport(data); setView("report"); }}
          />
        )}
        {view === "report" && mission && (
          <ReportScreen mission={mission} report={report} onSend={() => setView("success")} />
        )}
        {view === "success" && mission && (
          <SuccessScreen mission={mission} onHome={goHome} />
        )}
      </div>
    </>
  );
}
