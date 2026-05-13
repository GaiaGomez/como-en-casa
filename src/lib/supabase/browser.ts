import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (supabaseAnonKey.startsWith("sb_secret_")) {
    console.error("Secret Supabase key cannot be used in the browser. Use the publishable key.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}