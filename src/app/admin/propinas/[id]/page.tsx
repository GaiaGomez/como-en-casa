import { redirect } from "next/navigation";

export default function TipDetailPage() {
  redirect("/admin/gestion-equipo?tab=propinas");
}
