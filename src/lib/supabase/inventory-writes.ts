import { createBrowserSupabase } from "./browser";

export async function resetInventoryStock(): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("inventory")
    .update({ current_stock: 0 })
    .not("id", "is", null);

  return !error;
}
