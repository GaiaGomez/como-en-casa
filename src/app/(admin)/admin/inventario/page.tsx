import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getInventory } from "@/lib/supabase/inventory";
import InventoryClient from "./client";

export default async function InventoryPage() {
  const [items, profile] = await Promise.all([getInventory(), getCurrentProfile()]);
  const { canEditInventario } = getPermissions(profile?.role);
  const isAdmin = profile?.role === "admin";

  return (
    <InventoryClient
      initialItems={items}
      canReset={canEditInventario}
      canEditIdealStock={canEditInventario}
      canEditName={isAdmin}
    />
  );
}
