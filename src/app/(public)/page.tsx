import Image from "next/image";
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
    text: "Cumple, aniversario o porque sí: te armamos la mesa, la torta y los globos.",
    bg: "bg-cec-blush",
  },
  {
    href: "/carta",
    title: "Nuestra carta",
    text: "Café, postres, brunch y algo rico para compartir.",
    bg: "bg-cec-sky",
  },
  {
    href: WHATSAPP_URL,
    external: true,
    title: "Escríbenos",
    text: "¿Tienes una idea o una pregunta? Háblanos por WhatsApp.",
    bg: "bg-cec-sage",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════════════════
          Foto de la terraza de noche a todo el ancho, con el texto en
          blanco encima. Solo esta sección lleva foto; el resto del home
          sigue blanco. */}
      <section className="relative isolate overflow-hidden text-white">
        {/* Foto de fondo. next/image con `fill` la ajusta al tamaño de la
            sección; `priority` la carga primero porque es lo primero que se ve. */}
        <Image
          src="/hero-terraza.jpg"
          alt="Terraza de Como en Casa de noche, con luces y mesas decoradas"
          fill
          priority
          sizes="100vw"
          // Celular: encuadre a la izquierda (object-[15%_center]) para que se vean
          // las luces, los globos y el letrero BABY. Computador: foto centrada.
          className="-z-20 object-cover object-[15%_center] md:object-center"
        />
        {/* Capa oscura para que el texto blanco se lea:
            - Celular: degradado de abajo hacia arriba. Arriba queda casi limpio
              (las luces brillan) y abajo oscuro, donde va el texto.
            - Computador: degradado de izquierda a derecha, como antes. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/0 md:bg-gradient-to-r md:from-black/75 md:via-black/45 md:to-black/10"
        />

        {/* Celular: alto casi completo y texto pegado abajo (content-end) para
            dejar arriba el espacio a las luces. Computador: centrado. */}
        <div className="mx-auto grid min-h-[86svh] max-w-6xl content-end items-center gap-14 px-4 pb-14 pt-14 sm:px-6 md:min-h-[78svh] md:content-center md:grid-cols-[1.15fr_1fr] md:pb-24 md:pt-20 lg:px-8">
          <div>
            <Eyebrow className="text-white/75">Café y repostería en Bello</Eyebrow>

            <h1 className="cec-display mt-6 text-[clamp(3rem,7.5vw,6rem)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
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

            <p className="mt-7 max-w-sm text-lg leading-relaxed text-white/85">
              Tu casita en Bello para un buen café, algo dulce y celebrar lo que sea.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/momentos"
                className="cec-pop-btn inline-flex h-12 items-center gap-2 rounded-full bg-[#f4f1ec] px-7 text-base font-bold text-cec-ink hover:bg-white"
              >
                Ver momentos
                <ArrowRight className="cec-nudge size-4" strokeWidth={2.5} />
              </Link>
              <Link href="/carta" className="group inline-flex items-center gap-2 text-sm font-medium text-white">
                <span className="cec-link">Ver carta</span>
                <ArrowRight className="cec-arrow size-4" />
              </Link>
            </div>
          </div>

          {/* Logo completo: círculo negro con borde blanco fino para que se
              despegue de la foto oscura. Se oculta en celular para que la
              foto respire y el texto quede protagonista. */}
          <div className="cec-spin-hover relative mx-auto hidden aspect-square w-full max-w-[400px] md:block">
            <div className="absolute inset-0 grid place-items-center rounded-full border-[1.5px] border-white/70 bg-cec-ink/90 shadow-[8px_8px_0_0_rgba(255,255,255,0.85)] backdrop-blur-sm">
              <LogoFull spin className="w-[82%] text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ¿QUÉ QUIERES HACER? ═══════════════════════════════ */}
      <section className="border-t border-cec-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="cec-display text-4xl sm:text-5xl">¿Qué plan tienes?</h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {ACTIONS.map((a, i) => {
              const card = (
                <div
                  className={`cec-pop-card group flex h-full min-h-[260px] flex-col rounded-[22px] p-7 ${a.bg}`}
                  style={{ "--tilt": i % 2 === 0 ? "-0.8deg" : "0.8deg" } as React.CSSProperties}
                >
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
                <Reveal
                  key={a.title}
                  delay={i * 120}
                  className="cec-reveal-tilt h-full"
                  style={{ "--enter-tilt": i % 2 === 0 ? "-2deg" : "2deg" } as React.CSSProperties}
                >
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

      {/* ═══ VISÍTANOS ═════════════════════════════════════════
          Arriba: horarios (negro) + dirección (blanco), con alturas
          parecidas. Abajo: el mapa a lo ancho de toda la tarjeta.
          Antes el mapa vivía en la columna derecha y estiraba el
          bloque negro, dejando un hueco vacío. */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="cec-pop-box overflow-hidden rounded-[28px]">
          <div className="grid md:grid-cols-2">
            {/* Horarios */}
            <div className="bg-cec-ink p-8 text-white sm:p-10">
              <Eyebrow className="text-white/60">Cuándo venir</Eyebrow>
              <ul className="mt-6">
                {SCHEDULE.map((s) => (
                  <li
                    key={s.day}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/15 py-3.5 last:border-0"
                  >
                    <span className="text-sm text-white/65">{s.day}</span>
                    {/* tabular-nums: todos los números ocupan el mismo ancho → las horas quedan alineadas */}
                    <span className="ml-auto text-base font-medium tabular-nums">{s.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dónde estamos */}
            <div className="flex flex-col p-8 sm:p-10">
              <Eyebrow>Dónde estamos</Eyebrow>
              <p className="cec-display mt-6 text-3xl sm:text-4xl">{ADDRESS.line1}</p>
              <p className="mt-2 text-cec-ink-soft">{ADDRESS.line2}</p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                <SocialLinks instagramUrl={INSTAGRAM_URL} whatsappUrl={WHATSAPP_URL} />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium"
                >
                  <span className="cec-link">Cómo llegar</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Mapa a lo ancho. En gris para respetar la estética; recupera el
              color al pasar el mouse. loading="lazy" = no se carga hasta que
              el usuario baja hasta aquí (web más rápida). */}
          <iframe
            src={MAPS_EMBED_URL}
            title="Mapa: Como en Casa, Carrera 49 # 54-47, Bello"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-72 w-full border-t-[1.5px] border-cec-ink grayscale transition-[filter] duration-500 hover:grayscale-0 sm:h-80"
          />
        </Reveal>
      </section>
    </>
  );
}
