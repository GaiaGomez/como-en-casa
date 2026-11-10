"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Eyebrow, LogoMark } from "@/components/public/decor";
import { Reveal } from "@/components/public/reveal";
import { cn } from "@/lib/utils";
import type { CelebrationPackage, PackageVariant } from "@/lib/supabase/packages";
import {
  createReservation,
  uploadReservationFile,
} from "@/lib/supabase/reservations-writes";

const OCCASIONS = [
  "Cumpleaños",
  "Aniversario",
  "Graduación",
  "Baby shower",
  "Despedida de soltera",
  "Otra celebración",
];

const MAX_FILE_BYTES = 10 * 1024 * 1024;

type FormState = {
  eventDate: string;
  eventTime: string;
  guestCount: string;
  clientName: string;
  clientWhatsapp: string;
  honoreeName: string;
  occasion: string;
  cardMessage: string;
  decorationColor: string;
  cardPhotoFile: File | null;
  observations: string;
};

const EMPTY_FORM: FormState = {
  eventDate: "",
  eventTime: "",
  guestCount: "1",
  clientName: "",
  clientWhatsapp: "",
  honoreeName: "",
  occasion: "",
  cardMessage: "",
  decorationColor: "",
  cardPhotoFile: null,
  observations: "",
};

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60"
    >
      {children}
      {optional && (
        <span className="ml-1 normal-case tracking-normal font-normal text-cec-ink/40">
          (opcional)
        </span>
      )}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl border border-cec-ink/15 bg-white px-3.5 text-base text-cec-ink outline-none transition-colors focus:border-cec-ink/60";

// Clase compartida para los textarea (antes estaba repetida inline).
const textareaClass =
  "w-full resize-none rounded-2xl border border-cec-ink/15 bg-white px-3.5 py-2.5 text-base text-cec-ink outline-none transition-colors focus:border-cec-ink/60";

// Paleta que rota entre tarjetas de momentos (son las que venden → llevan color).
const ACCENTS = ["bg-cec-blush", "bg-cec-sky", "bg-cec-sage", "bg-cec-lilac"];

// ─── WhatsApp ─────────────────────────────────────────────────

