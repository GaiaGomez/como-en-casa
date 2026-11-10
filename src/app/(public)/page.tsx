import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Eyebrow, LogoFull, SocialLinks } from "@/components/public/decor";
import { Reveal } from "@/components/public/reveal";
import {
  ADDRESS,
  INSTAGRAM_URL,
  MAPS_EMBED_URL,
  MAPS_URL,
  SCHEDULE,
  WHATSAPP_URL,
} from "@/lib/public-info";

// Las 3 acciones del home. Mismo contenido de siempre.
// Son de las pocas piezas con color (dan info / llevan a vender).
const ACTIONS: { href: string; external?: boolean; title: string; text: string; bg: string }[] = [
  {
    href: "/momentos",
    title: "Momentos especiales",
    text: "Celebra cumpleaños, aniversarios y más con decoración y torta personalizada.",
    bg: "bg-cec-blush",
  },
  {
    href: "/carta",
    title: "Nuestra carta",
    text: "Cafés, postres, bebidas y opciones para compartir.",
    bg: "bg-cec-sky",
  },
  {
    href: WHATSAPP_URL,
    external: true,
    title: "Escríbenos",
    text: "Cuéntanos qué necesitas por WhatsApp.",
    bg: "bg-cec-sage",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════════════════
          Tipografía editorial grande que entra palabra por palabra,
          y el logo completo con el anillo girando lento. */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-12 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-20 lg:px-8">
        <div>
          <Eyebrow>Café y repostería fina en Bello.</Eyebrow>

          <h1 className="cec-display mt-6 text-[clamp(3rem,7.5vw,6rem)]">
            {["Como", "en", "Casa"].map((word, i) => (
              <span
                key={word}
                className="cec-rise mr-[0.22em]"
                style={{ "--d": `${120 + i * 140}ms` } as React.CSSProperties}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-sm text-lg leading-relaxed text-cec-ink-soft">
            Un lugar para celebrar, compartir algo dulce y disfrutar momentos especiales.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/momentos"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-cec-ink px-7 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Ver momentos
              <ArrowRight className="cec-arrow size-4" />
            </Link>
            <Link href="/carta" className="group inline-flex items-center gap-2 text-sm font-medium">
              <span className="cec-link">Ver carta</span>
              <ArrowRight className="cec-arrow size-4" />
            </Link>
          </div>
        </div>

        {/* Logo completo: círculo negro + contorno fino desplazado
            (da profundidad sin recurrir a sombras duras). */}
        <div className="cec-spin-hover relative mx-auto aspect-square w-full max-w-[440px]">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full border border-cec-ink/25" />
          <div className="absolute inset-0 grid place-items-center rounded-full bg-cec-ink">
            <LogoFull spin className="w-[82%] text-white" />
          </div>
        </div>
      </section>

      {/* ═══ ¿QUÉ QUIERES HACER? ═══════════════════════════════ */}
      <section className="border-t border-cec-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="cec-display text-4xl sm:text-5xl">¿Qué quieres hacer?</h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {ACTIONS.map((a, i) => {
              const card = (
                <div className={`cec-card group flex h-full min-h-[300px] flex-col rounded-[22px] p-7 ${a.bg}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium tracking-[0.2em] text-cec-ink/50">
                      0{i + 1}
                    </span>
                    <span className="grid size-10 place-items-center rounded-full bg-white/70 transition-all duration-300 group-hover:rotate-45 group-hover:bg-cec-ink group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <h3 className="cec-display mt-auto pt-16 text-[1.9rem]">{a.title}</h3>
                  <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-cec-ink/70">{a.text}</p>
                </div>
              );

              return (
                <Reveal key={a.title} delay={i * 120}>
                  {a.external ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                      {card}
                    </a>
                  ) : (
                    <Link href={a.href} className="block h-full">
                      {card}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ VISÍTANOS ═════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid overflow-hidden rounded-[28px] border border-cec-ink/10 md:grid-cols-2">
          {/* Horarios */}
          <div className="bg-cec-ink p-8 text-white sm:p-12">
            <Eyebrow className="text-white/60">Horarios</Eyebrow>
            <ul className="mt-8">
              {SCHEDULE.map((s) => (
                <li
                  key={s.day}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/15 py-4 last:border-0"
                >
                  <span className="text-sm text-white/70">{s.day}</span>
                  <span className="cec-display text-2xl">{s.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dónde estamos */}
          <div className="flex flex-col p-8 sm:p-12">
            <Eyebrow>Dónde estamos</Eyebrow>
            <p className="cec-display mt-8 text-3xl sm:text-4xl">{ADDRESS.line1}</p>
            <p className="mt-2 text-cec-ink-soft">{ADDRESS.line2}</p>

            {/* Mapa embebido. En blanco y negro para respetar la estética;
                recupera el color al pasar el mouse. loading="lazy" = no se
                carga hasta que el usuario baja hasta aquí (web más rápida). */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-cec-ink/10">
              <iframe
                src={MAPS_EMBED_URL}
                title="Mapa: Como en Casa, Carrera 49 # 54-47, Bello"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-64 w-full grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <SocialLinks instagramUrl={INSTAGRAM_URL} whatsappUrl={WHATSAPP_URL} />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="cec-link">Abrir en Google Maps</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
