import { createBrowserSupabase } from "./browser";

export async function signIn(email: string, password: string) {
  const supabase = createBrowserSupabase();
  if (!supabase) return { data: null, error: { message: "Supabase not configured" } };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createBrowserSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
