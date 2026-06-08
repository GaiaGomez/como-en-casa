"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";

import type { ReservationDetail, ReservationStatus, PaymentStatus } from "@/lib/supabase/reservations";
import { updateReservation } from "@/lib/supabase/reservations-writes";

const RESERVATION_STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "new",       label: "Nueva" },
  { value: "reviewing", label: "En revisión" },
  { value: "confirmed", label: "Confirmada" },
  { value: "preparing", label: "Preparando" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "pending",    label: "Pendiente" },
  { value: "proof_sent", label: "Comprobante enviado" },
  { value: "verified",   label: "Verificado" },
  { value: "rejected",   label: "Rechazado" },
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${Number(d)} de ${months[Number(m) - 1]} de ${y}`;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
      <span className="min-w-[160px] text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </span>
      <span className="text-sm text-neutral-900">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 border-b border-black/8 pb-1.5">
      {children}
    </p>
  );
}

function buildWhatsAppMessage(r: ReservationDetail): string {
  const lines: string[] = [
    `Hola ${r.clientName} 👋`,
    "",
    `Tu momento *${r.packageName}* está confirmado.`,
    "",
    `📅 Fecha: ${formatDate(r.eventDate)}`,
    `⏰ Hora: ${r.eventTime.slice(0, 5)}`,
    `👥 Personas: ${r.guestCount}`,
  ];
  if (r.honoreeName) lines.push(`🎂 Homenajeado/a: ${r.honoreeName}`);
  if (r.occasion) lines.push(`🎉 Ocasión: ${r.occasion}`);
  if (r.assignedZone) lines.push(`📍 Zona: ${r.assignedZone}`);
  lines.push("", "¡Los esperamos con mucho amor! 💛", "— Equipo Como en Casa");
  return lines.join("\n");
}

export function ReservationDetailClient({
  reservation,
  cardPhotoUrl,
  paymentProofUrl,
  canEdit,
}: {
  reservation: ReservationDetail;
  cardPhotoUrl: string | null;
  paymentProofUrl: string | null;
  canEdit: boolean;
}) {
  const [resvStatus, setResvStatus] = useState<ReservationStatus>(
    reservation.reservationStatus
  );
  const [payStatus, setPayStatus] = useState<PaymentStatus>(
    reservation.paymentStatus
  );
  const [assignedZone, setAssignedZone] = useState(reservation.assignedZone ?? "");
  const [internalNotes, setInternalNotes] = useState(reservation.internalNotes ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setSaveError(false);

    const ok = await updateReservation(reservation.id, {
      reservationStatus: resvStatus,
      paymentStatus: payStatus,
      assignedZone,
      internalNotes,
    });

    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError(true);
    }
  }

  async function handleCopyWhatsApp() {
    const msg = buildWhatsAppMessage({ ...reservation, assignedZone: assignedZone || null });
    await navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-4 lg:mx-auto lg:max-w-3xl">
      {/* Back */}
      <Link
        href="/admin/reservas"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Reservas
      </Link>

      {/* Header */}
      <div className="panel rounded-[20px] px-5 py-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Momento
          </p>
          <p className="mt-0.5 text-lg font-semibold text-neutral-900">
            {reservation.packageName}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {formatDate(reservation.eventDate)} · {reservation.eventTime.slice(0, 5)} · {reservation.guestCount} pers.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyWhatsApp}
          className="flex shrink-0 items-center gap-1.5 rounded-[10px] border border-black/15 bg-white px-3 h-8 text-xs font-medium text-neutral-700 hover:border-black/30"
        >
          {copied ? (
            <><Check className="size-3.5 text-green-600" /> Copiado</>
          ) : (
            <><Copy className="size-3.5" /> WhatsApp</>
          )}
        </button>
      </div>

      {/* Client info */}
      <div className="panel rounded-[20px] px-5 py-4 space-y-3">
        <SectionTitle>Cliente</SectionTitle>
        <Row label="Nombre" value={reservation.clientName} />
        <Row label="WhatsApp" value={reservation.clientWhatsapp} />
        <Row label="Homenajeado/a" value={reservation.honoreeName} />
        <Row label="Ocasión" value={reservation.occasion} />
      </div>

      {/* Moment details */}
      <div className="panel rounded-[20px] px-5 py-4 space-y-3">
        <SectionTitle>Detalles del momento</SectionTitle>
        <Row label="Mensaje para tarjeta" value={reservation.cardMessage} />
        <Row label="Color de decoración" value={reservation.decorationColor} />
        <Row label="Observaciones" value={reservation.observations} />
      </div>

      {/* Files */}
      {(cardPhotoUrl || paymentProofUrl) && (
        <div className="panel rounded-[20px] px-5 py-4 space-y-4">
          <SectionTitle>Archivos</SectionTitle>

          {cardPhotoUrl && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Foto para tarjeta
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cardPhotoUrl}
                alt="Foto para tarjeta"
                className="max-h-60 rounded-[12px] object-contain border border-black/10"
              />
            </div>
          )}

          {paymentProofUrl && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Comprobante de pago
              </p>
              <a
                href={paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-2 rounded-[10px] border border-black/15 bg-white px-3 text-xs font-medium text-neutral-700 hover:border-black/30"
              >
                Ver comprobante
              </a>
            </div>
          )}
        </div>
      )}

      {/* Admin controls */}
      {canEdit && (
        <div className="panel rounded-[20px] px-5 py-4 space-y-4">
          <SectionTitle>Gestión</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="resv-status"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
              >
                Estado
              </label>
              <select
                id="resv-status"
                value={resvStatus}
                onChange={(e) => setResvStatus(e.target.value as ReservationStatus)}
                className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-2.5 text-sm text-neutral-900 outline-none focus:border-black/40"
              >
                {RESERVATION_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="pay-status"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
              >
                Pago
              </label>
              <select
                id="pay-status"
                value={payStatus}
                onChange={(e) => setPayStatus(e.target.value as PaymentStatus)}
                className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-2.5 text-sm text-neutral-900 outline-none focus:border-black/40"
              >
                {PAYMENT_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="assigned-zone"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
            >
              Mesa / zona asignada
              <span className="ml-1 normal-case tracking-normal font-normal text-neutral-300">
                (opcional)
              </span>
            </label>
            <input
              id="assigned-zone"
              type="text"
              value={assignedZone}
              onChange={(e) => setAssignedZone(e.target.value)}
              placeholder="Ej: zona jardín, mesa 4…"
              className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-black/40"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="internal-notes"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
            >
              Notas internas
              <span className="ml-1 normal-case tracking-normal font-normal text-neutral-300">
                (opcional)
              </span>
            </label>
            <textarea
              id="internal-notes"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black/40 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-9 items-center rounded-[10px] bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            {saved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="size-3.5" /> Guardado
              </span>
            )}
            {saveError && (
              <span className="text-sm text-red-500">Error al guardar.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
