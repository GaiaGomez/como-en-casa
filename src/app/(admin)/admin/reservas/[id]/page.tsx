import { notFound, redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/supabase/auth";
import { getReservation, getSignedUrl } from "@/lib/supabase/reservations";
import { ReservationDetailClient } from "./client";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const [cardPhotoUrl, paymentProofUrl] = await Promise.all([
    reservation.cardPhotoPath
      ? getSignedUrl("reservation-photos", reservation.cardPhotoPath)
      : Promise.resolve(null),
    reservation.paymentProofPath
      ? getSignedUrl("payment-proofs", reservation.paymentProofPath)
      : Promise.resolve(null),
  ]);

  const canEdit = profile.role === "admin";

  return (
    <ReservationDetailClient
      reservation={reservation}
      cardPhotoUrl={cardPhotoUrl}
      paymentProofUrl={paymentProofUrl}
      canEdit={canEdit}
    />
  );
}
