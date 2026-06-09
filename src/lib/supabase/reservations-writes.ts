import { createBrowserSupabase } from "./browser";
import type { ReservationStatus, PaymentStatus } from "./reservations";

export type CreateReservationPayload = {
  packageId: string | null;
  packageName: string;
  selectedVariantLabel?: string;
  selectedVariantPrice?: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  clientName: string;
  clientWhatsapp: string;
  honoreeName?: string;
  occasion?: string;
  cardMessage?: string;
  decorationColor?: string;
  cardPhotoPath?: string;
  paymentProofPath?: string;
  observations?: string;
};

export async function uploadReservationFile(
  bucket: "reservation-photos" | "payment-proofs",
  file: File
): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("[uploadReservationFile] error:", error.message);
    return null;
  }

  return path;
}

export async function createReservation(
  payload: CreateReservationPayload
): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("reservations").insert({
    package_id: payload.packageId ?? null,
    package_name: payload.packageName,
    selected_variant_label: payload.selectedVariantLabel || null,
    selected_variant_price: payload.selectedVariantPrice || null,
    event_date: payload.eventDate,
    event_time: payload.eventTime,
    guest_count: payload.guestCount,
    client_name: payload.clientName,
    client_whatsapp: payload.clientWhatsapp,
    honoree_name: payload.honoreeName || null,
    occasion: payload.occasion || null,
    card_message: payload.cardMessage || null,
    decoration_color: payload.decorationColor || null,
    card_photo_path: payload.cardPhotoPath ?? null,
    payment_proof_path: payload.paymentProofPath ?? null,
    observations: payload.observations || null,
    reservation_status: "new",
    payment_status: payload.paymentProofPath ? "proof_sent" : "pending",
  });

  if (error) {
    console.error("[createReservation] error:", error.message);
    return false;
  }

  return true;
}

export async function updateReservation(
  id: string,
  patch: {
    reservationStatus?: ReservationStatus;
    paymentStatus?: PaymentStatus;
    assignedZone?: string;
    internalNotes?: string;
  }
): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const update: Record<string, unknown> = {};
  if (patch.reservationStatus !== undefined)
    update.reservation_status = patch.reservationStatus;
  if (patch.paymentStatus !== undefined)
    update.payment_status = patch.paymentStatus;
  if (patch.assignedZone !== undefined)
    update.assigned_zone = patch.assignedZone || null;
  if (patch.internalNotes !== undefined)
    update.internal_notes = patch.internalNotes || null;

  if (Object.keys(update).length === 0) return true;

  const { error } = await supabase
    .from("reservations")
    .update(update)
    .eq("id", id);

  return !error;
}
