import { createBrowserSupabase } from "./browser";

export async function insertManualShoppingItem(item: {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
}): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("manual_shopping_items")
    .insert({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category ?? null,
      status: "pendiente",
    })
    .select("id")
    .single();

  if (error || !data) return null;
  return (data as { id: string }).id;
}

export async function completeManualShoppingItem(id: string): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("manual_shopping_items")
    .update({ status: "completado" })
    .eq("id", id);

  return !error;
}

export async function deleteManualShoppingItem(id: string): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("manual_shopping_items")
    .delete()
    .eq("id", id);

  return !error;
}
