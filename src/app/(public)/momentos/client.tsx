"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ImagePlus, Minus, Plus, X } from "lucide-react";

import { Eyebrow, LogoMark } from "@/components/public/decor";
import { Reveal } from "@/components/public/reveal";
import { cn } from "@/lib/utils";
import { getTodayColombiaDate, parseDateOnly } from "@/lib/mock-data";
import { OPENING_HOURS, RESERVATIONS_WHATSAPP as RESERVATIONS_NUMBER } from "@/lib/public-info";
import type { CelebrationPackage, PackageVariant } from "@/lib/supabase/packages";
import {
  createReservation,
  getPublicPhotoUrl,
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

// Colores rápidos: un toque y listo (el cliente igual puede escribir otro).
const QUICK_COLORS = ["Rosado", "Azul", "Rojo", "Lila", "Dorado", "Blanco"];

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_CARD_MESSAGE = 200;

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
  "h-11 w-full rounded-2xl border-[1.5px] border-cec-ink/20 bg-white px-3.5 text-base text-cec-ink outline-none transition-colors focus:border-cec-ink/60";

// Clase compartida para los textarea (antes estaba repetida inline).
const textareaClass =
  "w-full resize-none rounded-2xl border-[1.5px] border-cec-ink/20 bg-white px-3.5 py-2.5 text-base text-cec-ink outline-none transition-colors focus:border-cec-ink/60";

// Paleta que rota entre tarjetas de momentos (son las que venden → llevan color).
const ACCENTS = ["bg-cec-blush", "bg-cec-sky", "bg-cec-sage", "bg-cec-lilac"];

// ─── WhatsApp ─────────────────────────────────────────────────
// Antes: process.env.NEXT_PUBLIC_LINA_WHATSAPP_NUMBER ?? "TODO_AGREGAR_NUMERO".
// Esa variable no existe en .env.local, así que el botón abría wa.me/TODO_…
// (un chat roto) justo en el paso que cierra la venta. Ahora usa el WhatsApp
// oficial del negocio, y la variable queda solo como override opcional.
const RESERVATIONS_WHATSAPP =
  process.env.NEXT_PUBLIC_LINA_WHATSAPP_NUMBER || RESERVATIONS_NUMBER;

/** "2026-11-15" → "sábado 15/11/2026" (sin depender de la zona del dispositivo). */
function fmtDateLong(iso: string): string {
  const weekday = new Intl.DateTimeFormat("es-CO", { weekday: "long", timeZone: "UTC" }).format(parseDateOnly(iso));
  const [y, m, d] = iso.split("-");
  return `${weekday} ${d}/${m}/${y}`;
}

/** "16:30" → "4:30 p. m." */
function fmtTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "p. m." : "a. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Horas disponibles para una fecha: cada 30 min desde que abrimos hasta
 * 1 hora antes de cerrar (para que el momento alcance a disfrutarse).
 */
function getTimeSlots(dateIso: string): string[] {
  if (!dateIso) return [];
  const hours = OPENING_HOURS[parseDateOnly(dateIso).getUTCDay()];
  if (!hours) return [];
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const slots: string[] = [];
  for (let t = toMin(hours.open); t <= toMin(hours.close) - 60; t += 30) {
    slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** Deja solo dígitos y quita el 57 inicial: "+57 300 123 4567" → "3001234567". */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("57") ? digits.slice(2) : digits;
}

/** Código corto y legible para la reserva: primeros 6 caracteres del UUID. */
function reservationCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

// Mensaje que el cliente envía. Lleva TODO lo que el equipo necesita, así
// no hay que preguntar nada por chat: solo confirmar disponibilidad y pago.
function buildWhatsAppUrl(
  pkg: CelebrationPackage,
  variant: PackageVariant,
  form: FormState,
  code: string,
  photoUrl: string | null
): string {
  const lines = [
    "¡Hola, Como en Casa! 🎉 Acabo de hacer una reserva en la web.",
    "",
    `*Reserva #${code}*`,
    `*Momento:* ${pkg.name}`,
    `*Opción:* ${variant.label} · ${variant.priceLabel}`,
    `*Fecha:* ${fmtDateLong(form.eventDate)}`,
    `*Hora:* ${fmtTime12(form.eventTime)}`,
    `*Personas:* ${form.guestCount}`,
    `*A nombre de:* ${form.clientName}`,
  ];
  if (form.occasion || form.honoreeName) {
    lines.push(`*Celebramos:* ${[form.occasion, form.honoreeName && `de ${form.honoreeName}`].filter(Boolean).join(" ")}`);
  }
  if (form.decorationColor) lines.push(`*Color:* ${form.decorationColor}`);
  if (form.cardMessage) lines.push(`*Mensaje para la tarjeta:* "${form.cardMessage}"`);
  // wa.me no deja adjuntar archivos: mandamos el link a la foto para que
  // Lina la abra desde el chat sin entrar al admin.
  if (photoUrl) lines.push(`*Foto para la tarjeta:* ${photoUrl}`);
  if (form.observations) lines.push(`*Notas:* ${form.observations}`);
  lines.push("", "¿Me confirman disponibilidad y cómo hago el pago? 🙌");
  return `https://wa.me/${RESERVATIONS_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
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
    // 4/5 (vertical): casi todas las fotos de los momentos son verticales;
    // con 4/3 se recortaban arriba y abajo y se perdían globos o torta.
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/60">
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
          className="cec-photo cec-photo-in h-full w-full object-cover"
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
// Rediseño: todo visible de una (sin "Ver detalles"). Orden pensado para
// vender: qué es → fotos → qué incluye → elegir opción → botón "Reservar".
// Las opciones ahora se SELECCIONAN (como radio buttons) y hay un único botón
// de acción claro, en vez de que cada opción fuera un botón que abría la reserva.

// Agrupa variantes con formato "Sabor · Tamaño" por tamaño.
// Ej: "Chocolate · 10 a 15 porciones" → grupo "10 a 15 porciones", texto "Chocolate".
// Si ninguna trae " · ", devuelve un solo grupo sin título (comportamiento normal).
function groupVariants(variants: PackageVariant[]) {
  const SEP = " · ";
  if (!variants.some((v) => v.label.includes(SEP))) {
    return [{ title: null as string | null, items: variants.map((v) => ({ variant: v, text: v.label })) }];
  }
  const groups = new Map<string, { variant: PackageVariant; text: string }[]>();
  for (const v of variants) {
    const [text, title = ""] = v.label.split(SEP);
    if (!groups.has(title)) groups.set(title, []);
    groups.get(title)!.push({ variant: v, text });
  }
  return [...groups].map(([title, items]) => ({ title: title as string | null, items }));
}

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
  // Opción elegida dentro de la tarjeta. Por defecto, la primera (la más económica).
  const [selected, setSelected] = useState<PackageVariant | undefined>(pkg.variants[0]);
  const hasOptions = pkg.variants.length > 1;

  return (
    <div
      className={cn("cec-pop-card flex flex-col rounded-[22px] p-6", accent)}
      // Inclinación al hover alternada (izq/der) para que la grilla se sienta viva
      style={{ "--tilt": index % 2 === 0 ? "-0.8deg" : "0.8deg" } as React.CSSProperties}
    >
      {/* 1. Nombre + descripción */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="cec-display text-[1.85rem] leading-tight">{pkg.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cec-ink/75">{pkg.description}</p>
        </div>
        <span className="shrink-0 pt-2 text-xs font-medium tracking-[0.2em] text-cec-ink/45">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* 2. Fotos */}
      {pkg.images.length > 0 && (
        <div className="mt-4">
          <PhotoCarousel images={pkg.images} />
        </div>
      )}

      {/* 3. Qué incluye — siempre visible */}
      {pkg.includes.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
            Incluye
          </p>
          <ul className="cec-stagger mt-2 space-y-1.5">
            {pkg.includes.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-snug text-cec-ink"
                style={{ "--i": i } as React.CSSProperties}
              >
                <Check className="cec-check mt-0.5 size-3.5 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-5">
        {/* 4. Opciones: siempre visibles (con una sola opción también, así el
            precio vive aquí y el botón solo dice "Reservar") */}
        {pkg.variants.length > 0 && (
          <fieldset>
            <legend className="text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
              {hasOptions ? "Elige tu opción" : "Tu opción"}
            </legend>
            {/* Si las opciones vienen como "Sabor · Tamaño", se agrupan por tamaño
                para que una lista larga (ej. 10 tortas) sea fácil de leer. */}
            <div className="mt-2 space-y-3" role="radiogroup">
              {groupVariants(pkg.variants).map((group) => (
                <div key={group.title ?? "all"}>
                  {group.title && (
                    <p className="mb-1.5 text-xs font-medium text-cec-ink/70">{group.title}</p>
                  )}
                  <div className="space-y-1.5">
                    {group.items.map(({ variant: v, text }) => {
                      const isActive = selected?.label === v.label;
                      return (
                        <button
                          key={v.label}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => setSelected(v)}
                          className={cn(
                            "cec-pop-option flex w-full items-center justify-between gap-3 rounded-xl border-[1.5px] px-3.5 py-2 text-left text-sm",
                            isActive
                              ? "border-cec-ink bg-white text-cec-ink"
                              : "border-cec-ink/20 bg-white/50 text-cec-ink/80 hover:border-cec-ink/50 hover:bg-white/80"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            {/* círculo tipo radio */}
                            <span
                              className={cn(
                                "grid size-4 shrink-0 place-items-center rounded-full border",
                                isActive ? "border-cec-ink" : "border-cec-ink/30"
                              )}
                            >
                              {isActive && <span className="cec-dot size-2 rounded-full bg-cec-ink" />}
                            </span>
                            <span className={isActive ? "font-medium" : ""}>{text}</span>
                          </span>
                          <span className="shrink-0 font-medium">{v.priceLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* 5. Botón principal — estilo pop (borde + sombra sólida). Sin precio:
            ya se ve arriba en la opción seleccionada. */}
        {selected && (
          <button
            type="button"
            onClick={() => onReserve(pkg, selected)}
            className="cec-pop-btn mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f1ec] px-6 py-3 text-cec-ink hover:bg-white"
          >
            <span className="text-lg font-bold tracking-wide">Reservar</span>
            <ChevronRight className="cec-nudge size-5" strokeWidth={2.5} aria-hidden />
          </button>
        )}

        {/* 6. Condiciones — pequeñas, siempre visibles */}
        {pkg.conditions.length > 0 && (
          <p className="mt-3 text-center text-[11px] leading-relaxed text-cec-ink/55">
            {pkg.conditions.join(" · ")}
          </p>
        )}
      </div>
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
  // Código corto que viaja en el mensaje de WhatsApp para ubicar la reserva en el admin
  const [code, setCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Vista previa de la foto. createObjectURL crea una URL temporal en memoria;
  // useMemo evita crear una nueva en cada render y el efecto la libera
  // (revokeObjectURL) cuando cambia la foto o se cierra el formulario.
  const photoPreview = useMemo(
    () => (form.cardPhotoFile ? URL.createObjectURL(form.cardPhotoFile) : null),
    [form.cardPhotoFile]
  );
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openSheet(pkg: CelebrationPackage, variant: PackageVariant) {
    setSelectedPkg(pkg);
    setSelectedVariant(variant);
    setForm(EMPTY_FORM);
    setPhotoUrl(null);
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

    // Validaciones que el navegador no hace solo
    const phone = normalizePhone(form.clientWhatsapp);
    if (!/^3\d{9}$/.test(phone)) {
      setError("Revisa tu WhatsApp: debe ser un celular de 10 dígitos que empiece por 3.");
      return;
    }
    if (!form.eventTime) {
      setError("Elige la hora de tu momento.");
      return;
    }

    setLoading(true);

    if (form.cardPhotoFile && form.cardPhotoFile.size > MAX_FILE_BYTES) {
      setError("La foto pesa más de 10 MB. Prueba con una más liviana.");
      setLoading(false);
      return;
    }

    let cardPhotoPath: string | undefined;

    if (form.cardPhotoFile) {
      const path = await uploadReservationFile("reservation-photos", form.cardPhotoFile);
      if (!path) {
        setError("No pudimos subir la foto. Intenta otra vez.");
        setLoading(false);
        return;
      }
      cardPhotoPath = path;
      setPhotoUrl(getPublicPhotoUrl(path));
    }

    // Generamos el id aquí para poder mostrar el código sin leer la BD
    const id = crypto.randomUUID();

    const ok = await createReservation({
      id,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      selectedVariantLabel: selectedVariant.label,
      selectedVariantPrice: selectedVariant.priceLabel,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      guestCount: Number(form.guestCount),
      clientName: form.clientName,
      clientWhatsapp: phone,
      honoreeName: form.honoreeName || undefined,
      occasion: form.occasion || undefined,
      cardMessage: form.cardMessage || undefined,
      decorationColor: form.decorationColor || undefined,
      cardPhotoPath,
      observations: form.observations || undefined,
    });

    setLoading(false);

    if (!ok) {
      setError("Algo falló al enviar tu solicitud. Intenta otra vez.");
      return;
    }

    setCode(reservationCode(id));
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
            Tú pones el motivo; nosotros, la mesa, la torta y los globos.
          </p>
        </div>

        {/* Masonry con CSS columns: cada tarjeta mide lo que necesita su contenido
            (sin huecos en blanco). `break-inside-avoid` evita que una tarjeta se
            parta entre dos columnas; `mb-5` reemplaza el gap vertical del grid. */}
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {packages.map((pkg, i) => (
            <Reveal
              key={pkg.id}
              delay={(i % 3) * 120}
              // mb-6 deja lugar para la sombra sólida de 6px
              className="cec-reveal-tilt mb-7 break-inside-avoid"
              style={{ "--enter-tilt": i % 2 === 0 ? "-2deg" : "2deg" } as React.CSSProperties}
            >
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
              "cec cec-pop-box fixed z-50 overflow-y-auto bg-white",
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

            {/* ═══ Éxito: el último paso es WhatsApp ═══ */}
            {success ? (
              <div className="cec-pop-box mt-6 rounded-[22px] bg-cec-sage px-5 py-7 text-center">
                <LogoMark className="mx-auto h-12 text-cec-ink" />
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.24em] text-cec-ink/60">
                  Reserva #{code}
                </p>
                <h2 className="cec-display mt-2 text-3xl">¡Listo, {form.clientName.split(" ")[0]}!</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm text-cec-ink/80">
                  Falta un último paso: envíanos el mensaje por WhatsApp. Ya va con todos tus datos, solo dale <b>enviar</b>.
                </p>
                <a
                  href={buildWhatsAppUrl(selectedPkg!, selectedVariant!, form, code, photoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cec-pop-btn mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#f4f1ec] px-4 text-lg font-bold text-cec-ink hover:bg-white"
                >
                  Enviar por WhatsApp
                  <ChevronRight className="cec-nudge size-5" strokeWidth={2.5} aria-hidden />
                </a>
                <p className="mt-4 text-xs text-cec-ink/60">
                  Ahí te confirmamos disponibilidad y te pasamos los datos de pago.
                </p>
                <button
                  type="button"
                  onClick={closeSheet}
                  className="mt-4 text-xs font-medium text-cec-ink/70 underline underline-offset-4 hover:text-cec-ink"
                >
                  Volver a los momentos
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                {/* Cómo funciona: da confianza y deja claro que no se paga aquí */}
                <ol className="grid grid-cols-3 gap-2 text-center text-[11px] leading-snug text-cec-ink/75">
                  {["Llenas esto (2 min)", "Nos escribes por WhatsApp", "Confirmamos y pagas"].map((t, i) => (
                    <li key={t} className="rounded-2xl bg-cec-ink/[0.04] px-2 py-2.5">
                      <span className="mx-auto mb-1 grid size-5 place-items-center rounded-full bg-cec-ink text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>

                {/* ── 1. Cuándo ── */}
                <fieldset className="space-y-3">
                  <legend className="cec-display text-xl">¿Cuándo?</legend>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="event-date">Fecha</FieldLabel>
                    <input
                      id="event-date"
                      type="date"
                      required
                      min={getTodayColombiaDate()}
                      value={form.eventDate}
                      // Al cambiar la fecha se borra la hora: el horario cambia según el día
                      onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value, eventTime: "" }))}
                      className={inputClass}
                    />
                  </div>

                  {/* Hora: solo horas en que estamos abiertos ese día */}
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="event-time">Hora</FieldLabel>
                    {form.eventDate ? (
                      <div id="event-time" className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Hora">
                        {getTimeSlots(form.eventDate).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            role="radio"
                            aria-checked={form.eventTime === slot}
                            onClick={() => setField("eventTime", slot)}
                            className={cn(
                              "cec-pop-option rounded-full border-[1.5px] px-3 py-1.5 text-sm",
                              form.eventTime === slot
                                ? "border-cec-ink bg-white font-semibold"
                                : "border-cec-ink/20 bg-white/50 text-cec-ink/80 hover:border-cec-ink/50"
                            )}
                          >
                            {fmtTime12(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-cec-ink/50">Primero elige la fecha y te mostramos las horas disponibles.</p>
                    )}
                  </div>

                  {/* Personas: contador −/+ (más fácil que escribir en el celular) */}
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="guest-count">¿Cuántas personas van?</FieldLabel>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Una persona menos"
                        onClick={() => setField("guestCount", String(Math.max(1, Number(form.guestCount) - 1)))}
                        className="cec-pop-option grid size-9 place-items-center rounded-full border-[1.5px] border-cec-ink bg-white"
                      >
                        <Minus className="size-4" />
                      </button>
                      <input
                        id="guest-count"
                        type="number"
                        inputMode="numeric"
                        required
                        min="1"
                        max="50"
                        value={form.guestCount}
                        onChange={(e) => setField("guestCount", e.target.value)}
                        className="h-9 w-12 rounded-xl border-[1.5px] border-cec-ink/20 bg-white text-center text-base font-semibold outline-none [appearance:textfield] focus:border-cec-ink/60 [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        aria-label="Una persona más"
                        onClick={() => setField("guestCount", String(Math.min(50, Number(form.guestCount) + 1)))}
                        className="cec-pop-option grid size-9 place-items-center rounded-full border-[1.5px] border-cec-ink bg-white"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </fieldset>

                {/* ── 2. Quién reserva ── */}
                <fieldset className="space-y-3">
                  <legend className="cec-display text-xl">¿Quién reserva?</legend>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="client-name">Tu nombre</FieldLabel>
                    <input
                      id="client-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.clientName}
                      onChange={(e) => setField("clientName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="client-whatsapp">Tu WhatsApp</FieldLabel>
                    <input
                      id="client-whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                      placeholder="300 123 4567"
                      value={form.clientWhatsapp}
                      onChange={(e) => setField("clientWhatsapp", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </fieldset>

                {/* ── 3. Detalles: opcionales, pero evitan el ida y vuelta por chat ── */}
                <fieldset className="space-y-3">
                  <legend className="cec-display text-xl">Los detalles</legend>
                  <p className="-mt-1 text-xs text-cec-ink/60">
                    Opcional, pero si los llenas tenemos todo listo sin preguntarte nada más.
                  </p>

                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="occasion">¿Qué celebran?</FieldLabel>
                    <div id="occasion" className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Ocasión">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          role="radio"
                          aria-checked={form.occasion === o}
                          // Tocar de nuevo la misma ocasión la deselecciona
                          onClick={() => setField("occasion", form.occasion === o ? "" : o)}
                          className={cn(
                            "cec-pop-option rounded-full border-[1.5px] px-3 py-1.5 text-sm",
                            form.occasion === o
                              ? "border-cec-ink bg-white font-semibold"
                              : "border-cec-ink/20 bg-white/50 text-cec-ink/80 hover:border-cec-ink/50"
                          )}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="honoree-name">¿A quién celebramos?</FieldLabel>
                    <input
                      id="honoree-name"
                      type="text"
                      placeholder="Nombre de la persona"
                      value={form.honoreeName}
                      onChange={(e) => setField("honoreeName", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="decoration-color">Color de la decoración</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={form.decorationColor === c}
                          onClick={() => setField("decorationColor", form.decorationColor === c ? "" : c)}
                          className={cn(
                            "cec-pop-option rounded-full border-[1.5px] px-3 py-1.5 text-sm",
                            form.decorationColor === c
                              ? "border-cec-ink bg-white font-semibold"
                              : "border-cec-ink/20 bg-white/50 text-cec-ink/80 hover:border-cec-ink/50"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input
                      id="decoration-color"
                      type="text"
                      placeholder="¿Otro? Escríbelo aquí"
                      value={QUICK_COLORS.includes(form.decorationColor) ? "" : form.decorationColor}
                      onChange={(e) => setField("decorationColor", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <FieldLabel htmlFor="card-message">Mensaje para la tarjeta</FieldLabel>
                      <span className="text-[11px] text-cec-ink/45">
                        {form.cardMessage.length}/{MAX_CARD_MESSAGE}
                      </span>
                    </div>
                    <textarea
                      id="card-message"
                      rows={3}
                      maxLength={MAX_CARD_MESSAGE}
                      placeholder="Ej: ¡Feliz cumple, mamá! Te amamos."
                      value={form.cardMessage}
                      onChange={(e) => setField("cardMessage", e.target.value)}
                      className={textareaClass}
                    />
                  </div>

                  {/* Foto: botón grande + vista previa, en vez del input de archivo nativo */}
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="card-photo">Foto para la tarjeta</FieldLabel>
                    <label
                      htmlFor="card-photo"
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-cec-ink/30 bg-white/60 p-3 transition-colors hover:border-cec-ink/60"
                    >
                      {photoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoPreview}
                          alt="Vista previa de la foto"
                          className="size-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-cec-ink/[0.06]">
                          <ImagePlus className="size-6 text-cec-ink/60" />
                        </span>
                      )}
                      <span className="text-sm">
                        <span className="block font-semibold">
                          {form.cardPhotoFile ? "Cambiar foto" : "Subir una foto"}
                        </span>
                        <span className="block text-xs text-cec-ink/55">
                          {form.cardPhotoFile ? form.cardPhotoFile.name : "Sale impresa en la tarjeta"}
                        </span>
                      </span>
                    </label>
                    <input
                      id="card-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      onChange={(e) => setField("cardPhotoFile", e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="observations">¿Algo más?</FieldLabel>
                    <textarea
                      id="observations"
                      rows={2}
                      placeholder="Ej: es sorpresa, llegamos 10 min antes, sabor de la torta…"
                      value={form.observations}
                      onChange={(e) => setField("observations", e.target.value)}
                      className={textareaClass}
                    />
                  </div>
                </fieldset>

                {error && (
                  <p role="alert" className="rounded-2xl bg-cec-blush px-4 py-3 text-sm font-medium text-cec-ink">
                    {error}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cec-pop-btn flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#f4f1ec] text-lg font-bold text-cec-ink hover:bg-white disabled:opacity-50"
                  >
                    {loading ? "Guardando…" : "Continuar a WhatsApp"}
                    {!loading && <ChevronRight className="cec-nudge size-5" strokeWidth={2.5} aria-hidden />}
                  </button>
                  <p className="mt-3 text-center text-xs text-cec-ink/55">
                    No pagas nada todavía. Primero te confirmamos disponibilidad.
                  </p>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
