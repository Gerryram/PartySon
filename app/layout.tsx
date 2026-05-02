import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASATEC — Reparaciones inteligentes",
  description: "Cotización por IA en 60 segundos. Pintura, plomería, electricidad y 9 servicios más. Profesionales verificados en Tijuana, B.C.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A1410",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: "#0A1410" }}>{children}</body>
    </html>
  );
}
