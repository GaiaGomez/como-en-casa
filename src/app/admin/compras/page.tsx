import { getCurrentProfile } from "@/lib/supabase/auth";
import { getManualShoppingItems } from "@/lib/supabase/shopping-items";
import PurchasesClient from "./client";

export default async function ComprasPage() {
  const [manualItems, profile] = await Promise.all([
    getManualShoppingItems(),
    getCurrentProfile(),
  ]);

  return (
    <PurchasesClient
      initialManualItems={manualItems}
      canDelete={profile?.role === "admin"}
    />
  );
}
