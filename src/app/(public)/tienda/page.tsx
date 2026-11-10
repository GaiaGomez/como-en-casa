import { Eyebrow, LogoFull } from "@/components/public/decor";

export default function TiendaPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
      <div>
        <Eyebrow>Tienda</Eyebrow>
        <h1 className="cec-display mt-6 text-[clamp(2.8rem,7vw,5.5rem)]">Tienda</h1>
        <p className="cec-display mt-6 text-3xl text-cec-ink-soft">Próximamente.</p>
      </div>

      {/* Logo completo girando, para que la página no quede vacía */}
      <LogoFull spin className="w-56 justify-self-center text-cec-ink sm:w-64" />
    </section>
  );
}
