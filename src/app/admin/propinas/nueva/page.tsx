import { PageHeader } from "@/components/admin/page-header";
import { TipCalculator } from "@/components/admin/tip-calculator";

export default function NewTipsPage() {
  return (
    <>
      <PageHeader
        title="Nueva semana de propinas"
        description="Ingresa el total semanal que entrega Fudo y valida el reparto por horas antes de cerrar la semana."
      />
      <TipCalculator />
    </>
  );
}
