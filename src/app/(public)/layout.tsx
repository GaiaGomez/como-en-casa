import { DM_Sans, Fraunces } from "next/font/google";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

// Fuentes SOLO de la web pública (el admin sigue con Inter).
// next/font las descarga en build y las sirve desde tu dominio:
// sin petición extra a Google y sin "salto" de fuente al cargar.

// Títulos: serif editorial. El eje SOFT redondea un poco las
// terminaciones → elegante pero cálida (no corporativa, no infantil).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-cec-serif",
  axes: ["SOFT", "opsz"],
});

// Texto corrido: sans limpia y neutra que deja lucir a la serif.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-cec-sans",
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`cec ${fraunces.variable} ${dmSans.variable} flex min-h-screen flex-col`}>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
