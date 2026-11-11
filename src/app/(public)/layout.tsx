import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Gloock } from "next/font/google";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

// Fuentes SOLO de la web pública (el admin sigue con Inter).
// Son las mismas de la carta impresa, para que carta, web y PDF
// se vean como una sola marca.
// next/font las descarga en build y las sirve desde tu dominio:
// sin petición extra a Google y sin "salto" de fuente al cargar.

// Títulos: serif editorial con mucho carácter (solo existe en 400).
const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cec-title",
});

// Texto corrido: sans limpia y legible.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cec-sans",
});

// Nombres de platos, precios y etiquetas en mayúsculas espaciadas.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cec-cond",
});

// Metadatos de la web pública: es lo que muestran WhatsApp, Instagram
// y Google en la vista previa de un enlace. Reemplazan los del admin
// ("Operación interna…") solo en las rutas públicas.
const SITE_URL = "https://como-en-casa-admin.vercel.app";
const DESCRIPTION =
  "Café de especialidad, repostería fina, gastronomía y celebraciones en Bello, Antioquia. Un lugar para sentirte como en casa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Como en Casa · Café y repostería en Bello", template: "%s · Como en Casa" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Como en Casa",
    title: "Como en Casa · Café y repostería en Bello",
    description: DESCRIPTION,
    images: [{ url: "/og-como-en-casa.jpg", width: 1200, height: 630, alt: "Como en Casa — Nuestra carta" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-como-en-casa.jpg"] },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`cec ${gloock.variable} ${barlow.variable} ${barlowCondensed.variable} flex min-h-screen flex-col`}
    >
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
