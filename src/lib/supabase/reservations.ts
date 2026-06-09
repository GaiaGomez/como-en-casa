import { createServerSupabase } from "./server";

export type ReservationStatus =
  | "new"
  | "reviewing"
  | "confirmed"
  | "preparing"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "proof_sent"
  | "verified"
  | "rejected";

export type ReservationListItem = {
  id: string;
  packageName: string;
  selectedVariantLabel: string | null;
  selectedVariantPrice: string | null;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  clientName: string;
  clientWhatsapp: string;
  reservationStatus: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type ReservationDetail = ReservationListItem & {
  packageId: string | null;
  honoreeName: string | null;
  occasion: string | null;
  cardMessage: string | null;
  decorationColor: string | null;
  cardPhotoPath: string | null;
  paymentProofPath: string | null;
  observations: string | null;
  assignedZone: string | null;
  internalNotes: string | null;
};

type SupabaseRow = {
  id: string;
  package_id: string | null;
  package_name: string;
  selected_variant_label: string | null;
  selected_variant_price: string | null;
  event_date: string;
  event_time: string;
  guest_count: number;
  client_name: string;
  client_whatsapp: string;
  honoree_name: string | null;
  occasion: string | null;
  card_message: string | null;
  decoration_color: string | null;
  card_photo_path: string | null;
  payment_proof_path: string | null;
  observations: string | null;
  assigned_zone: string | null;
  internal_notes: string | null;
  reservation_status: ReservationStatus;
  payment_status: PaymentStatus;
  created_at: string;
};

export async function getReservations(): Promise<ReservationListItem[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select(
      "id, package_name, selected_variant_label, selected_variant_price, event_date, event_time, guest_count, client_name, client_whatsapp, reservation_status, payment_status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getReservations] error:", error.message);
    return [];
  }

  return (data as SupabaseRow[]).map((row) => ({
    id: row.id,
    packageName: row.package_name,
    selectedVariantLabel: row.selected_variant_label,
    selectedVariantPrice: row.selected_variant_price,
    eventDate: row.event_date,
    eventTime: row.event_time,
    guestCount: row.guest_count,
    clientName: row.client_name,
    clientWhatsapp: row.client_whatsapp,
    reservationStatus: row.reservation_status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  }));
}

export async function getReservation(id: string): Promise<ReservationDetail | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as SupabaseRow;
  return {
    id: row.id,
    packageId: row.package_id,
    packageName: row.package_name,
    selectedVariantLabel: row.selected_variant_label,
    selectedVariantPrice: row.selected_variant_price,
    eventDate: row.event_date,
    eventTime: row.event_time,
    guestCount: row.guest_count,
    clientName: row.client_name,
    clientWhatsapp: row.client_whatsapp,
    honoreeName: row.honoree_name,
    occasion: row.occasion,
    cardMessage: row.card_message,
    decorationColor: row.decoration_color,
    cardPhotoPath: row.card_photo_path,
    paymentProofPath: row.payment_proof_path,
    observations: row.observations,
    assignedZone: row.assigned_zone,
    internalNotes: row.internal_notes,
    reservationStatus: row.reservation_status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}

export async function getSignedUrl(
  bucket: "reservation-photos" | "payment-proofs",
  path: string
): Promise<string | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);

  if (error || !data) return null;
  return data.signedUrl;
}
