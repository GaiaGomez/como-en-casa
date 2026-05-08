import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDollarSign, Plus } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateTipDistribution,
  formatCurrency,
  getPaymentSummary,
  getWeekTotalHours,
  tipWeeks,
} from "@/lib/mock-data";

export default function TipsPage() {
  const currentWeek = tipWeeks[0];
  const currentDistribution = calculateTipDistribution(
    currentWeek.totalTips,
    currentWeek.payments
  );
  const currentSummary = getPaymentSummary(currentWeek.payments);

  return (
    <>
      <PageHeader
        title="Propinas"
        description="Fudo → Horas → Reparto → Pagos"
        action={
          <Button className="rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]" asChild>
            <Link href="/admin/propinas/nueva">
              <Plus className="size-4" />
              Nueva
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <CircleDollarSign className="size-4 text-[#d98b3a]" />
              Abierta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-[#a8a09a]">{currentWeek.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {formatCurrency(currentWeek.totalTips)}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Horas" value={`${getWeekTotalHours()} h`} />
              <MiniStat label="Pagados" value={`${currentSummary.paid}/${currentSummary.total}`} />
              <MiniStat label="Pendientes" value={`${currentSummary.pending}`} />
            </div>
            <Button className="mt-5 rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]" asChild>
              <Link href={`/admin/propinas/${currentWeek.id}`}>
                Abrir
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#bdb6ae]">Flujo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Fudo", "Horas", "Reparto", "Pagos"].map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-5">
                <p className="text-3xl font-semibold text-[#d98b3a]">{index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-white">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        {tipWeeks.map((week) => {
          const distribution = calculateTipDistribution(week.totalTips, week.payments);
          const paidCount = distribution.filter(
            (item) => item.paymentStatus === "pagado"
          ).length;
          const isClosed = paidCount === distribution.length;

          return (
            <Link
              key={week.id}
              href={`/admin/propinas/${week.id}`}
              className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[#1b1814] p-4 transition-colors hover:bg-[#211e19] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{week.label}</h3>
                  <Badge
                    className={
                      isClosed
                        ? "rounded-full bg-[#1f4d32] text-[#9df2b1]"
                        : "rounded-full bg-[#3c2b11] text-[#ffbd63]"
                    }
                  >
                    {isClosed ? "Pagada" : "Pendiente"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[#a8a09a]">
                  {formatCurrency(week.totalTips)} · {paidCount}/{distribution.length}
                </p>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#d98b3a]">
                Abrir
                {isClosed ? (
                  <CheckCircle2 className="size-4 text-[#6ee68a]" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-sm text-[#a8a09a]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
