import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getManualShoppingItems } from "@/lib/supabase/shopping-items";
import PurchasesClient from "./client";

export default async function ComprasPage() {
  const [manualItems, profile] = await Promise.all([
    getManualShoppingItems(),
    getCurrentProfile(),
  ]);
  const { canEditCompras } = getPermissions(profile?.role);

  return (
    <PurchasesClient
      initialManualItems={manualItems}
      canDelete={canEditCompras}
      canAdd={canEditCompras}
      canMarkBought={canEditCompras}
    />
  );
}
