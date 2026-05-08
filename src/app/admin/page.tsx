import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, HandCoins, Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateTipDistribution,
  employees,
  formatCurrency,
  getOpenTipWeek,
  getWeekTotalHours,
  tipWeeks,
} from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const openWeek = getOpenTipWeek();
  const totalHours = getWeekTotalHours();
  const pendingPayments = openWeek
    ? calculateTipDistribution(openWeek.totalTips, openWeek.payments).filter(
        (item) => item.paymentStatus === "pendiente"
      ).length
    : 0;

  return (
    <>
      <PageHeader
        title="Resumen operativo"
        description="Una vista rapida de la semana: equipo activo, horas trabajadas y propinas por cerrar."
        action={
          <Button className="bg-[#6f4e37] hover:bg-[#5d412f]" asChild>
            <Link href="/admin/propinas/nueva">
              <Plus className="size-4" />
              Nueva semana
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Equipo activo"
          value={employees.filter((employee) => employee.status === "activo").length}
          detail={`${employees.length} personas registradas`}
          icon={<Users className="size-5" />}
        />
        <MetricCard
          title="Horas semana"
          value={totalHours}
          detail="Calculadas desde horarios mock"
          icon={<CalendarDays className="size-5" />}
        />
        <MetricCard
          title="Propinas abiertas"
          value={openWeek ? formatCurrency(openWeek.totalTips) : "$0"}
          detail={openWeek?.label ?? "Sin semana abierta"}
          icon={<HandCoins className="size-5" />}
        />
        <MetricCard
          title="Pagos pendientes"
          value={pendingPayments}
          detail="Personas por marcar como pagadas"
          icon={<HandCoins className="size-5" />}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#eadccb] bg-[#fffaf2]">
          <CardHeader>
            <CardTitle>Semana en curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calculateTipDistribution(openWeek?.totalTips ?? 0, openWeek?.payments).map(
              (item) => (
                <div
                  key={item.employee.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#eadccb] bg-white/70 p-3"
                >
                  <div>
                    <p className="font-medium">{item.employee.name}</p>
                    <p className="text-sm text-[#6f5a47]">
                      {item.hours} h · {item.daysWorked} dias
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    <Badge
                      variant={item.paymentStatus === "pagado" ? "secondary" : "outline"}
                      className="mt-1"
                    >
                      {item.paymentStatus}
                    </Badge>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card className="border-[#eadccb] bg-[#fffaf2]">
          <CardHeader>
            <CardTitle>Historial reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tipWeeks.map((week) => (
              <Link
                key={week.id}
                href={`/admin/propinas/${week.id}`}
                className="block rounded-lg border border-[#eadccb] bg-white/70 p-3 transition-colors hover:bg-[#f7ead8]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{week.label}</p>
                  <Badge variant={week.status === "abierta" ? "outline" : "secondary"}>
                    {week.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-[#6f5a47]">
                  Total Fudo: {formatCurrency(week.totalTips)}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: ReactNode;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <Card className="border-[#eadccb] bg-[#fffaf2]">
      <CardContent className="flex items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-sm font-medium text-[#6f5a47]">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-[#7a6654]">{detail}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#f0e2d0] text-[#6f4e37]">
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}
