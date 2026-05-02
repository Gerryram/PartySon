"use client";
import { useState, useRef, useEffect } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────
const WA_NUMBER = "526641234567";
const BRAND = { name: "CASATEC", sub: "Reparaciones inteligentes" };

// ─── SERVICES CATALOG ──────────────────────────────────────────────────
const SERVICES = [
  {
    id: "pintura", name: "Pintura", emoji: "🎨",
    color: "#C8F050", dark: "#7AAA10", badge: "ACTIVO",
    desc: "Exterior, interior y acabados decorativos",
    subServices: [
      { name: "Pintura exterior", detail: "Fachadas y muros exteriores" },
      { name: "Pintura interior", detail: "Cuartos, salas y cocinas" },
      { name: "Acabados decorativos", detail: "Texturas, esmaltes y barnices" },
      { name: "Impermeabilización", detail: "Azoteas y muros húmedos" },
    ],
    tiers: [
      { tier: "Básico",   price: "35–50",   unit: "MXN/m²", detail: "1 mano, pintura estándar" },
      { tier: "Pro",      price: "65–90",   unit: "MXN/m²", detail: "2 manos, preparación de superficie" },
      { tier: "Premium",  price: "110–160", unit: "MXN/m²", detail: "Sellador + 2 manos + acabado fino" },
    ],
    prompt: `Eres un experto en cotización de pintura residencial en Tijuana, México. Analiza la imagen y responde con:
1. Área estimada visible (m²)
2. Estado de la superficie (bueno/regular/malo)
3. Preparación necesaria
4. Costo estimado por tier:
   - Básico (35-50 MXN/m²): 1 mano, pintura estándar
   - Pro (65-90 MXN/m²): 2 manos + preparación
   - Premium (110-160 MXN/m²): sellador + acabado fino
5. Tiempo estimado de trabajo

Sé concreto. Si no puedes ver bien el área, da un rango estimado. Usa formato claro con emojis de apoyo. Responde en español.`,
  },
  {
    id: "plomeria", name: "Plomería", emoji: "🔧",
    color: "#4FC3F7", dark: "#0277BD",
    desc: "Fugas, instalaciones y destapado",
    subServices: [
      { name: "Reparación de fugas", detail: "Tuberías, llaves y conexiones" },
      { name: "Instalación sanitaria", detail: "WC, lavabos y regaderas" },
      { name: "Destapado", detail: "Drenaje y bajadas de agua" },
      { name: "Calentadores", detail: "Instalación y reparación" },
    ],
    tiers: [
      { tier: "Diagnóstico", price: "300–500",   unit: "MXN",    detail: "Revisión y reporte" },
      { tier: "Reparación",  price: "600–2,500", unit: "MXN",    detail: "Trabajo de reparación" },
      { tier: "Instalación", price: "2,500–8k",  unit: "MXN",    detail: "Instalación completa" },
    ],
    prompt: `Eres un plomero experto en Tijuana, México. Analiza la imagen del problema de plomería:
1. Diagnóstico del problema visible
2. Causa probable
3. Urgencia (inmediata / puede esperar)
4. Solución recomendada
5. Costo estimado:
   - Diagnóstico (300-500 MXN)
   - Reparación (600-2,500 MXN)
   - Instalación completa (2,500-8,000 MXN)

Responde en español con formato claro.`,
  },
  {
    id: "electricidad", name: "Electricidad", emoji: "⚡",
    color: "#FFE066", dark: "#F57F17",
    desc: "Tableros, instalaciones y fallas",
    subServices: [
      { name: "Instalación eléctrica", detail: "Circuitos, canaletas y ductos" },
      { name: "Tableros y breakers",  detail: "Instalación y ampliación" },
      { name: "Iluminación LED",      detail: "Proyectos de iluminación" },
      { name: "Contactos y apagadores", detail: "Reemplazo y nuevas salidas" },
    ],
    tiers: [
      { tier: "Revisión",    price: "400–700",    unit: "MXN", detail: "Diagnóstico eléctrico" },
      { tier: "Reparación",  price: "800–3,000",  unit: "MXN", detail: "Corrección de fallas" },
      { tier: "Instalación", price: "3,000–15k",  unit: "MXN", detail: "Circuitos nuevos" },
    ],
    prompt: `Eres un electricista certificado en Tijuana, México. Analiza la imagen del problema eléctrico:
1. Problema visible y diagnóstico
2. Nivel de riesgo (seguro / precaución / peligro)
3. Trabajo necesario
4. Costo estimado:
   - Revisión (400-700 MXN)
   - Reparación (800-3,000 MXN)
   - Instalación nueva (3,000-15,000 MXN)
5. Si hay riesgo inmediato, indícalo claramente.

Responde en español.`,
  },
  {
    id: "albanileria", name: "Albañilería", emoji: "🧱",
    color: "#FFAB76", dark: "#E65100",
    desc: "Fisuras, muros y remodelación",
    subServices: [
      { name: "Reparación de fisuras", detail: "Grietas en muros y losas" },
      { name: "Levantado de muros",   detail: "Block, tabique y tablaroca" },
      { name: "Aplanados y yeso",     detail: "Acabados de pared" },
      { name: "Demolición",           detail: "Muros y pisos" },
    ],
    tiers: [
      { tier: "Reparación menor", price: "400–800",    unit: "MXN",     detail: "Fisuras y parches" },
      { tier: "Obra por m²",      price: "150–280",    unit: "MXN/m²",  detail: "Aplanados y muros" },
      { tier: "Proyecto mayor",   price: "Cotización", unit: "especial", detail: "Remodelaciones" },
    ],
    prompt: `Eres un maestro albañil experto en Tijuana, México. Analiza la imagen del daño o trabajo:
1. Tipo y gravedad del daño
2. Causa probable (humedad, asentamiento, etc.)
3. Solución recomendada
4. Costo estimado:
   - Reparación menor (400-800 MXN)
   - Trabajo por m² (150-280 MXN/m²)
   - Proyecto mayor (cotización especial)

Responde en español con formato claro.`,
  },
  {
    id: "impermeabilizacion", name: "Impermeab.", emoji: "💧",
    color: "#64FFDA", dark: "#00695C",
    desc: "Azoteas, muros y filtraciones",
    subServices: [
      { name: "Impermeabilización de azotea", detail: "Sistemas monoásticos y membrana" },
      { name: "Muros y fachadas",             detail: "Tratamiento de humedad exterior" },
      { name: "Filtración interior",           detail: "Sótanos y muros húmedos" },
      { name: "Mantenimiento preventivo",     detail: "Recubrimiento y sellado" },
    ],
    tiers: [
      { tier: "Básico",  price: "80–120",  unit: "MXN/m²", detail: "1 capa estándar" },
      { tier: "Pro",     price: "130–180", unit: "MXN/m²", detail: "Sistema multicapa" },
      { tier: "Premium", price: "200–300", unit: "MXN/m²", detail: "Membrana + garantía 5 años" },
    ],
    prompt: `Eres un especialista en impermeabilización en Tijuana, México. Analiza la imagen:
1. Área afectada estimada (m²)
2. Tipo de filtración o daño visible
3. Sistema de impermeabilización recomendado
4. Costo estimado:
   - Básico (80-120 MXN/m²)
   - Pro (130-180 MXN/m²)
   - Premium con membrana (200-300 MXN/m²)

Responde en español.`,
  },
  {
    id: "herreria", name: "Herrería", emoji: "🔩",
    color: "#CFD8DC", dark: "#455A64",
    desc: "Rejas, portones y estructuras",
    subServices: [
      { name: "Rejas y protecciones",  detail: "Ventanas y puertas de seguridad" },
      { name: "Portones automáticos",  detail: "Instalación y automatización" },
      { name: "Escaleras metálicas",   detail: "Diseño y fabricación" },
      { name: "Estructuras",           detail: "Techos y pergolas metálicas" },
    ],
    tiers: [
      { tier: "Reparación",  price: "500–1,500",  unit: "MXN",     detail: "Soldadura y arreglos" },
      { tier: "Fabricación", price: "800–2,500",  unit: "MXN/m²",  detail: "Fabricación a medida" },
      { tier: "Proyecto",    price: "Cotización", unit: "especial", detail: "Proyectos mayores" },
    ],
    prompt: `Eres un maestro herrero en Tijuana, México. Analiza la imagen del trabajo de herrería:
1. Tipo de trabajo (reja, portón, escalera, estructura)
2. Dimensiones aproximadas
3. Material y acabado recomendado
4. Costo estimado:
   - Reparación (500-1,500 MXN)
   - Fabricación por m² (800-2,500 MXN/m²)
   - Proyecto especial (cotización)

Responde en español.`,
  },
  {
    id: "pisos", name: "Pisos", emoji: "⬛",
    color: "#FFCC80", dark: "#E65100",
    desc: "Azulejo, laminado y pulido",
    subServices: [
      { name: "Azulejo y cerámica",      detail: "Pisos y paredes" },
      { name: "Piso laminado",           detail: "Flotante de madera y vinílico" },
      { name: "Concreto pulido",         detail: "Microcemento y epóxico" },
      { name: "Pulido y abrillantado",   detail: "Mármol y granito" },
    ],
    tiers: [
      { tier: "Básico",  price: "120–200", unit: "MXN/m²", detail: "Material y colocación estándar" },
      { tier: "Pro",     price: "250–400", unit: "MXN/m²", detail: "Material premium + junteado" },
      { tier: "Premium", price: "500–900", unit: "MXN/m²", detail: "Materiales de importación" },
    ],
    prompt: `Eres un especialista en pisos en Tijuana, México. Analiza la imagen:
1. Área estimada (m²)
2. Estado del piso actual
3. Tipo de piso recomendado para el espacio
4. Costo estimado:
   - Básico (120-200 MXN/m²)
   - Pro (250-400 MXN/m²)
   - Premium (500-900 MXN/m²)
5. Tiempo estimado de instalación

Responde en español.`,
  },
  {
    id: "carpinteria", name: "Carpintería", emoji: "🪵",
    color: "#A5D6A7", dark: "#2E7D32",
    desc: "Muebles, closets y cocinas",
    subServices: [
      { name: "Muebles a medida",      detail: "Diseño y fabricación personalizada" },
      { name: "Closets y vestidores",  detail: "Sistemas modulares y a medida" },
      { name: "Cocinas integrales",    detail: "Diseño completo de cocina" },
      { name: "Puertas y marcos",      detail: "Madera maciza y MDF" },
    ],
    tiers: [
      { tier: "Reparación",  price: "600–2,000",  unit: "MXN",     detail: "Arreglos y ajustes" },
      { tier: "Fabricación", price: "3,000–12k",  unit: "MXN",     detail: "Mueble estándar" },
      { tier: "Proyecto",    price: "Cotización", unit: "especial", detail: "Cocinas y vestidores" },
    ],
    prompt: `Eres un maestro carpintero en Tijuana, México. Analiza la imagen:
1. Tipo de mueble o elemento visible
2. Materiales y dimensiones aproximadas
3. Trabajo recomendado
4. Costo estimado:
   - Reparación (600-2,000 MXN)
   - Fabricación estándar (3,000-12,000 MXN)
   - Proyecto especial (cotización)

Responde en español.`,
  },
  {
    id: "ac", name: "A/C y HVAC", emoji: "❄️",
    color: "#80DEEA", dark: "#00695C",
    desc: "Mini-splits, mantenimiento y gas",
    subServices: [
      { name: "Instalación mini-split",    detail: "Todas las marcas y capacidades" },
      { name: "Mantenimiento y limpieza",  detail: "Lavado y revisión completa" },
      { name: "Carga de gas refrigerante", detail: "R-22, R-410A y R-32" },
      { name: "Ductos de A/C central",     detail: "Instalación y reparación" },
    ],
    tiers: [
      { tier: "Mantenimiento", price: "600–1,200",  unit: "MXN",     detail: "Limpieza y revisión" },
      { tier: "Instalación",   price: "3,000–6,000", unit: "MXN",    detail: "Mini-split completo" },
      { tier: "A/C central",   price: "Cotización", unit: "especial", detail: "Proyecto integral" },
    ],
    prompt: `Eres un técnico certificado en A/C y HVAC en Tijuana, México. Analiza la imagen y sé honesto sobre las limitaciones del diagnóstico visual.

Responde con:
1. 🔍 Lo que puedes ver: tipo de equipo, marca/modelo aproximado, estado visible
2. ⚠️ Limitación importante: indica claramente que el diagnóstico eléctrico interno, nivel de gas refrigerante y estado del compresor NO pueden determinarse solo con una foto — requieren visita técnica
3. 🔧 Servicio probable basado en lo visible:
   - Mantenimiento/limpieza (600–1,200 MXN)
   - Instalación de mini-split (3,000–6,000 MXN)
   - Sistema central (cotización especial)
4. 📅 Recomendación: "Para una cotización exacta, agenda una visita técnica sin costo."

Sé profesional y honesto. Responde en español.`,
  },
  {
    id: "vidrieria", name: "Vidriería", emoji: "🪟",
    color: "#B3E5FC", dark: "#0277BD",
    desc: "Ventanas, cancelería y espejos",
    subServices: [
      { name: "Cambio de vidrios",      detail: "Vidrio claro, templado y laminado" },
      { name: "Cancelería de aluminio", detail: "Ventanas, puertas y divisiones" },
      { name: "Espejos",                detail: "Instalación y biselado" },
      { name: "Domos y tragaluces",     detail: "Policarbonato y vidrio" },
    ],
    tiers: [
      { tier: "Reparación",  price: "400–1,500",  unit: "MXN",     detail: "Cambio de vidrio" },
      { tier: "Instalación", price: "800–3,000",  unit: "MXN/m²",  detail: "Cancelería nueva" },
      { tier: "Proyecto",    price: "Cotización", unit: "especial", detail: "Divisiones y domos" },
    ],
    prompt: `Eres un experto en vidriería y cancelería en Tijuana, México. Analiza la imagen:
1. Tipo y dimensión aproximada del vidrio o ventana
2. Estado visible
3. Trabajo recomendado
4. Costo estimado:
   - Reparación/cambio de vidrio (400-1,500 MXN)
   - Instalación cancelería (800-3,000 MXN/m²)
   - Proyecto especial (cotización)

Responde en español.`,
  },
  {
    id: "limpieza", name: "Limpieza", emoji: "✨",
    color: "#F8BBD0", dark: "#880E4F",
    desc: "Profunda, post-obra y oficinas",
    subServices: [
      { name: "Limpieza profunda",     detail: "Hogar completo o por cuarto" },
      { name: "Post-construcción",     detail: "Retiro de residuos y polvo fino" },
      { name: "Oficinas y locales",    detail: "Mantenimiento periódico" },
      { name: "Alfombras y tapicería", detail: "Lavado profundo a domicilio" },
    ],
    tiers: [
      { tier: "Básico",    price: "150–250", unit: "MXN/cuarto", detail: "Limpieza estándar" },
      { tier: "Profunda",  price: "300–500", unit: "MXN/cuarto", detail: "Con productos especializados" },
      { tier: "Post-obra", price: "25–45",   unit: "MXN/m²",     detail: "Remoción de residuos" },
    ],
    prompt: `Eres un experto en limpieza profesional en Tijuana, México. Analiza la imagen del espacio:
1. Tipo y tamaño aproximado del espacio
2. Nivel de suciedad o tipo de limpieza necesaria
3. Servicio recomendado
4. Costo estimado:
   - Limpieza básica (150-250 MXN/cuarto)
   - Limpieza profunda (300-500 MXN/cuarto)
   - Post-obra (25-45 MXN/m²)

Responde en español.`,
  },
  {
    id: "techos", name: "Techos", emoji: "🏠",
    color: "#EF9A9A", dark: "#B71C1C",
    desc: "Lámina, tejas y estructura",
    subServices: [
      { name: "Techo de lámina",     detail: "Galvanizada, pintro y policarbonato" },
      { name: "Reparación de tejas", detail: "Cerámica, barro y concreto" },
      { name: "Estructura metálica", detail: "Armado y reparación" },
      { name: "Drenaje pluvial",     detail: "Canaletas y bajadas" },
    ],
    tiers: [
      { tier: "Reparación",  price: "800–2,500",  unit: "MXN",     detail: "Parches y arreglos" },
      { tier: "Instalación", price: "250–450",    unit: "MXN/m²",  detail: "Techo nuevo" },
      { tier: "Estructura",  price: "Cotización", unit: "especial", detail: "Proyectos estructurales" },
    ],
    prompt: `Eres un experto en techados en Tijuana, México. Analiza la imagen:
1. 🔍 Diagnóstico visual: tipo de techo, material, daños visibles
2. 🚨 Urgencia: URGENTE / PRONTO / PREVENTIVO
3. 💰 Costo orientativo:
   - Reparación (800–2,500 MXN)
   - Impermeabilización + reparación (3,000–8,000 MXN)
   - Techo nuevo (250–450 MXN/m²)
4. ⚠️ Aviso: cotización exacta requiere visita presencial.
5. 📅 "Te recomendamos agendar una visita de inspección sin costo."

Responde en español.`,
  },
];

