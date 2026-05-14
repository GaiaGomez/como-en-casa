import Link from "next/link";
import { Box, CalendarDays, HandCoins, ShoppingCart } from "lucide-react";

import { currentWorkWeek, getBuyQty, getStockLevel, getWeekLabel } from "@/lib/mock-data";
import { getInventory } from "@/lib/supabase/inventory";
import { getManualShoppingItems } from "@/lib/supabase/shopping-items";

export default async function AdminDashboardPage() {
  const [inventoryItems, manualItems] = await Promise.all([
    getInventory(),
    getManualShoppingItems(),
  ]);

  const weekLabel = getWeekLabel(currentWorkWeek[0].date, currentWorkWeek[currentWorkWeek.length - 1].date);
  const criticalCount = inventoryItems.filter((i) => getStockLevel(i) === "crítico").length;
  const toBuyCount = inventoryItems.filter((i) => getBuyQty(i) > 0).length;
  const pendingShoppingCount = toBuyCount + manualItems.length;

  return (
    <section className="flex w-full flex-col gap-3 lg:mx-auto lg:max-w-5xl xl:max-w-6xl">
      {/* Semana */}
      <article className="panel flex items-center justify-between rounded-[20px] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Semana</p>
        <p className="text-sm font-normal text-neutral-400">{weekLabel}</p>
      </article>

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
        {/* Compras featured + Críticos small */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/admin/compras"
            className="panel col-span-2 flex min-h-[104px] flex-col justify-between rounded-[20px] px-4 py-4 transition active:scale-[0.99]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Compras</p>
            <div>
              <p className="mt-3 text-3xl font-bold leading-none text-neutral-950">{pendingShoppingCount}</p>
              <p className="mt-1 text-sm font-normal text-neutral-400">por comprar</p>
            </div>
          </Link>
          <Link
            href="/admin/compras"
            className="panel flex min-h-[104px] flex-col justify-between rounded-[20px] px-3 py-4 transition active:scale-[0.99]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Críticos</p>
            <div>
              <p className="mt-3 text-3xl font-bold leading-none text-neutral-950">{criticalCount}</p>
              <p className="mt-1 text-sm font-normal text-neutral-400">críticos</p>
            </div>
          </Link>
        </div>

        {/* Accesos 2×2 */}
        <div className="grid grid-cols-2 gap-2">
          <AccessCard href="/admin/gestion-equipo" icon={CalendarDays} label="Horario" />
          <AccessCard href="/admin/gestion-equipo?tab=propinas" icon={HandCoins} label="Propinas" />
          <AccessCard href="/admin/inventario" icon={Box} label="Inventario" />
          <AccessCard href="/admin/compras" icon={ShoppingCart} label="Compras" />
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
