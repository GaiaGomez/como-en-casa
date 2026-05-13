import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/auth";

export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile?.role === "employee") {
    redirect("/empleado");
  }
  redirect("/admin");
}
