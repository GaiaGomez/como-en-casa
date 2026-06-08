import Link from "next/link";
import { Box, CalendarDays, HandCoins, ShoppingCart } from "lucide-react";

import {
  getBuyQty,
  getStockLevel,
  getWeekLabel,
} from "@/lib/mock-data";
import { inventory, manualShoppingItems, currentWorkWeek } from "@/lib/demo-data";

export default function DemoDashboardPage() {
  const weekLabel = getWeekLabel(
    currentWorkWeek[0].date,
    currentWorkWeek[currentWorkWeek.length - 1].date
  );
  const criticalCount = inventory.filter((i) => getStockLevel(i) === "crítico").length;
  const toBuyCount = inventory.filter((i) => getBuyQty(i) > 0).length;
  const pendingShoppingCount = toBuyCount + manualShoppingItems.length;

  return (
    <section className="flex w-full flex-col gap-3 lg:mx-auto lg:max-w-5xl xl:max-w-6xl">
      <article className="panel flex items-center justify-between rounded-[20px] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Semana</p>
        <p className="text-sm font-normal text-neutral-400">{weekLabel}</p>
      </article>

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/demo/compras"
            className="panel col-span-2 flex min-h-[104px] flex-col justify-between rounded-[20px] px-4 py-4 transition active:scale-[0.99]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Compras</p>
            <div>
              <p className="mt-3 text-3xl font-bold leading-none text-neutral-950">{pendingShoppingCount}</p>
              <p className="mt-1 text-sm font-normal text-neutral-400">por comprar</p>
            </div>
          </Link>
          <Link
            href="/demo/compras"
            className="panel flex min-h-[104px] flex-col justify-between rounded-[20px] px-3 py-4 transition active:scale-[0.99]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Críticos</p>
            <div>
              <p className="mt-3 text-3xl font-bold leading-none text-neutral-950">{criticalCount}</p>
              <p className="mt-1 text-sm font-normal text-neutral-400">críticos</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <AccessCard href="/demo/equipo" icon={CalendarDays} label="Horario" />
          <AccessCard href="/demo/equipo" icon={HandCoins} label="Propinas" />
          <AccessCard href="/demo/inventario" icon={Box} label="Inventario" />
          <AccessCard href="/demo/compras" icon={ShoppingCart} label="Compras" />
        </div>
      </div>
    </section>
  );
}

function AccessCard({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof CalendarDays;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="panel flex min-h-[94px] flex-col items-start justify-between gap-3 rounded-[20px] px-4 py-4 transition active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black text-white">
        <Icon className="size-4" />
      </span>
      <p className="text-base font-medium text-neutral-900">{label}</p>
    </Link>
  );
}
