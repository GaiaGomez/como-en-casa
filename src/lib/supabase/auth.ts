import { redirect } from "next/navigation";
import { createServerSupabase } from "./server";

export type UserRole = "admin" | "employee";

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  employee_id: string | null;
};

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role, employee_id")
    .eq("id", user.id)
    .single();

  if (!data) return null;
  return data as Profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: UserRole) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== role) {
    redirect("/admin");
  }
  return profile;
}
