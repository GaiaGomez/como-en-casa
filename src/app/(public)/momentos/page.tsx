import { getPackages } from "@/lib/supabase/packages";
import { MomentosClient } from "./client";

export default async function MomentosPage() {
  const packages = await getPackages();
  return <MomentosClient packages={packages} />;
}
