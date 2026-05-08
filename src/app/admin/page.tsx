import Link from "next/link";
import { Box, CalendarDays, HandCoins, ShoppingCart } from "lucide-react";

import {
  currentWorkWeek,
  getBuyQty,
  getStockLevel,
  getWeekLabel,
  inventory,
  manualShoppingItems,
} from "@/lib/mock-data";

const weekLabel = getWeekLabel(currentWorkWeek[0].date, currentWorkWeek[currentWorkWeek.length - 1].date);
const criticalCount = inventory.filter((i) => getStockLevel(i) === "crítico").length;
const toBuyCount = inventory.filter((i) => getBuyQty(i) > 0).length;
const pendingManualCount = manualShoppingItems.filter((item) => item.status === "pendiente").length;
const pendingShoppingCount = toBuyCount + pendingManualCount;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-2">
      {/* Semana */}
      <article className="panel flex items-center justify-between px-4 py-3">
        <p className="text-[0.65rem] font-medium uppercase tracking-widest text-black/40">Semana</p>
        <p className="text-sm font-bold text-black">{weekLabel}</p>
      </article>

      {/* Compras featured + Críticos small */}
      <div className="grid grid-cols-3 gap-2">
        <Link
          href="/admin/compras"
          className="panel col-span-2 flex flex-col justify-between px-4 py-4 transition active:scale-[0.99]"
        >
          <p className="text-[0.65rem] font-medium uppercase tracking-widest text-black/40">Compras</p>
          <div>
            <p className="mt-3 text-3xl font-bold leading-none text-black">{pendingShoppingCount}</p>
            <p className="mt-1 text-xs text-black/40">por comprar</p>
          </div>
        </Link>
        <Link
          href="/admin/compras"
          className="panel flex flex-col justify-between px-3 py-4 transition active:scale-[0.99]"
        >
          <p className="text-[0.65rem] font-medium uppercase tracking-widest text-black/40">Críticos</p>
          <div>
            <p className="mt-3 text-2xl font-bold leading-none text-black">{criticalCount}</p>
            <p className="mt-1 text-xs text-black/40">críticos</p>
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
      className="panel flex flex-col items-start gap-3 px-4 py-4 transition active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black text-white">
        <Icon className="size-4" />
      </span>
      <p className="text-sm font-bold text-black">{label}</p>
    </Link>
  );
}
