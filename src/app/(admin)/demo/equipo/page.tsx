import { Suspense } from "react";

import { TeamManagementClient } from "@/app/(admin)/admin/gestion-equipo/client";
import { demoEmployees } from "@/lib/demo-data";

export default function DemoEquipoPage() {
  return (
    <Suspense fallback={null}>
      <TeamManagementClient
        initialEmployees={demoEmployees}
        initialWeeks={[]}
        canEditHorario={false}
        canEditPropinas={false}
        canEditEquipo={false}
      />
    </Suspense>
  );
}
