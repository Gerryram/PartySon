"use client";
// Pintatec — subsidiaria de Casatec enfocada en pintura residencial
// Accesible desde pintatec.mx (via middleware) o en /pintatec
import App from "../page";

const PINTATEC_BRAND = {
  name: "PINTATEC",
  sub: "Tu casa, transformada",
};

const PINTURA_SERVICE = {
  id: "pintura",
  name: "Pintura",
  emoji: "🎨",
  color: "#C8F050",
  dark: "#7AAA10",
  badge: "ACTIVO",
  desc: "Exterior, interior y acabados decorativos",
  subServices: [
    { name: "Pintura exterior",    detail: "Fachadas y muros exteriores" },
    { name: "Pintura interior",    detail: "Cuartos, salas y cocinas" },
    { name: "Acabados decorativos", detail: "Texturas, esmaltes y barnices" },
    { name: "Impermeabilización",  detail: "Azoteas y muros húmedos" },
  ],
  tiers: [
    { tier: "Básico",  price: "35–50",   unit: "MXN/m²", detail: "1 mano, pintura estándar" },
    { tier: "Pro",     price: "65–90",   unit: "MXN/m²", detail: "2 manos + preparación de superficie" },
    { tier: "Premium", price: "110–160", unit: "MXN/m²", detail: "Sellador + 2 manos + acabado fino" },
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

Sé concreto. Usa formato claro con emojis. Responde en español.`,
};

export default function PintatecPage() {
  return <App brand={PINTATEC_BRAND} services={[PINTURA_SERVICE]} />;
}
