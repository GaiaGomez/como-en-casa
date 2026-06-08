import PurchasesClient from "@/app/(admin)/admin/compras/client";
import { inventory, manualShoppingItems } from "@/lib/demo-data";

export default function DemoComprasPage() {
  return (
    <PurchasesClient
      initialManualItems={manualShoppingItems}
      initialInventory={inventory}
      canDelete={false}
      canAdd={false}
      canMarkBought={false}
    />
  );
}
