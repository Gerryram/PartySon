"use client";

import { useState, useRef, useEffect } from "react";

const BRAND = {
  blue: "#1B6FE8",
  navy: "#1A4C8B",
  yellow: "#FFD600",
  amber: "#F5C518",
  dark: "#0D1B2A",
  light: "#F0F5FF",
};

const MOCK_PROVIDERS = [
  { id: 1, name: "SonidoTJ Pro", category: "sonido", rating: 4.9, reviews: 87, price: 4500, location: "Zona Río", img: "🎵", verified: true },
  { id: 2, name: "DJ Fantasma", category: "sonido", rating: 4.7, reviews: 54, price: 3200, location: "Playas", img: "🎧", verified: true },
  { id: 3, name: "Banquetes Arroyo", category: "catering", rating: 4.8, reviews: 120, price: 280, priceUnit: "/persona", location: "Centro", img: "🍽️", verified: true },
  { id: 4, name: "Chef Móvil TJ", category: "catering", rating: 4.6, reviews: 43, price: 220, priceUnit: "/persona", location: "Otay", img: "👨‍🍳", verified: false },
  { id: 5, name: "Flores & Eventos Lupita", category: "decoracion", rating: 4.9, reviews: 201, price: 8500, location: "Zona Río", img: "🌸", verified: true },
  { id: 6, name: "Deco Dreams MX", category: "decoracion", rating: 4.5, reviews: 67, price: 5500, location: "Ensenada", img: "✨", verified: false },
  { id: 7, name: "Foto & Video Baja", category: "fotografia", rating: 5.0, reviews: 33, price: 7000, location: "Tijuana", img: "📸", verified: true },
  { id: 8, name: "Momentos TJ", category: "fotografia", rating: 4.7, reviews: 88, price: 5500, location: "Rosarito", img: "🎥", verified: true },
  { id: 9, name: "Salón Las Palmas", category: "salon", rating: 4.8, reviews: 156, price: 15000, location: "Zona Río", img: "🏛️", verified: true },
  { id: 10, name: "Villa Baja Events", category: "salon", rating: 4.6, reviews: 72, price: 11000, location: "Tecate", img: "🏡", verified: true },
  { id: 11, name: "Brincolines Fiesta", category: "entretenimiento", rating: 4.7, reviews: 39, price: 1800, location: "Tijuana", img: "🎪", verified: false },
  { id: 12, name: "Animaciones Baja", category: "entretenimiento", rating: 4.9, reviews: 62, price: 2500, location: "Mexicali", img: "🎭", verified: true },
  { id: 13, name: "Pastelería Dulce Baja", category: "pastel", rating: 4.9, reviews: 98, price: 2800, location: "Zona Río", img: "🎂", verified: true },
  { id: 14, name: "Sweet Dreams TJ", category: "pastel", rating: 4.7, reviews: 45, price: 1900, location: "Playas", img: "🍰", verified: false },
  { id: 15, name: "Transportes VIP BC", category: "transporte", rating: 4.8, reviews: 29, price: 3500, location: "Tijuana", img: "🚐", verified: true },
];

const CATEGORY_LABELS = {
  sonido: "Sonido & DJ",
  catering: "Catering & Banquetes",
  decoracion: "Decoración",
  fotografia: "Fotografía & Video",
  salon: "Salón / Venue",
  entretenimiento: "Entretenimiento",
  pastel: "Pastel",
  transporte: "Transporte",
};

const CATEGORY_COLORS = {
  sonido: "#1B6FE8",
  catering: "#E85E1B",
  decoracion: "#E81B8A",
  fotografia: "#8A1BE8",
  salon: "#1A4C8B",
  entretenimiento: "#E8B01B",
  pastel: "#1BE8A0",
  transporte: "#1B8AE8",
};