const LINA_WHATSAPP =
  process.env.NEXT_PUBLIC_LINA_WHATSAPP_NUMBER ?? "TODO_AGREGAR_NUMERO";

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function buildWhatsAppUrl(
  pkg: CelebrationPackage,
  variant: PackageVariant,
  form: FormState
): string {
  const lines = [
    "Hola Lina! 👋 Quiero reservar un momento en Como en Casa.",
    "",
    `*Momento:* ${pkg.name}`,
    `*Opción:* ${variant.label} · ${variant.priceLabel}`,
    `*Fecha:* ${fmtDate(form.eventDate)}`,
    `*Hora:* ${form.eventTime.slice(0, 5)}`,
    `*Personas:* ${form.guestCount}`,
    `*Nombre:* ${form.clientName}`,
    `*WhatsApp:* ${form.clientWhatsapp}`,
  ];
  if (form.honoreeName) lines.push(`*Homenajeado/a:* ${form.honoreeName}`);
  if (form.occasion) lines.push(`*Ocasión:* ${form.occasion}`);
  if (form.cardMessage) lines.push(`*Mensaje para tarjeta:* ${form.cardMessage}`);
  if (form.decorationColor) lines.push(`*Color de decoración:* ${form.decorationColor}`);
  if (form.observations) lines.push(`*Observaciones:* ${form.observations}`);
  return `https://wa.me/${LINA_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// ─── Photo carousel ───────────────────────────────────────────

function PhotoCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const imgRef = useRef<HTMLImageElement>(null);

  // Fix: si la imagen falla ANTES de que React hidrate la página,
  // el onError nunca se dispara y se ve el ícono de imagen rota.
  // Al montar revisamos: "complete" + naturalWidth 0 = falló la carga.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setErrors((prev) => new Set(prev).add(idx));
    }
  }, [idx]);

  if (images.length === 0) return null;

  const multi = images.length > 1;

  function markError(i: number) {
    setErrors((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/60">
      {errors.has(idx) ? (
        // Placeholder ilustrado mientras no estén las fotos reales
        <div className="flex h-full items-center justify-center">
          <LogoMark className="h-16 text-cec-ink/15" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          key={images[idx]}
          src={images[idx]}
          alt=""
          className="h-full w-full object-cover animate-in fade-in duration-500"
          onError={() => markError(idx)}
        />
      )}

      {multi && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i === 0 ? images.length - 1 : i - 1))}
            aria-label="Imagen anterior"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-cec-ink shadow-sm transition-transform hover:scale-110"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i === images.length - 1 ? 0 : i + 1))}
            aria-label="Imagen siguiente"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-cec-ink shadow-sm transition-transform hover:scale-110"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="absolute bottom-2 right-2 rounded-full bg-cec-ink px-2.5 py-0.5 text-[11px] font-medium text-white">
            {idx + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}

// ─── Package card ─────────────────────────────────────────────

function PackageCard({
  pkg,
  index,
  onReserve,
}: {
  pkg: CelebrationPackage;
  index: number;
  onReserve: (pkg: CelebrationPackage, variant: PackageVariant) => void;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  const [expanded, setExpanded] = useState(false);
  const hasDetails = pkg.includes.length > 0 || pkg.conditions.length > 0;
  const showPortionHelper = pkg.variants.some((v) =>
    v.label.toLowerCase().includes("porciones")
  );

  return (
    <div className={cn("cec-card flex h-full flex-col rounded-[22px] p-6", accent)}>
      {/* 1–2. Header block */}
      <div className="flex items-start justify-between gap-3 pb-4">
        <div>
          <h2 className="cec-display text-[1.85rem]">{pkg.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cec-ink/75">{pkg.description}</p>
        </div>
        <span className="shrink-0 pt-2 text-xs font-medium tracking-[0.2em] text-cec-ink/45">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* 3. Carousel */}
      {pkg.images.length > 0 && (
        <div className="mt-4">
          <PhotoCarousel images={pkg.images} />
        </div>
      )}

      {/* 4–5. Options */}
      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
          Opciones disponibles
        </p>
        <div className="mt-2 space-y-2">
          {pkg.variants.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => onReserve(pkg, v)}
              className="group flex w-full items-center justify-between gap-3 rounded-full bg-cec-ink py-2 pl-5 pr-2 text-sm text-white transition-colors hover:bg-neutral-700"
            >
              <span className="font-medium">{v.label}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="cec-display text-lg">{v.priceLabel}</span>
                <span className="grid size-8 place-items-center rounded-full bg-white text-cec-ink transition-transform duration-300 group-hover:rotate-90">
                  <ChevronRight className="size-4" />
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* 5. Helper text — only for packages with porciones */}
        {showPortionHelper && (
          <p className="mt-2 text-xs text-cec-ink/60">
            Las porciones corresponden al tamaño de la torta.
          </p>
        )}
      </div>

      {/* 6. Ver detalles toggle */}
      {hasDetails && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 flex w-fit items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-cec-ink/70 hover:text-cec-ink"
        >
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
          {expanded ? "Ocultar detalles" : "Ver detalles"}
        </button>
      )}

      {/* 7. Expandable details — grid-rows for smooth animation */}
      {hasDetails && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-in-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-3 space-y-3 rounded-2xl bg-white/70 p-4">
              {pkg.includes.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
                    Incluye
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-cec-ink"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] text-cec-ink">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.conditions.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
                    Condiciones
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {pkg.conditions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-cec-ink/70"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] text-cec-ink">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────

export function MomentosClient({
  packages,
}: {
  packages: CelebrationPackage[];
}) {
  const [selectedPkg, setSelectedPkg] = useState<CelebrationPackage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PackageVariant | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openSheet(pkg: CelebrationPackage, variant: PackageVariant) {
    setSelectedPkg(pkg);
    setSelectedVariant(variant);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }

  function closeSheet() {
    setSelectedPkg(null);
    setSelectedVariant(null);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPkg || !selectedVariant) return;

    setError(null);
    setLoading(true);

    if (form.cardPhotoFile && form.cardPhotoFile.size > MAX_FILE_BYTES) {
      setError("La foto para tarjeta no puede superar 10 MB.");
      setLoading(false);
      return;
    }

    let cardPhotoPath: string | undefined;

    if (form.cardPhotoFile) {
      const path = await uploadReservationFile("reservation-photos", form.cardPhotoFile);
      if (!path) {
        setError("No se pudo subir la foto para tarjeta. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      cardPhotoPath = path;
    }

    const ok = await createReservation({
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      selectedVariantLabel: selectedVariant.label,
      selectedVariantPrice: selectedVariant.priceLabel,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      guestCount: Number(form.guestCount),
      clientName: form.clientName,
      clientWhatsapp: form.clientWhatsapp,
      honoreeName: form.honoreeName || undefined,
      occasion: form.occasion || undefined,
      cardMessage: form.cardMessage || undefined,
      decorationColor: form.decorationColor || undefined,
      cardPhotoPath,
      observations: form.observations || undefined,
    });

    setLoading(false);

    if (!ok) {
      setError("No se pudo registrar tu solicitud. Intenta de nuevo.");
      return;
    }

    setSuccess(true);
  }

  const sheetOpen = selectedPkg !== null;

  // Prevent background scroll while sheet is open
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  return (
    <>
      {/* Package grid */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-cec-ink/10 pb-14 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <Eyebrow>Celebraciones</Eyebrow>
            <h1 className="cec-display mt-6 text-[clamp(2.8rem,7vw,5.5rem)]">Momentos</h1>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-cec-ink-soft md:justify-self-end">
            Experiencias diseñadas para celebrar.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={(i % 3) * 110}>
              <PackageCard pkg={pkg} index={i} onReserve={openSheet} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reservation sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-cec-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeSheet}
            aria-hidden="true"
          />

          {/* Sheet: bottom on mobile, centered on desktop */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Reservar ${selectedPkg!.name}`}
            className={[
              "cec fixed z-50 overflow-y-auto bg-white shadow-2xl",
              "inset-x-0 bottom-0 max-h-[92svh] rounded-t-[30px] px-5 pt-4",
              "pb-[calc(env(safe-area-inset-bottom)+20px)]",
              "sm:inset-x-auto sm:left-1/2 sm:right-auto sm:bottom-auto sm:top-1/2",
              "sm:-translate-x-1/2 sm:-translate-y-1/2",
              "sm:w-full sm:max-w-lg sm:rounded-[30px] sm:px-7 sm:pt-7 sm:pb-7",
              "sm:max-h-[88svh]",
              "animate-in slide-in-from-bottom-4 duration-200 sm:zoom-in-95",
            ].join(" ")}
          >
            {/* Drag handle — mobile only */}
            <div className="mb-4 flex justify-center sm:hidden">
              <span className="h-1.5 w-12 rounded-full bg-cec-ink/20" />
            </div>

            {/* Sheet header: locked package + variant + close */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink">
                  Momento elegido
                </p>
                <p className="cec-display mt-2 text-3xl">
                  {selectedPkg!.name}
                </p>
                {selectedVariant && (
                  <p className="mt-1 text-sm text-cec-ink-soft">
                    {selectedVariant.label} · {selectedVariant.priceLabel}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Cerrar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cec-ink/20 text-cec-ink transition-transform hover:rotate-90"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Success */}
            {success ? (
              <div className="mt-6 rounded-[22px] bg-cec-blush px-5 py-8 text-center">
                <LogoMark className="mx-auto h-14 text-cec-ink" />
                <h2 className="cec-display mt-4 text-3xl">
                  ¡Solicitud recibida!
                </h2>
                <p className="mt-2 text-sm text-cec-ink/80">
                  Recibimos tu solicitud. Continúa por WhatsApp para coordinar
                  el pago y confirmar disponibilidad con Lina.
                </p>
                <a
                  href={buildWhatsAppUrl(selectedPkg!, selectedVariant!, form)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-cec-ink px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Continuar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={closeSheet}
                  className="mt-3 inline-flex h-10 items-center rounded-full border border-cec-ink/25 px-5 text-sm font-medium text-cec-ink hover:bg-white"
                >
                  Ver más momentos
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Fecha + Hora */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="event-date">Fecha del momento</FieldLabel>
                    <input
                      id="event-date"
                      type="date"
                      required
                      value={form.eventDate}
                      onChange={(e) => setField("eventDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="event-time">Hora del momento</FieldLabel>
                    <input
                      id="event-time"
                      type="time"
                      required
                      value={form.eventTime}
                      onChange={(e) => setField("eventTime", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Personas */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="guest-count">Personas que asistirán</FieldLabel>
                  <input
                    id="guest-count"
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={form.guestCount}
                    onChange={(e) => setField("guestCount", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Nombre */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="client-name">Nombre de quien reserva</FieldLabel>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setField("clientName", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="client-whatsapp">WhatsApp</FieldLabel>
                  <input
                    id="client-whatsapp"
                    type="tel"
                    required
                    placeholder="3001234567"
                    value={form.clientWhatsapp}
                    onChange={(e) => setField("clientWhatsapp", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Homenajeado */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="honoree-name" optional>Nombre del homenajeado</FieldLabel>
                  <input
                    id="honoree-name"
                    type="text"
                    value={form.honoreeName}
                    onChange={(e) => setField("honoreeName", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Ocasión */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="occasion" optional>Ocasión</FieldLabel>
                  <select
                    id="occasion"
                    value={form.occasion}
                    onChange={(e) => setField("occasion", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecciona una ocasión</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="card-message" optional>Mensaje para tarjeta</FieldLabel>
                  <textarea
                    id="card-message"
                    rows={3}
                    value={form.cardMessage}
                    onChange={(e) => setField("cardMessage", e.target.value)}
                    className={textareaClass}
                  />
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="decoration-color" optional>Color de decoración</FieldLabel>
                  <input
                    id="decoration-color"
                    type="text"
                    placeholder="Ej: rosado, dorado, azul…"
                    value={form.decorationColor}
                    onChange={(e) => setField("decorationColor", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Foto */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="card-photo" optional>Foto para tarjeta</FieldLabel>
                  <input
                    id="card-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    onChange={(e) =>
                      setField("cardPhotoFile", e.target.files?.[0] ?? null)
                    }
                    className="block w-full text-sm text-cec-ink-soft file:mr-3 file:h-9 file:cursor-pointer file:rounded-full file:border-0 file:bg-cec-ink file:px-4 file:text-sm file:font-semibold file:text-white"
                  />
                </div>

                {/* Observaciones */}
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="observations" optional>Observaciones</FieldLabel>
                  <textarea
                    id="observations"
                    rows={3}
                    value={form.observations}
                    onChange={(e) => setField("observations", e.target.value)}
                    className={textareaClass}
                  />
                </div>

                {error && <p className="text-sm font-medium text-cec-ink">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-cec-ink text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
                >
                  {loading ? "Enviando…" : "Reservar momento"}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
