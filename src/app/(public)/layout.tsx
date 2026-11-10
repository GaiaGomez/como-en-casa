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
