import { redirect } from "next/navigation";

export default function NewTipsPage() {
  redirect("/admin/gestion-equipo?tab=propinas");
}
