import InventoryClient from "@/app/admin/inventario/client";
import { inventory } from "@/lib/demo-data";

export default function DemoInventarioPage() {
  return (
    <InventoryClient
      initialItems={inventory}
      canReset={false}
      canEditIdealStock={false}
      canEditName={false}
      canEditCurrentStock={false}
    />
  );
}
