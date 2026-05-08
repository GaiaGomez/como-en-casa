import { Suspense } from "react";

import { TeamManagementClient } from "./client";

export default function TeamManagementPage() {
  return (
    <Suspense fallback={null}>
      <TeamManagementClient />
    </Suspense>
  );
}
