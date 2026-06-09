"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

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
      className="block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
    >
      {children}
      {optional && (
        <span className="ml-1 normal-case tracking-normal font-normal text-neutral-300">
          (opcional)
        </span>
      )}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base text-neutral-900 outline-none focus:border-black/40";

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

// ─── Package card ─────────────────────────────────────────────

function PackageCard({
  pkg,
  onReserve,
}: {
  pkg: CelebrationPackage;
  onReserve: (pkg: CelebrationPackage, variant: PackageVariant) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = pkg.includes.length > 0 || pkg.conditions.length > 0;
  const showPortionHelper = pkg.variants.some((v) =>
    v.label.toLowerCase().includes("porciones")
  );

  return (
    <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:min-h-[300px]">
      {/* 1–2. Header block */}
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="text-lg font-semibold text-neutral-900">{pkg.name}</h2>
        <p className="mt-1.5 text-sm text-neutral-500">{pkg.description}</p>
      </div>

      {/* 3–4. Options */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Opciones disponibles
        </p>
        <div className="mt-2 space-y-2">
          {pkg.variants.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => onReserve(pkg, v)}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white transition-colors hover:bg-neutral-800 active:bg-neutral-900"
            >
              <span className="font-medium">{v.label}</span>
              <span className="shrink-0 text-white/80">{v.priceLabel}</span>
            </button>
          ))}
        </div>

        {/* 5. Helper text — only for packages with porciones */}
        {showPortionHelper && (
          <p className="mt-2 text-xs text-neutral-400">
            Las porciones corresponden al tamaño de la torta.
          </p>
        )}
      </div>

      {/* 6. Ver detalles toggle */}
      {hasDetails && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-700"
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
            <div className="mt-3 space-y-3">
              {pkg.includes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Incluye
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-neutral-700"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] text-neutral-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.conditions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Condiciones
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {pkg.conditions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-neutral-500"
                      >
                        <span className="mt-0.5 shrink-0 text-[10px] text-neutral-400">•</span>
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
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-neutral-900">Momentos</h1>
        <p className="mt-3 text-lg text-neutral-600">
          Experiencias diseñadas para celebrar.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onReserve={openSheet} />
          ))}
        </div>
      </section>

      {/* Reservation sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={closeSheet}
            aria-hidden="true"
          />

          {/* Sheet: bottom on mobile, centered on desktop */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Reservar ${selectedPkg!.name}`}
            className={[
              "fixed z-50 overflow-y-auto bg-white",
              "inset-x-0 bottom-0 max-h-[92svh] rounded-t-[24px] px-5 pt-4",
              "pb-[calc(env(safe-area-inset-bottom)+20px)]",
              "sm:inset-x-auto sm:left-1/2 sm:right-auto sm:bottom-auto sm:top-1/2",
              "sm:-translate-x-1/2 sm:-translate-y-1/2",
              "sm:w-full sm:max-w-lg sm:rounded-[20px] sm:px-6 sm:pt-6 sm:pb-6",
              "sm:max-h-[88svh]",
              "animate-in slide-in-from-bottom-4 duration-200 sm:zoom-in-95",
            ].join(" ")}
          >
            {/* Drag handle — mobile only */}
            <div className="mb-4 flex justify-center sm:hidden">
              <span className="h-1 w-10 rounded-full bg-black/15" />
            </div>

            {/* Sheet header: locked package + variant + close */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Momento elegido
                </p>
                <p className="mt-0.5 text-base font-semibold text-neutral-900">
                  {selectedPkg!.name}
                </p>
                {selectedVariant && (
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {selectedVariant.label} · {selectedVariant.priceLabel}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Cerrar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 text-neutral-500 hover:border-black/30 hover:text-neutral-900"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Success */}
            {success ? (
              <div className="mt-6 rounded-[16px] bg-neutral-50 px-5 py-8 text-center">
                <p className="text-2xl">🎉</p>
                <h2 className="mt-3 text-base font-semibold text-neutral-900">
                  ¡Solicitud recibida!
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Recibimos tu solicitud. Continúa por WhatsApp para coordinar
                  el pago y confirmar disponibilidad con Lina.
                </p>
                <a
                  href={buildWhatsAppUrl(selectedPkg!, selectedVariant!, form)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-10 w-full items-center justify-center rounded-[10px] bg-neutral-950 px-4 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Continuar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={closeSheet}
                  className="mt-3 inline-flex h-9 items-center rounded-[10px] border border-black/15 px-4 text-sm font-medium text-neutral-700 hover:border-black/30"
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
                    className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-black/40 resize-none"
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
                    className="block w-full text-sm text-neutral-600 file:mr-3 file:h-8 file:cursor-pointer file:rounded-[8px] file:border-0 file:bg-black file:px-3 file:text-sm file:font-medium file:text-white"
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
                    className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-black/40 resize-none"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 w-full items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white disabled:opacity-50"
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
