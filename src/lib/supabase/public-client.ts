import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase SOLO para la web pública (formulario de reservas).
 *
 * ¿Por qué no usar createBrowserSupabase()? Ese cliente lee la sesión de las
 * cookies: si en el mismo navegador alguien inició sesión en el admin (Lina,
 * Gaia) y esa sesión está vencida o a medio refrescar, las subidas a Storage
 * van con un token inválido y fallan ("No pudimos subir la foto").
 *
 * Este cliente siempre trabaja como visitante anónimo (rol `anon`):
 * - persistSession: false   → no guarda ni lee sesión
 * - autoRefreshToken: false → no intenta refrescar tokens
 * Así el formulario funciona igual para cualquier persona, logueada o no.
 */
let client: SupabaseClient | null = null;

export function createPublicSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  // Singleton: una sola instancia por pestaña.
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
