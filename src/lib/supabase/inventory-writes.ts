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

export async function updateInventoryItem(
  id: string,
  fields: { name?: string; idealStock?: number }
): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;
  const update: Record<string, unknown> = {};
  if (fields.name !== undefined) update.name = fields.name;
  if (fields.idealStock !== undefined) update.ideal_stock = fields.idealStock;
  if (Object.keys(update).length === 0) return true;
  const { error } = await supabase.from("inventory").update(update).eq("id", id);
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
