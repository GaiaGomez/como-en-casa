import { getInventory } from "@/lib/supabase/inventory";
import InventoryClient from "@/app/admin/inventario/client";

export default async function EmpleadoInventarioPage() {
  const items = await getInventory();
  return <InventoryClient initialItems={items} canReset={false} />;
}
