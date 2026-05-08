import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock, HandCoins } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cafeInfo,
  calculateTipDistribution,
  formatCurrency,
  getEmployeesWorkingToday,
  getOpenTipWeek,
  getPaymentSummary,
  getTodayShift,
} from "@/lib/mock-data";

export default function TodayPage() {
  const todayShift = getTodayShift();
  const workingToday = getEmployeesWorkingToday();
  const openWeek = getOpenTipWeek();
  const distribution = openWeek
    ? calculateTipDistribution(openWeek.totalTips, openWeek.payments)
    : [];
  const paymentSummary = openWeek
    ? getPaymentSummary(openWeek.payments)
    : { paid: 0, pending: 0, total: 0 };
  const nextPending = distribution.find((item) => item.paymentStatus === "pendiente");

  return (
    <>
      <PageHeader
        title="Hoy"
        description={cafeInfo.todayLabel}
        action={
          <Button className="rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]" asChild>
            <Link href="/admin/propinas">
              <HandCoins className="size-4" />
              Propinas
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <Clock className="size-4 text-[#d98b3a]" />
              Horario
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {cafeInfo.todayHours}
              </p>
              <p className="mt-3 text-sm text-[#a8a09a]">{cafeInfo.address}</p>
            </div>
            <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/admin/horarios">
                Semana
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <HandCoins className="size-4 text-[#d98b3a]" />
              Propinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {openWeek ? formatCurrency(openWeek.totalTips) : "$0"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Badge className="rounded-full bg-[#1f4d32] text-[#9df2b1]">
                {paymentSummary.paid} pagados
              </Badge>
              <Badge className="rounded-full bg-[#3c2b11] text-[#ffbd63]">
                {paymentSummary.pending} pendientes
              </Badge>
            </div>
            {openWeek ? (
              <Button className="mt-5 rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]" asChild>
                <Link href={`/admin/propinas/${openWeek.id}`}>
                  Abrir
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <CalendarDays className="size-4 text-[#d98b3a]" />
              Turno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workingToday.map(({ employee, hours }) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <div>
                  <p className="text-base font-semibold text-white">{employee.name}</p>
                  <p className="text-sm text-[#a8a09a]">{employee.baseShift}</p>
                </div>
                <span className="rounded-full bg-[#2b251d] px-3 py-1 text-sm font-semibold text-[#d98b3a]">
                  {hours} h
                </span>
              </div>
            ))}
            {todayShift ? (
              <p className="pt-1 text-sm text-[#a8a09a]">
                {workingToday.length} personas
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <CheckCircle2 className="size-4 text-[#6ee68a]" />
              Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextPending ? (
              <>
                <p className="text-lg font-semibold text-white">{nextPending.employee.name}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                  {formatCurrency(nextPending.amount)}
                </p>
                <p className="mt-2 text-sm text-[#a8a09a]">
                  {nextPending.hours} h · {nextPending.daysWorked} días
                </p>
              </>
            ) : (
              <p className="text-base text-[#a8a09a]">
                Todo pagado
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
