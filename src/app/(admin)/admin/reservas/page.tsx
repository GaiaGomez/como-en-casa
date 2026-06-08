import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getReservations } from "@/lib/supabase/reservations";
import { ReservasClient } from "./client";
import { redirect } from "next/navigation";

export default async function ReservasPage() {
  const profile = await getCurrentProfile();
  const { canEditReservas } = getPermissions(profile?.role);

  if (!profile) redirect("/login");

  const reservations = await getReservations();

  return <ReservasClient reservations={reservations} canEdit={canEditReservas} />;
}
