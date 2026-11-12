import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";

import { Eyebrow } from "@/components/public/decor";
import { MENU, MENU_PDF_URL } from "@/lib/menu-data";
import { CartaClient } from "./client";

// Vista previa del enlace /carta (WhatsApp, Instagram, Google)
export const metadata: Metadata = {
  title: "Nuestra carta",
  description: "Cafés, repostería, brunch, hamburguesas, bebidas y más. Mira la carta de Como en Casa en Bello.",
  openGraph: {
    title: "Nuestra carta · Como en Casa",
    description: "Cafés, repostería, brunch, hamburguesas, bebidas y más. Mira la carta de Como en Casa en Bello.",
    // openGraph de una página reemplaza el del layout completo, así que la imagen se repite aquí
    images: [{ url: "/og-como-en-casa.jpg", width: 1200, height: 630, alt: "Como en Casa — Nuestra carta" }],
  },
};

// La página es Server Component: el encabezado se renderiza en el
// servidor y solo la parte interactiva (filtros/buscador) va al cliente.
// Las escenas con foto van a todo el ancho, por eso solo el encabezado
// lleva contenedor centrado.
export default function CartaPage() {
  return (
    <div className="bg-[#f4efe8]">
      {/* Encabezado */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-14 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-end lg:px-8">
        <div>
          <Eyebrow>Carta 2026</Eyebrow>
          <h1 className="cec-display mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">Nuestra carta</h1>
        </div>
        <div className="max-w-sm md:justify-self-end">
          <p className="text-lg leading-relaxed text-cec-ink-soft">
            Café, postres, brunch y más. Busca lo que se te antoja.
          </p>
          <a href={MENU_PDF_URL} download className="group mt-5 inline-flex items-center gap-2 text-sm font-medium">
            <span className="cec-link">Descárgala en PDF</span>
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      <CartaClient sections={MENU} />

      <p className="cec-cond py-8 text-center text-[11px] font-medium tracking-[0.28em] text-cec-ink/50">
        Carta sujeta a disponibilidad
      </p>
    </div>
  );
}
