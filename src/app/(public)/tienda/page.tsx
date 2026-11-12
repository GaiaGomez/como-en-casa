import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Eyebrow, LogoFull } from "@/components/public/decor";

export default function TiendaPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
      <div>
        <Eyebrow>Tienda</Eyebrow>
        <h1 className="cec-display mt-6 text-[clamp(2.8rem,7vw,5.5rem)]">Tienda</h1>
        <p className="cec-display mt-6 text-3xl">Estamos preparando algo rico.</p>
        <p className="mt-3 max-w-sm text-lg text-cec-ink-soft">Vuelve pronto. Mientras tanto, date una vuelta por los momentos.</p>
        <Link
          href="/momentos"
          className="cec-pop-btn mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#f4f1ec] px-7 text-base font-bold text-cec-ink hover:bg-white"
        >
          Ver momentos
          <ArrowRight className="cec-nudge size-4" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Logo completo girando, para que la página no quede vacía */}
      <LogoFull spin className="w-56 justify-self-center text-cec-ink sm:w-64" />
    </section>
  );
}
