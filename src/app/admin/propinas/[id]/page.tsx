import Link from "next/link";
import { ArrowLeft, CheckCircle2, HandCoins, Wallet } from "lucide-react";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateTipDistribution,
  formatCurrency,
  getPaymentSummary,
  getTipWeek,
  getWeekTotalDays,
  tipWeeks,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return tipWeeks.map((week) => ({ id: week.id }));
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = getTipWeek(id);

  if (!week) {
    notFound();
  }

  const distribution = calculateTipDistribution(week.totalTips, week.payments);
  const summary = getPaymentSummary(week.payments);

  return (
    <>
      <PageHeader
        title={week.label}
        description="Por días trabajados"
        action={
          <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="/admin/propinas">
              <ArrowLeft className="size-4" />
              Volver
            </Link>
          </Button>
        }
      />

      <section>
        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <HandCoins className="size-4 text-[#d98b3a]" />
              Total semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-semibold tracking-tight text-white">{formatCurrency(week.totalTips)}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-[#2b251d] text-[#d98b3a]">
                {getWeekTotalDays()} días
              </Badge>
              <Badge className="rounded-full bg-[#1f4d32] text-[#9df2b1]">
                {summary.paid} pagados
              </Badge>
              <Badge className="rounded-full bg-[#3c2b11] text-[#ffbd63]">
                {summary.pending} pendientes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {distribution.map((item) => {
          const isPaid = item.paymentStatus === "pagado";

          return (
            <article
              key={item.employee.id}
              className="rounded-[2rem] border border-white/10 bg-[#1b1814] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{item.employee.name}</p>
                  <p className="mt-1 text-sm text-[#a8a09a]">{item.daysWorked} días</p>
                </div>
                <Badge
                  className={
                    isPaid
                      ? "rounded-full bg-[#1f4d32] text-[#9df2b1]"
                      : "rounded-full bg-[#3c2b11] text-[#ffbd63]"
                  }
                >
                  {isPaid ? "Pagado" : "Pendiente"}
                </Badge>
              </div>
              <p className="mt-6 text-4xl font-semibold tracking-tight text-white">
                {formatCurrency(item.amount)}
              </p>
              <Button
                className={
                  isPaid
                    ? "mt-5 h-11 w-full rounded-2xl bg-[#1f4d32] font-semibold text-[#9df2b1] hover:bg-[#28663f]"
                    : "mt-5 h-11 w-full rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]"
                }
              >
                {isPaid ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Wallet className="size-4" />
                )}
                {isPaid ? "Listo" : "Pagar"}
              </Button>
            </article>
          );
        })}
      </section>
    </>
  );
}
