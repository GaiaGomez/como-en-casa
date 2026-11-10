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

// ─── Íconos de contacto ───────────────────────────────────────
// SVG propios porque lucide ya no incluye logos de marcas.

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={cn("size-5", className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-5", className)}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.9 9.9 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

/** Botones redondos de Instagram y WhatsApp. En el celular abren directo las apps. */
export function SocialLinks({
  instagramUrl,
  whatsappUrl,
  className,
  tone = "dark",
}: {
  instagramUrl: string;
  whatsappUrl: string;
  className?: string;
  /** dark = íconos negros (fondo claro) · light = íconos blancos (fondo negro) */
  tone?: "dark" | "light";
}) {
  const base =
    tone === "dark"
      ? "border-cec-ink/15 text-cec-ink hover:bg-cec-ink hover:text-white"
      : "border-white/25 text-white hover:bg-white hover:text-cec-ink";
  const btn = cn("grid size-11 place-items-center rounded-full border transition-colors", base);
  return (
    <div className={cn("flex gap-3", className)}>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Como en Casa" className={btn}>
        <InstagramIcon />
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Como en Casa" className={btn}>
        <WhatsAppIcon />
      </a>
    </div>
  );
}
