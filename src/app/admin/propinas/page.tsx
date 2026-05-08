import { redirect } from "next/navigation";

export default function TipsPage() {
  redirect("/admin/gestion-equipo?tab=propinas");
}