export default function PartySonApp() {
  const [screen, setScreen] = useState("home");
  const [input, setInput] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const textareaRef = useRef(null);

  const examples = [
    "Quinceañera para 150 personas en agosto, presupuesto $80,000 MXN",
    "Boda civil íntima 60 personas, jardín, presupuesto $45,000 MXN",
    "Fiesta de cumpleaños infantil 40 niños, presupuesto $15,000 MXN",
    "Evento corporativo 200 personas, cena de gala, presupuesto $120,000 MXN",
  ];

  async function analyzeEvent() {
    if (!input.trim()) return;
    setScreen("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const parsed = await response.json();
      if (!parsed || !parsed.servicios || !Array.isArray(parsed.servicios)) throw new Error("Respuesta invalida: " + JSON.stringify(parsed));
      setBreakdown(parsed);
      setActiveCategory(parsed.servicios[0]?.categoria || null);
      setScreen("results");
    } catch (err) {
      console.error(err);
      setScreen("home");
      alert("Hubo un error al analizar tu evento. Intenta de nuevo.");
    }
  }

  const filteredProviders = breakdown
    ? MOCK_PROVIDERS.filter((p) => p.category === activeCategory)
    : [];

  if (screen === "home") return <HomeScreen input={input} setInput={setInput} onAnalyze={analyzeEvent} examples={examples} textareaRef={textareaRef} />;
  if (screen === "loading") return <LoadingScreen />;
  if (screen === "results") return (
    <ResultsScreen
      breakdown={breakdown}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      filteredProviders={filteredProviders}
      onBack={() => setScreen("home")}
      onViewProviders={() => setScreen("providers")}
    />
  );
  if (screen === "providers") return (
    <ProvidersScreen
      breakdown={breakdown}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      filteredProviders={filteredProviders}
      onBack={() => setScreen("results")}
    />
  );
}