// ─── UTILS ─────────────────────────────────────────────────────────────
const whatsapp = (msg) =>
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

const toBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Error al leer imagen"));
    r.readAsDataURL(file);
  });

// ─── STYLES ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0A1410; --bg2: #111c17; --bg3: #172318;
    --surface: #1A2B22; --lime: #C8F050; --lime2: #a8d038;
    --text: #e8f5e0; --muted: #7a9a80;
    --border: rgba(200,240,80,0.12); --radius: 14px;
  }
  body, html { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  .app { max-width: 420px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; overflow: hidden; }
  .screen { min-height: calc(100vh - 72px); overflow-y: auto; padding-bottom: 88px; animation: fadeIn .22s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .top-bar { position: sticky; top: 0; z-index: 10; background: var(--bg); padding: 16px 20px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .brand { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; color: var(--lime); line-height: 1; }
  .brand-sub { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .notif-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; }
  .hero { padding: 20px 20px 16px; background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%); }
  .hero h1 { font-family: 'Bebas Neue', sans-serif; font-size: 42px; line-height: 1; color: var(--text); }
  .hero h1 span { color: var(--lime); }
  .hero p { font-size: 13px; color: var(--muted); margin-top: 6px; line-height: 1.5; }
  .lime-pill { display: inline-block; background: var(--lime); color: #0A1410; font-size: 10px; font-weight: 600; letter-spacing: 1px; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 8px; }
  .search-wrap { padding: 14px 20px 0; position: relative; }
  .search-input { width: 100%; padding: 12px 16px 12px 40px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
  .search-input::placeholder { color: var(--muted); }
  .search-wrap::after { content: '🔍'; position: absolute; left: 32px; top: 50%; transform: translateY(-50%); font-size: 14px; pointer-events: none; }
  .section-label { padding: 18px 20px 10px; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); display: flex; justify-content: space-between; align-items: center; }
  .section-label span { color: var(--lime); font-size: 10px; cursor: pointer; }
  .service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 20px; }
  .service-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 10px 12px; cursor: pointer; transition: transform .15s, border-color .15s, background .15s; position: relative; overflow: hidden; text-align: center; }
  .service-card:hover { transform: translateY(-2px); background: var(--bg3); }
  .service-card:active { transform: scale(0.97); }
  .service-card .svc-emoji { font-size: 22px; line-height: 1; }
  .service-card .svc-name { font-size: 11px; font-weight: 600; color: var(--text); margin-top: 6px; line-height: 1.2; }
  .service-card .svc-desc { font-size: 9px; color: var(--muted); margin-top: 3px; line-height: 1.3; }
  .badge-active { position: absolute; top: 6px; right: 6px; background: var(--lime); color: #0A1410; font-size: 7px; font-weight: 700; letter-spacing: .5px; padding: 2px 5px; border-radius: 4px; text-transform: uppercase; }
  .svc-accent-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 0 0 var(--radius) var(--radius); }
  .svc-hero { padding: 24px 20px 20px; position: relative; }
  .back-btn { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; margin-bottom: 16px; width: fit-content; }
  .back-btn:hover { color: var(--text); }
  .svc-hero-title { font-family: 'Bebas Neue', sans-serif; font-size: 44px; line-height: 1; color: var(--text); }
  .svc-hero-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .svc-icon-lg { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.1); }
  .tier-cards { display: flex; flex-direction: column; gap: 10px; padding: 0 20px; }
  .tier-card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: border-color .15s; }
  .tier-card.selected { border-width: 1.5px; }
  .tier-card:hover { border-color: rgba(200,240,80,0.3); }
  .tier-left .tier-name { font-size: 14px; font-weight: 600; color: var(--text); }
  .tier-left .tier-detail { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .tier-right .tier-price { font-family: 'Bebas Neue', sans-serif; font-size: 22px; line-height: 1; }
  .tier-right .tier-unit { font-size: 10px; color: var(--muted); text-align: right; }
  .sub-list { padding: 0 20px; display: flex; flex-direction: column; gap: 8px; }
  .sub-item { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .sub-item:hover { background: var(--surface); }
  .sub-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .sub-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .sub-detail { font-size: 11px; color: var(--muted); }
  .cta-primary { width: 100%; padding: 16px; background: var(--lime); color: #0A1410; border: none; border-radius: var(--radius); font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 2px; cursor: pointer; transition: transform .12s, background .12s; }
  .cta-primary:hover { background: var(--lime2); }
  .cta-primary:active { transform: scale(0.98); }
  .cta-primary:disabled { opacity: .5; cursor: not-allowed; }
  .cta-secondary { width: 100%; padding: 14px; background: transparent; color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .12s; }
  .cta-secondary:hover { background: var(--surface); }
  .photo-zone { margin: 0 20px; border: 1.5px dashed rgba(200,240,80,0.3); border-radius: var(--radius); min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color .2s, background .2s; overflow: hidden; position: relative; background: var(--bg3); }
  .photo-zone:hover { border-color: var(--lime); background: rgba(200,240,80,0.04); }
  .photo-zone img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .photo-overlay { position: absolute; inset: 0; background: rgba(10,20,16,0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
  .photo-hint { font-size: 12px; color: var(--muted); text-align: center; padding: 0 20px; }
  .photo-icon { font-size: 32px; }
  .result-box { margin: 0 20px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
  .result-box h3 { font-size: 13px; font-weight: 600; color: var(--lime); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .result-box p { font-size: 13px; color: var(--text); line-height: 1.7; white-space: pre-wrap; }
  .dot-pulse { display: flex; gap: 4px; }
  .dot-pulse div { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: pulse 1.2s ease-in-out infinite; }
  .dot-pulse div:nth-child(2) { animation-delay: .2s; }
  .dot-pulse div:nth-child(3) { animation-delay: .4s; }
  @keyframes pulse { 0%,80%,100% { transform: scale(0.6); opacity: .4; } 40% { transform: scale(1); opacity: 1; } }
  .form-group { padding: 0 20px; margin-bottom: 14px; }
  .form-label { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .form-input, .form-select, .form-textarea { width: 100%; padding: 13px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .15s; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(200,240,80,0.5); }
  .form-select option { background: var(--bg); }
  .form-textarea { resize: none; min-height: 80px; }
  .steps-indicator { display: flex; align-items: center; gap: 6px; padding: 0 20px; margin-bottom: 20px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); transition: background .2s; }
  .step-dot.active { background: var(--lime); border-color: var(--lime); }
  .step-dot.done { background: rgba(200,240,80,0.5); border-color: var(--lime); }
  .step-line { flex: 1; height: 1px; background: var(--border); }
  .step-label { font-size: 11px; color: var(--muted); flex: 1; text-align: right; }
  .confirm-screen { min-height: calc(100vh - 72px); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 28px; gap: 16px; animation: fadeIn .3s ease; }
  .confirm-icon { font-size: 56px; }
  .confirm-screen h2 { font-family: 'Bebas Neue', sans-serif; font-size: 40px; line-height: 1; color: var(--text); }
  .confirm-screen h2 span { color: var(--lime); }
  .confirm-screen p { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .summary-card { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; text-align: left; }
  .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
  .summary-row .label { color: var(--muted); }
  .summary-row .value { color: var(--text); font-weight: 500; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 420px; background: rgba(10,20,16,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); display: flex; height: 72px; z-index: 100; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; cursor: pointer; transition: color .15s; color: var(--muted); }
  .nav-item.active { color: var(--lime); }
  .nav-item .nav-icon { font-size: 18px; }
  .nav-item .nav-label { font-size: 10px; font-weight: 500; letter-spacing: .5px; }
  .wa-float { position: fixed; bottom: 84px; right: 16px; width: 48px; height: 48px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; box-shadow: 0 4px 16px rgba(37,211,102,0.4); z-index: 200; border: none; transition: transform .15s; }
  .wa-float:hover { transform: scale(1.1); }
  .divider { height: 1px; background: var(--border); margin: 6px 0; }
  .pad { padding: 0 20px; }
  .mt8 { margin-top: 8px; } .mt12 { margin-top: 12px; } .mt16 { margin-top: 16px; }
  .mt20 { margin-top: 20px; } .mb16 { margin-bottom: 16px; }
  .pintatec-link { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 20px; font-size: 11px; color: var(--muted); text-decoration: none; border-top: 1px solid var(--border); margin-top: 8px; }
  .pintatec-link strong { color: var(--lime); }
`;

// ─── TOP BAR ───────────────────────────────────────────────────────────
function TopBar({ title, onBack, brand = BRAND }) {
  return (
    <div className="top-bar">
      {onBack ? (
        <div className="back-btn" onClick={onBack}>
          <span>←</span> <span>{title}</span>
        </div>
      ) : (
        <div>
          <div className="brand">{brand.name}</div>
          <div className="brand-sub">{brand.sub}</div>
        </div>
      )}
      {!onBack && (
        <button className="notif-btn" onClick={() => whatsapp("Hola! Necesito información sobre sus servicios.")}>
          💬
        </button>
      )}
    </div>
  );
}

// ─── HOME SCREEN ───────────────────────────────────────────────────────
function HomeScreen({ onSelectService, services = SERVICES, brand = BRAND }) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? services.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.desc.toLowerCase().includes(query.toLowerCase())
      )
    : services;

  return (
    <div className="screen">
      <TopBar brand={brand} />
      <div className="hero">
        <div className="lime-pill">Tijuana · B.C.</div>
        <h1>REPARA<br /><span>MEJOR.</span></h1>
        <p>Cotización por IA en 60 segundos.<br />{services.length} servicios. Profesionales verificados.</p>
      </div>
      <div className="search-wrap mt12">
        <input
          className="search-input"
          placeholder="¿Qué necesitas reparar?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="section-label">
        Servicios disponibles
        <span>{filtered.length} de {services.length}</span>
      </div>
      <div className="service-grid">
        {filtered.map((svc) => (
          <div key={svc.id} className="service-card" onClick={() => onSelectService(svc)}>
            {svc.badge && <div className="badge-active">{svc.badge}</div>}
            <div className="svc-emoji">{svc.emoji}</div>
            <div className="svc-name">{svc.name}</div>
            <div className="svc-desc">{svc.desc}</div>
            <div className="svc-accent-bar" style={{ background: svc.color }} />
          </div>
        ))}
      </div>
      <div className="section-label mt16">Pagos</div>
      <div className="pad">
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px", display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>💳</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Esquema 40 · 30 · 30</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Anticipo, a mitad de obra, al terminar</div>
          </div>
        </div>
      </div>
      {brand.name === "CASATEC" && (
        <div style={{ padding: "16px 20px 4px" }}>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--lime)", letterSpacing: 1 }}>PINTATEC</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>Especialistas en pintura · pintatec.mx</div>
            </div>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>subsidiaria ↗</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SERVICE DETAIL SCREEN ─────────────────────────────────────────────
function ServiceScreen({ service, onBack, onEstimate, onBook }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const accent = service.color;
  return (
    <div className="screen">
      <TopBar title="Servicios" onBack={onBack} />
      <div className="svc-hero">
        <div className="svc-icon-lg" style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>{service.emoji}</div>
        <div className="svc-hero-title" style={{ color: accent }}>{service.name.toUpperCase()}</div>
        <div className="svc-hero-sub">{service.desc}</div>
        {service.badge && <span className="lime-pill mt8" style={{ display: "inline-block" }}>{service.badge}</span>}
      </div>
      <div className="section-label">Tipos de servicio</div>
      <div className="sub-list">
        {service.subServices.map((sub, i) => (
          <div className="sub-item" key={i}>
            <div className="sub-dot" style={{ background: accent }} />
            <div><div className="sub-name">{sub.name}</div><div className="sub-detail">{sub.detail}</div></div>
          </div>
        ))}
      </div>
      <div className="section-label mt16">Tiers de precio</div>
      <div className="tier-cards">
        {service.tiers.map((t, i) => (
          <div
            key={i}
            className={`tier-card${selectedTier === i ? " selected" : ""}`}
            style={selectedTier === i ? { borderColor: accent } : {}}
            onClick={() => setSelectedTier(i)}
          >
            <div className="tier-left"><div className="tier-name">{t.tier}</div><div className="tier-detail">{t.detail}</div></div>
            <div className="tier-right"><div className="tier-price" style={{ color: accent }}>{t.price}</div><div className="tier-unit">{t.unit}</div></div>
          </div>
        ))}
      </div>
      <div className="pad mt20 mb16" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="cta-primary" onClick={() => onEstimate(service)}>📸 COTIZAR CON IA</button>
        <button className="cta-secondary" onClick={() => onBook(service, selectedTier != null ? service.tiers[selectedTier] : null)}>
          Agendar sin cotización
        </button>
      </div>
    </div>
  );
}

// ─── AI ESTIMATE SCREEN ────────────────────────────────────────────────
function EstimateScreen({ service, onBack, onBook, brandName = BRAND.name }) {
  const [imgSrc, setImgSrc]   = useState(null);
  const [imgB64, setImgB64]   = useState(null);
  const [mime, setMime]       = useState("image/jpeg");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null); setError(null);
    setImgSrc(URL.createObjectURL(file));
    setMime(file.type || "image/jpeg");
    setImgB64(await toBase64(file));
  };

  const analyze = async () => {
    if (!imgB64) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mime, data: imgB64 } },
              { type: "text",  text: service.prompt }
            ]
          }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
    } catch (err) {
      setError("Error al analizar. Intenta de nuevo o contacta por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <TopBar title={service.name} onBack={onBack} />
      <div style={{ padding: "20px 20px 12px" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Cotización IA · {service.name}</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: service.color, lineHeight: 1 }}>SUBE UNA FOTO</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Estimado profesional en segundos</div>
      </div>
      <div className="photo-zone" style={{ minHeight: imgSrc ? 240 : 180 }} onClick={() => fileRef.current?.click()}>
        {imgSrc && <img src={imgSrc} alt="preview" />}
        <div className="photo-overlay" style={{ opacity: imgSrc ? 0.85 : 1 }}>
          <div className="photo-icon">{imgSrc ? "🔄" : "📸"}</div>
          <div className="photo-hint" style={{ color: imgSrc ? "#fff" : "var(--muted)" }}>
            {imgSrc ? "Toca para cambiar la foto" : `Sube una foto del área\n(${service.name.toLowerCase()})`}
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
      <div className="pad mt12">
        <button className="cta-primary" onClick={analyze} disabled={!imgB64 || loading}>
          {loading ? "ANALIZANDO..." : imgB64 ? "ANALIZAR CON IA →" : "SELECCIONA UNA FOTO"}
        </button>
      </div>
      {loading && (
        <div className="pad mt12 result-box" style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 0 }}>
          <div className="dot-pulse"><div/><div/><div/></div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Analizando con IA...</span>
        </div>
      )}
      {error && (
        <div className="pad mt12"><div className="result-box" style={{ borderColor: "rgba(255,80,80,0.3)" }}><p style={{ color: "#ff8080" }}>{error}</p></div></div>
      )}
      {result && !loading && (
        <>
          <div className="pad mt12"><div className="result-box"><h3>📊 Estimado — {service.name}</h3><p>{result}</p></div></div>
          <div className="pad mt12 mb16" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="cta-primary" onClick={() => whatsapp(`Hola! Acabo de usar el estimador de IA para ${service.name} en ${brandName}.\n\nEstimado:\n${result.slice(0, 300)}...`)}>
              📲 AGENDAR POR WHATSAPP
            </button>
            <button className="cta-secondary" onClick={() => onBook(service, null)}>Agendar en el app</button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── BOOKING SCREEN ────────────────────────────────────────────────────
const STEPS = ["Servicio", "Datos", "Fecha", "Confirmar"];

function BookingScreen({ service, tier, onBack, onConfirm, brandName = BRAND.name }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", date: "", time: "", payment: "40/30/30" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const canNext = [true, form.name && form.phone && form.address, form.date && form.time, true][step];
  const advance = () => { if (step < 3) setStep(s => s + 1); else onConfirm({ service, tier, form, brandName }); };
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="screen">
      <TopBar title="Agendar" onBack={step > 0 ? () => setStep(s => s - 1) : onBack} />
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: service?.color || "var(--lime)", lineHeight: 1 }}>{STEPS[step].toUpperCase()}</div>
      </div>
      <div className="steps-indicator">
        {STEPS.map((s, i) => (
          <><div key={s} className={`step-dot${i === step ? " active" : i < step ? " done" : ""}`} />{i < STEPS.length - 1 && <div className="step-line" />}</>
        ))}
        <span className="step-label">{step + 1} / {STEPS.length}</span>
      </div>
      {step === 0 && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="sub-item" style={{ background: service?.color + "22", borderColor: service?.color + "44" }}>
            <span style={{ fontSize: 24 }}>{service?.emoji}</span>
            <div><div className="sub-name">{service?.name}</div><div className="sub-detail">{service?.desc}</div></div>
          </div>
          {tier && (
            <div className="tier-card" style={{ borderColor: service?.color }}>
              <div className="tier-left"><div className="tier-name">Tier: {tier.tier}</div><div className="tier-detail">{tier.detail}</div></div>
              <div className="tier-right"><div className="tier-price" style={{ color: service?.color }}>{tier.price}</div><div className="tier-unit">{tier.unit}</div></div>
            </div>
          )}
          <div className="sub-item" style={{ marginTop: 4 }}>
            <span>💳</span>
            <div><div className="sub-name">Pago 40 · 30 · 30</div><div className="sub-detail">Anticipo al confirmar, 30% a mitad, 30% al finalizar</div></div>
          </div>
        </div>
      )}
      {step === 1 && (
        <>
          <div className="form-group"><label className="form-label">Nombre completo</label><input className="form-input" placeholder="Tu nombre" value={form.name} onChange={set("name")} /></div>
          <div className="form-group"><label className="form-label">Teléfono / WhatsApp</label><input className="form-input" placeholder="664 000 0000" type="tel" value={form.phone} onChange={set("phone")} /></div>
          <div className="form-group"><label className="form-label">Dirección del inmueble</label><input className="form-input" placeholder="Calle, número, colonia, Tijuana" value={form.address} onChange={set("address")} /></div>
          <div className="form-group"><label className="form-label">Notas adicionales (opcional)</label><textarea className="form-textarea" placeholder="Describe brevemente el trabajo..." value={form.notes} onChange={set("notes")} /></div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="form-group"><label className="form-label">Fecha preferida</label><input className="form-input" type="date" min={today} value={form.date} onChange={set("date")} /></div>
          <div className="form-group">
            <label className="form-label">Horario</label>
            <select className="form-select" value={form.time} onChange={set("time")}>
              <option value="">— Selecciona —</option>
              <option value="8:00 – 10:00">8:00 – 10:00 (Temprano)</option>
              <option value="10:00 – 12:00">10:00 – 12:00 (Mañana)</option>
              <option value="12:00 – 14:00">12:00 – 14:00 (Mediodía)</option>
              <option value="14:00 – 17:00">14:00 – 17:00 (Tarde)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Esquema de pago</label>
            <select className="form-select" value={form.payment} onChange={set("payment")}>
              <option value="40/30/30">40 / 30 / 30 (Recomendado)</option>
              <option value="50/50">50% anticipo / 50% al terminar</option>
              <option value="100%">Pago total al finalizar (requiere aprobación)</option>
            </select>
          </div>
        </>
      )}
      {step === 3 && (
        <div className="pad">
          <div className="summary-card">
            <div className="summary-row"><span className="label">Servicio</span><span className="value">{service?.name}</span></div>
            {tier && <div className="summary-row"><span className="label">Tier</span><span className="value">{tier.tier} · {tier.price} {tier.unit}</span></div>}
            <div className="divider" />
            <div className="summary-row"><span className="label">Nombre</span><span className="value">{form.name}</span></div>
            <div className="summary-row"><span className="label">Teléfono</span><span className="value">{form.phone}</span></div>
            <div className="summary-row"><span className="label">Dirección</span><span className="value" style={{ maxWidth: 180, textAlign: "right" }}>{form.address}</span></div>
            <div className="divider" />
            <div className="summary-row"><span className="label">Fecha</span><span className="value">{form.date}</span></div>
            <div className="summary-row"><span className="label">Horario</span><span className="value">{form.time}</span></div>
            <div className="summary-row"><span className="label">Pago</span><span className="value">{form.payment}</span></div>
          </div>
        </div>
      )}
      <div className="pad mt16 mb16" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="cta-primary" onClick={advance} disabled={!canNext}>{step < 3 ? "SIGUIENTE →" : "CONFIRMAR CITA ✓"}</button>
      </div>
    </div>
  );
}

// ─── CONFIRM SCREEN ────────────────────────────────────────────────────
function ConfirmScreen({ booking, onHome }) {
  const { service, tier, form, brandName = BRAND.name } = booking;
  useEffect(() => {
    const msg = `✅ *Nueva cita ${brandName}*\n\n📋 *Servicio:* ${service.name}${tier ? ` (${tier.tier})` : ""}\n👤 *Cliente:* ${form.name}\n📱 *Tel:* ${form.phone}\n📍 *Dirección:* ${form.address}\n📅 *Fecha:* ${form.date} ${form.time}\n💳 *Pago:* ${form.payment}${form.notes ? `\n📝 *Notas:* ${form.notes}` : ""}`;
    setTimeout(() => whatsapp(msg), 800);
  }, []);
  return (
    <div className="confirm-screen">
      <div className="confirm-icon">✅</div>
      <h2>CITA<br /><span>CONFIRMADA</span></h2>
      <p>Tu solicitud ha sido enviada.<br />Un especialista te contactará pronto.</p>
      <div className="summary-card">
        <div className="summary-row"><span className="label">Servicio</span><span className="value">{service.name}</span></div>
        {tier && <div className="summary-row"><span className="label">Tier</span><span className="value">{tier.tier}</span></div>}
        <div className="summary-row"><span className="label">Fecha</span><span className="value">{form.date}</span></div>
        <div className="summary-row"><span className="label">Horario</span><span className="value">{form.time}</span></div>
      </div>
      <button className="cta-primary" style={{ width: "100%" }} onClick={() => whatsapp(`Hola! Acabo de agendar una cita de ${service.name} para el ${form.date} en ${brandName}.`)}>
        💬 ABRIR WHATSAPP
      </button>
      <button className="cta-secondary" style={{ width: "100%" }} onClick={onHome}>← Volver al inicio</button>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────
export default function App({ brand = BRAND, services = SERVICES }) {
  const [view,    setView]    = useState("home");
  const [selSvc,  setSelSvc]  = useState(null);
  const [selTier, setSelTier] = useState(null);
  const [booking, setBooking] = useState(null);
  const [navTab,  setNavTab]  = useState("home");

  const goHome = () => { setView("home"); setNavTab("home"); setSelSvc(null); setSelTier(null); };

  const navItems = [
    { id: "home",  label: "Inicio",  icon: "🏠", action: goHome },
    { id: "quote", label: "Cotizar", icon: "📸", action: () => { if (selSvc) setView("estimate"); else setView("home"); setNavTab("quote"); } },
    { id: "book",  label: "Agendar", icon: "📅", action: () => { setView("booking"); setNavTab("book"); } },
    { id: "wa",    label: "Ayuda",   icon: "💬", action: () => whatsapp(`Hola! Necesito ayuda con ${brand.name}.`) },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {view === "home" && <HomeScreen brand={brand} services={services} onSelectService={(svc) => { setSelSvc(svc); setView("service"); }} />}
        {view === "service" && selSvc && (
          <ServiceScreen
            service={selSvc}
            onBack={goHome}
            onEstimate={(svc) => { setSelSvc(svc); setView("estimate"); }}
            onBook={(svc, t) => { setSelSvc(svc); setSelTier(t); setView("booking"); }}
          />
        )}
        {view === "estimate" && selSvc && (
          <EstimateScreen
            service={selSvc}
            brandName={brand.name}
            onBack={() => setView("service")}
            onBook={(svc, t) => { setSelSvc(svc); setSelTier(t); setView("booking"); }}
          />
        )}
        {view === "booking" && (
          <BookingScreen
            service={selSvc || services[0]}
            tier={selTier}
            brandName={brand.name}
            onBack={() => setView(selSvc ? "service" : "home")}
            onConfirm={(b) => { setBooking(b); setView("confirm"); }}
          />
        )}
        {view === "confirm" && booking && <ConfirmScreen booking={booking} onHome={goHome} />}

        {view !== "confirm" && (
          <button className="wa-float" onClick={() => whatsapp(`Hola! Quiero información sobre ${brand.name}.`)}>💬</button>
        )}

        <nav className="bottom-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item${navTab === item.id ? " active" : ""}`}
              onClick={() => { item.action(); if (item.id !== "wa") setNavTab(item.id); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
