"use client";

import Link from "next/link";

import type { ReservationListItem, ReservationStatus, PaymentStatus } from "@/lib/supabase/reservations";

const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  new:        "Nueva",
  reviewing:  "En revisión",
  confirmed:  "Confirmada",
  preparing:  "Preparando",
  completed:  "Completada",
  cancelled:  "Cancelada",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending:    "Pendiente",
  proof_sent: "Comprobante enviado",
  verified:   "Verificado",
  rejected:   "Rechazado",
};

const RESERVATION_STATUS_CLASS: Record<ReservationStatus, string> = {
  new:       "bg-neutral-100 text-neutral-600",
  reviewing: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  preparing: "bg-blue-100 text-blue-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-600",
};

const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  pending:    "bg-neutral-100 text-neutral-600",
  proof_sent: "bg-amber-100 text-amber-700",
  verified:   "bg-green-100 text-green-700",
  rejected:   "bg-red-100 text-red-600",
};

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function ReservasClient({
  reservations,
  canEdit,
}: {
  reservations: ReservationListItem[];
  canEdit: boolean;
}) {
  if (reservations.length === 0) {
    return (
      <div className="panel rounded-[20px] px-5 py-10 text-center">
        <p className="text-sm text-neutral-400">
          No hay reservas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Reservas</h1>
        <span className="text-sm text-neutral-400">{reservations.length} total</span>
      </div>

      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 lg:hidden">
        {reservations.map((r) => (
          <Link
            key={r.id}
            href={`/admin/reservas/${r.id}`}
            className="panel flex flex-col gap-2 rounded-[16px] px-4 py-3 transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-neutral-900 leading-snug">
                  {r.packageName}
                </p>
                {r.selectedVariantLabel && (
                  <p className="text-xs text-neutral-400">
                    {r.selectedVariantLabel} · {r.selectedVariantPrice}
                  </p>
                )}
              </div>
              <StatusBadge
                label={RESERVATION_STATUS_LABEL[r.reservationStatus]}
                className={RESERVATION_STATUS_CLASS[r.reservationStatus]}
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span>{formatDate(r.eventDate)}</span>
              <span>{r.eventTime.slice(0, 5)}</span>
              <span>{r.guestCount} pers.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">{r.clientName}</span>
              <StatusBadge
                label={PAYMENT_STATUS_LABEL[r.paymentStatus]}
                className={PAYMENT_STATUS_CLASS[r.paymentStatus]}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="panel hidden rounded-[20px] overflow-hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8">
              {["Momento", "Fecha", "Hora", "Cliente", "Personas", "Pago", "Estado"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {reservations.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-black/2 transition-colors"
              >
                <td className="pl-5 pr-4 py-3 max-w-[200px]">
                  <Link
                    href={`/admin/reservas/${r.id}`}
                    className="font-medium text-neutral-900 hover:underline underline-offset-2"
                  >
                    {r.packageName}
                  </Link>
                  {r.selectedVariantLabel && (
                    <p className="text-xs text-neutral-400 truncate">
                      {r.selectedVariantLabel} · {r.selectedVariantPrice}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                  {formatDate(r.eventDate)}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {r.eventTime.slice(0, 5)}
                </td>
                <td className="px-4 py-3 text-neutral-900">{r.clientName}</td>
                <td className="px-4 py-3 text-neutral-600">{r.guestCount}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={PAYMENT_STATUS_LABEL[r.paymentStatus]}
                    className={PAYMENT_STATUS_CLASS[r.paymentStatus]}
                  />
                </td>
                <td className="pr-5 pl-4 py-3">
                  <StatusBadge
                    label={RESERVATION_STATUS_LABEL[r.reservationStatus]}
                    className={RESERVATION_STATUS_CLASS[r.reservationStatus]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
