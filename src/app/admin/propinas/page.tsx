import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { formatCurrency, getPaymentSummary, tipWeeks } from "@/lib/mock-data";

export default function TipsPage() {
  return (
    <>
      <PageHeader
        title="Propinas"
        description="Reparto semanal del equipo"
        action={
          <Link
            href="/admin/propinas/nueva"
            className="inline-flex h-8 items-center gap-1 rounded-[10px] bg-white px-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            <Plus className="size-4" />
            Nueva semana
          </Link>
        }
      />

      <section className="space-y-3">
        {tipWeeks.map((week) => {
          const summary = getPaymentSummary(week.payments);
          const isOpen = week.status === "abierta";

          return (
            <Link
              key={week.id}
              href={`/admin/propinas/${week.id}`}
              className="panel block p-4 transition hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-black">{week.label}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {summary.paid} pagados · {summary.pending} pendientes
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`tag ${isOpen ? "tag-active" : ""}`}>
                    {isOpen ? "Abierta" : "Cerrada"}
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-black">
                {formatCurrency(week.totalTips)}
              </p>
            </Link>
          );
        })}
      </section>
    </>
  );
}
