import { Suspense } from "react";

import { getEmployees } from "@/lib/supabase/employees";
import { TeamManagementClient } from "./client";

export default async function TeamManagementPage() {
  const employees = await getEmployees();
  return (
    <Suspense fallback={null}>
      <TeamManagementClient initialEmployees={employees} />
    </Suspense>
  );
}