function HomeScreen({ input, setInput, onAnalyze, examples, textareaRef }) {
  const [focused, setFocused] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 3,
      dur: Math.random() * 4 + 3,
    }))
  );

  return (
    <div style={{
      minHeight: "100vh", background: BRAND.dark, fontFamily: "'Nunito', sans-serif",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Source+Sans+3:wght@400;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .anim-1{animation:fade-up 0.6s ease forwards}
        .anim-2{animation:fade-up 0.6s 0.15s ease both}
        .anim-3{animation:fade-up 0.6s 0.3s ease both}
        .anim-4{animation:fade-up 0.6s 0.45s ease both}
        .example-chip:hover{background:rgba(27,111,232,0.25)!important;border-color:#1B6FE8!important;transform:translateY(-2px)}
        .send-btn:hover{transform:scale(1.05);box-shadow:0 0 30px rgba(255,214,0,0.5)!important}
        .send-btn:active{transform:scale(0.97)}
        textarea::placeholder{color:rgba(255,255,255,0.3)}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {particles.map((p) => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.id % 3 === 0 ? BRAND.yellow : p.id % 3 === 1 ? BRAND.blue : "rgba(255,255,255,0.3)",
            opacity: 0.4,
            animation: `float ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(27,111,232,0.15) 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,214,0,0.1) 0%, transparent 70%)`,
        }} />
      </div>

      <nav className="anim-1" style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.navy})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎉</div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>Party<span style={{ color: BRAND.yellow }}>Son</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.2)`, color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "Nunito" }}>Iniciar sesión</button>
          <button style={{ background: BRAND.blue, border: "none", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: "Nunito" }}>Soy proveedor</button>
        </div>
      </nav>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px 60px", position: "relative", zIndex: 1 }}>
        <div className="anim-2" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(27,111,232,0.15)",
            border: `1px solid rgba(27,111,232,0.4)`, borderRadius: 20, padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ color: BRAND.blue, fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>COTIZADOR CON IA · BAJA CALIFORNIA</span>
          </div>
          <h1 style={{
            color: "white", fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 900,
            lineHeight: 1.1, marginBottom: 16, letterSpacing: -1,
          }}>
            Tu evento perfecto<br />
            <span style={{
              background: `linear-gradient(90deg, ${BRAND.yellow}, ${BRAND.amber}, ${BRAND.yellow})`,
              backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}>comienza aquí</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontFamily: "'Source Sans 3', sans-serif" }}>
            Describe tu evento y nuestra IA lo desglosa en servicios, presupuestos y te conecta con los mejores proveedores de la región.
          </p>
        </div>

        <div className="anim-3" style={{
          width: "100%", maxWidth: 640,
          background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${focused ? BRAND.blue : "rgba(255,255,255,0.1)"}`,
          borderRadius: 20, padding: 24,
          boxShadow: focused ? `0 0 40px rgba(27,111,232,0.2)` : "none",
          transition: "all 0.3s ease",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) onAnalyze(); }}
            placeholder="Ej: Quiero organizar una quinceañera para 150 personas en agosto, con salón, DJ, catering y decoración. Mi presupuesto es de $80,000 MXN..."
            style={{
              width: "100%", minHeight: 110, background: "transparent", border: "none",
              color: "white", fontSize: 15, lineHeight: 1.7, resize: "none",
              fontFamily: "'Source Sans 3', sans-serif", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>⌘ + Enter para cotizar</span>
            <button
              className="send-btn"
              onClick={onAnalyze}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? `linear-gradient(135deg, ${BRAND.yellow}, ${BRAND.amber})` : "rgba(255,255,255,0.1)",
                border: "none", color: input.trim() ? BRAND.dark : "rgba(255,255,255,0.3)",
                padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontFamily: "Nunito", transition: "all 0.2s ease",
                boxShadow: input.trim() ? `0 4px 20px rgba(255,214,0,0.3)` : "none",
              }}
            >
              Cotizar evento →
            </button>
          </div>
        </div>

        <div className="anim-4" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 640 }}>
          {examples.map((ex, i) => (
            <button
              key={i}
              className="example-chip"
              onClick={() => setInput(ex)}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)", padding: "7px 14px", borderRadius: 20,
                fontSize: 12, cursor: "pointer", fontFamily: "Nunito", transition: "all 0.2s ease",
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </main>

      <div style={{
        display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,64px)",
        padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative", zIndex: 1,
      }}>
        {[["500+", "Proveedores"], ["1,200+", "Eventos"], ["4.8★", "Calificación"], ["TJ · BC", "Región"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: BRAND.yellow, fontWeight: 900, fontSize: 18 }}>{val}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingScreen() {
  const [step, setStep] = useState(0);
  const steps = ["Analizando tu evento...", "Identificando servicios...", "Calculando presupuestos...", "Buscando proveedores..."];

  useEffect(() => {
    const s = setInterval(() => setStep(p => (p + 1) % steps.length), 1000);
    return () => clearInterval(s);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: BRAND.dark, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: "Nunito",
    }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:0.5}}`}</style>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: `3px solid rgba(27,111,232,0.2)`,
          borderTop: `3px solid ${BRAND.blue}`,
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 8,
          borderRadius: "50%", background: `linear-gradient(135deg, rgba(27,111,232,0.15), rgba(255,214,0,0.1))`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          animation: "ping 2s ease-in-out infinite",
        }}>🎉</div>
      </div>
      <h2 style={{ color: "white", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{steps[step]}</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>La IA está trabajando para ti</p>
    </div>
  );
}

function ResultsScreen({ breakdown, activeCategory, setActiveCategory, filteredProviders, onBack, onViewProviders }) {
  const totalPresupuesto = breakdown?.servicios?.reduce((s, sv) => s + sv.presupuesto_sugerido, 0) || 0;

  return (
    <div style={{ minHeight: "100vh", background: BRAND.dark, fontFamily: "Nunito", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Source+Sans+3:wght@400;600&display=swap');
        @keyframes fade-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .service-card:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,0.3)!important}
        .prov-card:hover{transform:translateY(-3px);border-color:#1B6FE8!important}
        ::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Nunito" }}>← Volver</button>
            <span style={{ fontWeight: 900, fontSize: 20 }}>Party<span style={{ color: BRAND.yellow }}>Son</span></span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Tu cotización</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(27,111,232,0.2), rgba(26,76,139,0.15))`,
          border: `1px solid rgba(27,111,232,0.3)`, borderRadius: 20, padding: 28, marginBottom: 32,
          animation: "fade-up 0.5s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>🎊</span>
                <div>
                  <span style={{ fontSize: 11, color: BRAND.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Evento detectado</span>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{breakdown?.tipo}</h2>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" }}>{breakdown?.resumen}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Presupuesto total</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: BRAND.yellow }}>${breakdown?.presupuesto_total?.toLocaleString()} MXN</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{breakdown?.personas} personas</div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
              <span>Presupuesto asignado</span>
              <span>${totalPresupuesto.toLocaleString()} MXN ({Math.round(totalPresupuesto / breakdown?.presupuesto_total * 100)}%)</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <div style={{
                height: "100%", borderRadius: 3, width: `${Math.min(100, totalPresupuesto / breakdown?.presupuesto_total * 100)}%`,
                background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.yellow})`, transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: "rgba(255,255,255,0.8)" }}>
          Servicios sugeridos por la IA ({breakdown?.servicios?.length})
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 36 }}>
          {breakdown?.servicios?.map((sv, i) => (
            <div
              key={i}
              className="service-card"
              onClick={() => setActiveCategory(sv.categoria)}
              style={{
                background: activeCategory === sv.categoria ? `rgba(27,111,232,0.2)` : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${activeCategory === sv.categoria ? BRAND.blue : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16, padding: 18, cursor: "pointer", transition: "all 0.2s ease",
                animation: `fade-up 0.4s ${i * 0.07}s ease both`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  background: `${CATEGORY_COLORS[sv.categoria]}22`,
                  color: CATEGORY_COLORS[sv.categoria] || BRAND.blue,
                  padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                }}>
                  {CATEGORY_LABELS[sv.categoria] || sv.categoria}
                </div>
                <div style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700,
                  background: sv.prioridad === "alta" ? "rgba(239,68,68,0.2)" : sv.prioridad === "media" ? "rgba(251,146,60,0.2)" : "rgba(34,197,94,0.2)",
                  color: sv.prioridad === "alta" ? "#f87171" : sv.prioridad === "media" ? "#fb923c" : "#4ade80",
                }}>
                  {sv.prioridad?.toUpperCase()}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{sv.nombre}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 12, fontFamily: "'Source Sans 3', sans-serif" }}>{sv.descripcion}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.yellow }}>
                ${sv.presupuesto_sugerido?.toLocaleString()} <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>MXN</span>
              </div>
            </div>
          ))}
        </div>

        {activeCategory && (
          <div style={{ animation: "fade-up 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>
                Proveedores: {CATEGORY_LABELS[activeCategory]}
              </h3>
              <button onClick={onViewProviders} style={{
                background: BRAND.blue, border: "none", color: "white", padding: "8px 18px",
                borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
              }}>
                Ver todos →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {filteredProviders.slice(0, 4).map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProvidersScreen({ breakdown, activeCategory, setActiveCategory, filteredProviders, onBack }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const sorted = [...filteredProviders]
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : a.price - b.price);

  return (
    <div style={{ minHeight: "100vh", background: BRAND.dark, fontFamily: "Nunito", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Source+Sans+3:wght@400;600&display=swap');
        @keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .prov-card:hover{transform:translateY(-4px)!important;border-color:#1B6FE8!important;box-shadow:0 12px 40px rgba(27,111,232,0.2)!important}
        input::placeholder{color:rgba(255,255,255,0.25)}
        input:focus{outline:none}
        ::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Nunito" }}>← Cotización</button>
            <span style={{ fontWeight: 900, fontSize: 20 }}>Party<span style={{ color: BRAND.yellow }}>Son</span></span>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar proveedor..."
            style={{
              flex: 1, maxWidth: 300, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "white", padding: "8px 14px", borderRadius: 10, fontSize: 13, fontFamily: "Nunito",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Proveedores en Baja California</h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Para tu {breakdown?.tipo} · {breakdown?.personas} personas</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Ordenar:</span>
            {["rating", "precio"].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                background: sortBy === s ? BRAND.blue : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: sortBy === s ? "white" : "rgba(255,255,255,0.5)",
                padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "Nunito", fontWeight: 700,
              }}>
                {s === "rating" ? "⭐ Calificación" : "💰 Precio"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {breakdown?.servicios?.map(sv => (
            <button
              key={sv.categoria}
              onClick={() => setActiveCategory(sv.categoria)}
              style={{
                background: activeCategory === sv.categoria ? BRAND.blue : "rgba(255,255,255,0.06)",
                border: `1px solid ${activeCategory === sv.categoria ? BRAND.blue : "rgba(255,255,255,0.12)"}`,
                color: activeCategory === sv.categoria ? "white" : "rgba(255,255,255,0.6)",
                padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "Nunito", fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              {CATEGORY_LABELS[sv.categoria] || sv.categoria}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {sorted.map((p, i) => (
            <div key={p.id} style={{ animation: `fade-up 0.4s ${i * 0.05}s ease both` }}>
              <ProviderCard provider={p} large />
            </div>
          ))}
          {sorted.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>
              No se encontraron proveedores para esta categoría
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ provider: p, large }) {
  return (
    <div
      className="prov-card"
      style={{
        background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: large ? 20 : 16, cursor: "pointer", transition: "all 0.25s ease",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: large ? 54 : 44, height: large ? 54 : 44, borderRadius: 12,
          background: `linear-gradient(135deg, rgba(27,111,232,0.3), rgba(26,76,139,0.3))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: large ? 26 : 20, flexShrink: 0,
        }}>
          {p.img}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontWeight: 800, fontSize: large ? 15 : 14 }}>{p.name}</span>
            {p.verified && <span style={{ fontSize: 12 }}>✅</span>}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>📍 {p.location}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ color: BRAND.yellow, fontWeight: 800, fontSize: 13 }}>★ {p.rating}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>({p.reviews} reseñas)</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: large ? 17 : 15, fontWeight: 900, color: BRAND.yellow }}>${p.price.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>MXN{p.priceUnit || ""}</div>
        </div>
      </div>
      {large && (
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button style={{
            flex: 1, background: BRAND.blue, border: "none", color: "white",
            padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
          }}>
            Solicitar cotización
          </button>
          <button style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)", padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontFamily: "Nunito",
          }}>
            💬
          </button>
        </div>
      )}
    </div>
  );
}
