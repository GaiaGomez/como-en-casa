import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getInventory } from "@/lib/supabase/inventory";
import { getManualShoppingItems } from "@/lib/supabase/shopping-items";
import PurchasesClient from "./client";

export default async function ComprasPage() {
  const [manualItems, inventoryItems, profile] = await Promise.all([
    getManualShoppingItems(),
    getInventory(),
    getCurrentProfile(),
  ]);
  const { canEditCompras } = getPermissions(profile?.role);

  return (
    <PurchasesClient
      initialManualItems={manualItems}
      initialInventory={inventoryItems}
      canDelete={canEditCompras}
      canAdd={canEditCompras}
      canMarkBought={canEditCompras}
    />
  );
}
