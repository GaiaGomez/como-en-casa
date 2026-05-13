import { createBrowserSupabase } from "./browser";

export async function updateInventoryStock(id: string, stock: number): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("inventory")
    .update({ current_stock: stock })
    .eq("id", id);

  return !error;
}

export async function resetInventoryStock(): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("inventory")
    .update({ current_stock: 0 })
    .not("id", "is", null);

  return !error;
}
