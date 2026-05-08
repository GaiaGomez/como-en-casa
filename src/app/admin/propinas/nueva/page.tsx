import { PageHeader } from "@/components/admin/page-header";
import { TipCalculator } from "@/components/admin/tip-calculator";

export default function NewTipsPage() {
  return (
    <>
      <PageHeader
        title="Nueva"
        description="Total semana → días"
      />
      <TipCalculator />
    </>
  );
}
