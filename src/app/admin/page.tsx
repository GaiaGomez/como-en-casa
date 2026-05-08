import Link from "next/link";
import { ArrowRight, Box, HandCoins, ShoppingCart, Users } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import {
  calculateTipDistribution,
  currentWorkWeek,
  employees,
  formatCurrency,
  getBuyQty,
  getStockLevel,
  inventory,
  tipWeeks,
} from "@/lib/mock-data";

const weekLabel = getWeekLabel(currentWorkWeek[0].date, currentWorkWeek[currentWorkWeek.length - 1].date);
const activeEmployees = employees.filter((employee) => employee.status === "activo").length;
const openWeek = tipWeeks.find((w) => w.status === "abierta");
const pendingTips = openWeek
  ? calculateTipDistribution(openWeek.totalTips, openWeek.payments)
      .filter((d) => d.paymentStatus === "pendiente")
      .reduce((sum, d) => sum + d.amount, 0)
  : 0;
const criticalCount = inventory.filter((i) => getStockLevel(i) === "crítico").length;
const toBuyCount    = inventory.filter((i) => getBuyQty(i) > 0).length;

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Inicio" description="Resumen semanal" />

      {/* Stats row */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Semana" value={weekLabel} />
        <StatCard label="Empleados activos" value={`${activeEmployees}`} />
        <StatCard label="Propinas por pagar" value={formatCurrency(pendingTips)} />
        <StatCard label={`Críticos · ${toBuyCount} por comprar`} value={`${criticalCount}`} />
      </section>

      {/* Nav links */}
      <section className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <NavCard href="/admin/gestion-equipo" icon={Users}   title="Equipo"     description="Horario y gestión de empleados" />
        <NavCard href="/admin/propinas"        icon={HandCoins} title="Propinas" description="Reparto semanal del equipo" />
        <NavCard href="/admin/inventario"      icon={Box}     title="Inventario" description="Controla productos bajos en stock" />
        <NavCard href="/admin/compras"         icon={ShoppingCart} title="Compras" description="Sigue las compras pendientes" />
      </section>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="panel px-4 py-3">
      <p className="text-[0.65rem] font-medium uppercase tracking-wide text-black/40">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-black">{value}</p>
    </article>
  );
}

function NavCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="panel flex items-center gap-3 px-4 py-3 transition hover:shadow-sm active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-black text-white">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="text-xs text-black/50">{description}</p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-black/25" />
    </Link>
  );
}

function getWeekLabel(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
}
