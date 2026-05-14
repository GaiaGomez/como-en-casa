import { inventory as mockInventory, type InventoryItem } from "@/lib/mock-data";
import { createServerSupabase } from "./server";

type SupabaseInventoryRow = {
  id: string;
  name: string;
  category: string;
  supplier: string | null;
  unit: string;
  current_stock: number;
  ideal_stock: number;
};

function mapRow(row: SupabaseInventoryRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    supplier: row.supplier ?? undefined,
    unit: row.unit,
    currentStock: row.current_stock,
    idealStock: row.ideal_stock,
  };
}

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return mockInventory;

  const { data, error } = await supabase
    .from("inventory")
    .select("id, name, category, supplier, unit, current_stock, ideal_stock")
    .order("category")
    .order("name");

  if (error) {
    console.error("[getInventory] error:", error.message, "| code:", error.code);
    return mockInventory;
  }
  if (!data || data.length === 0) {
    console.warn("[getInventory] query returned 0 rows — check RLS SELECT policies on inventory table");
    return mockInventory;
  }

  return (data as SupabaseInventoryRow[]).map(mapRow);
}
