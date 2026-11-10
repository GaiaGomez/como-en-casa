import { Eyebrow } from "@/components/public/decor";
import { Reveal } from "@/components/public/reveal";

// Mismo contenido de siempre. Las categorías son tarjetas de info → llevan color.
const CATEGORIES: { name: string; description: string; bg: string }[] = [
  { name: "Café", description: "Espressos, lattes, capuchinos y más.", bg: "bg-cec-sky" },
  { name: "Repostería", description: "Tortas, cupcakes y postres artesanales.", bg: "bg-cec-blush" },
  { name: "Postres", description: "Opciones dulces para cualquier momento.", bg: "bg-cec-lilac" },
  { name: "Bebidas", description: "Fríos, calientes y especiales de temporada.", bg: "bg-cec-sage" },
];

export default function CartaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
      {/* Encabezado editorial */}
      <section className="grid gap-8 border-b border-cec-ink/10 pb-14 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <Eyebrow>Carta</Eyebrow>
          <h1 className="cec-display mt-6 text-[clamp(2.8rem,7vw,5.5rem)]">Nuestra carta</h1>
        </div>
        <p className="max-w-sm text-lg leading-relaxed text-cec-ink-soft md:justify-self-end">
          Explora nuestros cafés, postres y opciones para compartir.
        </p>
      </section>

      {/* Categorías */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.name} delay={(i % 2) * 120}>
            <article className={`cec-card flex min-h-[240px] flex-col rounded-[22px] p-8 sm:p-10 ${cat.bg}`}>
              <span className="text-xs font-medium tracking-[0.2em] text-cec-ink/50">0{i + 1}</span>
              <h2 className="cec-display mt-auto pt-12 text-4xl sm:text-5xl">{cat.name}</h2>
              <p className="mt-3 text-base text-cec-ink/70">{cat.description}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-cec-ink/50">
        Carta sujeta a disponibilidad.
      </p>
    </div>
  );
}
