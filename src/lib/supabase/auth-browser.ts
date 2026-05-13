import { createBrowserSupabase } from "./browser";

export async function signIn(email: string, password: string) {
  const supabase = createBrowserSupabase();
  if (!supabase) return { data: null, error: { message: "Supabase not configured" } };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function getUserRole(userId: string): Promise<"admin" | "employee"> {
  const supabase = createBrowserSupabase();
  if (!supabase) return "employee";
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as "admin" | "employee") ?? "employee";
}

export async function signOut() {
  const supabase = createBrowserSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
