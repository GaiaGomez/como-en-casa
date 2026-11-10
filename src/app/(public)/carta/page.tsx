import { ArrowDown } from "lucide-react";

import { Eyebrow } from "@/components/public/decor";
import { MENU, MENU_PDF_URL } from "@/lib/menu-data";
import { CartaClient } from "./client";

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
            Explora nuestros cafés, postres y opciones para compartir.
          </p>
          <a href={MENU_PDF_URL} download className="group mt-5 inline-flex items-center gap-2 text-sm font-medium">
            <span className="cec-link">Descargar carta en PDF</span>
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
