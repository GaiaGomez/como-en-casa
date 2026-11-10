/**
 * Piezas de marca de la web pública.
 *
 * Dirección visual: elegante con un toque divertido.
 * - Nada de doodles ni elementos "dibujados": la personalidad viene
 *   del logo a mano y de movimientos sutiles (anillo que gira, reveals).
 * - Todo usa `currentColor`; el logo SOLO va en negro o blanco.
 */

import { cn } from "@/lib/utils";

// ─── Logo (casita) ────────────────────────────────────────────

/**
 * Logo oficial (casita con letras caladas).
 * Regla de marca: SOLO en negro o blanco, sin fondo.
 * Las letras son "caladas": dejan ver lo que haya detrás del logo.
 */
export function LogoMark({ className }: { className?: string }) {
  return <span role="img" aria-label="Como en Casa" className={cn("cec-logo", className)} />;
}

// ─── Logo completo (casita + anillo de texto) ─────────────────

/** Texto oficial del anillo del logo completo. */
const LOGO_RING = "Café de especialidad • Repostería fina • Gastronomía • Celebraciones • ";

/**
 * Logo completo: la casita al centro y el anillo de texto alrededor.
 * Se construye en SVG (no como imagen) para que el anillo pueda girar
 * y para que el texto quede nítido a cualquier tamaño.
 *
 * `spin` hace girar SOLO el anillo; la casita siempre queda derecha.
 */
export function LogoFull({ className, spin = false }: { className?: string; spin?: boolean }) {
  return (
    <div className={cn("relative grid aspect-square place-items-center", className)}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={cn("absolute inset-0 size-full", spin && "cec-spin")}
      >
        <defs>
          {/* Círculo de radio 40 que arranca a la izquierda y va en sentido horario */}
          <path id="cec-logo-ring" d="M10 50a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
        </defs>
        <text
          className="fill-current font-semibold"
          style={{ fontFamily: "var(--font-cec-sans)", fontSize: "6.4px", letterSpacing: "0.2em" }}
        >
          {/* textLength = perímetro (2π·40 ≈ 251): reparte las letras para cerrar el círculo exacto */}
          <textPath href="#cec-logo-ring" textLength="249" lengthAdjust="spacing">
            {LOGO_RING.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <LogoMark className="h-[54%]" />
      <span className="sr-only">Café de especialidad, repostería fina, gastronomía y celebraciones</span>
    </div>
  );
}

// ─── Etiqueta pequeña (eyebrow) ───────────────────────────────

/** Texto pequeño en mayúsculas; ordena las secciones. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.28em] text-cec-ink-soft",
        className
      )}
    >
      {children}
    </p>
  );
}
