import { getInventory } from "@/lib/supabase/inventory";
import InventoryClient from "./client";

export default async function InventoryPage() {
  const items = await getInventory();
  return <InventoryClient initialItems={items} />;
}
