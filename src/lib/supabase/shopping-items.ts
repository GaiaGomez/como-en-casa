import { manualShoppingItems, type ManualShoppingItem } from "@/lib/mock-data";
import { createServerSupabase } from "./server";

type SupabaseShoppingRow = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string | null;
  status: string;
};

export async function getManualShoppingItems(): Promise<ManualShoppingItem[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return manualShoppingItems;

  const { data, error } = await supabase
    .from("manual_shopping_items")
    .select("id, name, quantity, unit, category, status")
    .eq("status", "pendiente")
    .order("created_at");

  if (error) return manualShoppingItems;
  if (!data || data.length === 0) return [];

  return (data as SupabaseShoppingRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    category: row.category ?? undefined,
    status: "pendiente" as const,
  }));
}
