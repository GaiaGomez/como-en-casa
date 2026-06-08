import { getManualShoppingItems } from "@/lib/supabase/shopping-items";
import PurchasesClient from "@/app/(admin)/admin/compras/client";

export default async function EmpleadoComprasPage() {
  const manualItems = await getManualShoppingItems();
  return <PurchasesClient initialManualItems={manualItems} canDelete={false} />;
}
