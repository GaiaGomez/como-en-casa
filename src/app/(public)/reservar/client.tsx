"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import type { CelebrationPackage } from "@/lib/supabase/packages";
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

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

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
      className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400"
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

function TextInput({
  id,
  name,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base text-neutral-900 outline-none focus:border-black/40"
    />
  );
}

export function ReservarClient({
  packages,
}: {
  packages: CelebrationPackage[];
}) {
  const searchParams = useSearchParams();
  const momentoSlug = searchParams.get("momento") ?? "";

  const defaultPkg =
    packages.find((p) => p.slug === momentoSlug) ?? packages[0] ?? null;

  const [selectedPkgId, setSelectedPkgId] = useState(defaultPkg?.id ?? "");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [clientName, setClientName] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [honoreeName, setHonoreeName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [decorationColor, setDecorationColor] = useState("");
  const [cardPhotoFile, setCardPhotoFile] = useState<File | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [observations, setObservations] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validateFile(file: File, label: string): string | null {
    if (file.size > MAX_FILE_BYTES)
      return `${label} no puede superar 10 MB.`;
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const selectedPkg = packages.find((p) => p.id === selectedPkgId);
    if (!selectedPkg) {
      setError("Selecciona un momento.");
      setLoading(false);
      return;
    }

    if (cardPhotoFile) {
      const err = validateFile(cardPhotoFile, "La foto para tarjeta");
      if (err) { setError(err); setLoading(false); return; }
    }
    if (paymentProofFile) {
      const err = validateFile(paymentProofFile, "El comprobante de pago");
      if (err) { setError(err); setLoading(false); return; }
    }

    let cardPhotoPath: string | undefined;
    let paymentProofPath: string | undefined;

    if (cardPhotoFile) {
      const path = await uploadReservationFile("reservation-photos", cardPhotoFile);
      if (!path) {
        setError("No se pudo subir la foto para tarjeta. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      cardPhotoPath = path;
    }

    if (paymentProofFile) {
      const path = await uploadReservationFile("payment-proofs", paymentProofFile);
      if (!path) {
        setError("No se pudo subir el comprobante de pago. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      paymentProofPath = path;
    }

    const ok = await createReservation({
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      eventDate,
      eventTime,
      guestCount: Number(guestCount),
      clientName,
      clientWhatsapp,
      honoreeName: honoreeName || undefined,
      occasion: occasion || undefined,
      cardMessage: cardMessage || undefined,
      decorationColor: decorationColor || undefined,
      cardPhotoPath,
      paymentProofPath,
      observations: observations || undefined,
    });

    if (!ok) {
      setError("No se pudo registrar tu solicitud. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <div className="rounded-[20px] border border-black/10 bg-white p-8 text-center">
          <p className="text-2xl">🎉</p>
          <h2 className="mt-3 text-lg font-semibold text-neutral-900">
            ¡Solicitud recibida!
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Recibimos tu solicitud. Lina revisará la información y confirmará
            tu momento por WhatsApp.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Reservar momento</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Completa el formulario y nos pondremos en contacto contigo para confirmar.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Momento elegido */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="package">Momento elegido</FieldLabel>
          <select
            id="package"
            required
            value={selectedPkgId}
            onChange={(e) => setSelectedPkgId(e.target.value)}
            className="h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base text-neutral-900 outline-none focus:border-black/40"
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="event-date">Fecha del momento</FieldLabel>
            <TextInput
              id="event-date"
              name="event_date"
              type="date"
              required
              value={eventDate}
              onChange={setEventDate}
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="event-time">Hora del momento</FieldLabel>
            <TextInput
              id="event-time"
              name="event_time"
              type="time"
              required
              value={eventTime}
              onChange={setEventTime}
            />
          </div>
        </div>

        {/* Personas */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="guest-count">Personas que asistirán</FieldLabel>
          <TextInput
            id="guest-count"
            name="guest_count"
            type="number"
            required
            value={guestCount}
            onChange={setGuestCount}
            min="1"
            max="50"
          />
        </div>

        {/* Nombre + WhatsApp */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="client-name">Nombre de quien reserva</FieldLabel>
          <TextInput
            id="client-name"
            name="client_name"
            required
            value={clientName}
            onChange={setClientName}
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="client-whatsapp">WhatsApp</FieldLabel>
          <TextInput
            id="client-whatsapp"
            name="client_whatsapp"
            type="tel"
            required
            placeholder="3001234567"
            value={clientWhatsapp}
            onChange={setClientWhatsapp}
          />
        </div>

        {/* Homenajeado */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="honoree-name" optional>
            Nombre del homenajeado
          </FieldLabel>
          <TextInput
            id="honoree-name"
            name="honoree_name"
            value={honoreeName}
            onChange={setHonoreeName}
          />
        </div>

        {/* Ocasión */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="occasion" optional>Ocasión</FieldLabel>
          <select
            id="occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base text-neutral-900 outline-none focus:border-black/40"
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
          <FieldLabel htmlFor="card-message" optional>
            Mensaje para tarjeta
          </FieldLabel>
          <textarea
            id="card-message"
            value={cardMessage}
            onChange={(e) => setCardMessage(e.target.value)}
            rows={3}
            className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-black/40 resize-none"
          />
        </div>

        {/* Color decoración */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="decoration-color" optional>
            Color de decoración
          </FieldLabel>
          <TextInput
            id="decoration-color"
            name="decoration_color"
            placeholder="Ej: rosado, dorado, azul…"
            value={decorationColor}
            onChange={setDecorationColor}
          />
        </div>

        {/* Foto para tarjeta */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="card-photo" optional>
            Foto para tarjeta
          </FieldLabel>
          <input
            id="card-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={(e) => setCardPhotoFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-neutral-600 file:mr-3 file:h-8 file:cursor-pointer file:rounded-[8px] file:border-0 file:bg-black file:px-3 file:text-sm file:font-medium file:text-white"
          />
        </div>

        {/* Comprobante de pago */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="payment-proof" optional>
            Comprobante de pago
          </FieldLabel>
          <input
            id="payment-proof"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => setPaymentProofFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-neutral-600 file:mr-3 file:h-8 file:cursor-pointer file:rounded-[8px] file:border-0 file:bg-black file:px-3 file:text-sm file:font-medium file:text-white"
          />
        </div>

        {/* Observaciones */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="observations" optional>
            Observaciones
          </FieldLabel>
          <textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={3}
            className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-black/40 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enviando…" : "Reservar momento"}
        </button>
      </form>
    </section>
  );
}
