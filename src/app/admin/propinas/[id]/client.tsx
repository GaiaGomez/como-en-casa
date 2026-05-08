"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Wallet } from "lucide-react";

import {
  calculateTipDistribution,
  currentWorkWeek,
  employees,
  formatCurrency,
  getPaymentSummary,
  getWeekLabel,
  type PaymentStatus,
  type TipWeek,
} from "@/lib/mock-data";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value);
}

function parseDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${days[date.getDay()]} ${day}/${String(month).padStart(2, "0")}`;
}

export function TipDetailClient({ week }: { week: TipWeek }) {
  const [payments, setPayments] = useState<Record<string, PaymentStatus>>(week.payments);
  const [dailyTips, setDailyTips] = useState<Record<string, number>>(week.dailyTips);

  const totalTips = Object.values(dailyTips).reduce((sum, v) => sum + v, 0);
  const activeTeam = employees.filter((employee) => employee.status === "activo");
  const distribution = calculateTipDistribution(totalTips, payments, currentWorkWeek, activeTeam);
  const summary = getPaymentSummary(payments);

  const sortedDays = Object.entries(dailyTips).sort(([a], [b]) => a.localeCompare(b));

  function togglePayment(employeeId: string) {
    setPayments((current) => ({
      ...current,
      [employeeId]: current[employeeId] === "pagado" ? "pendiente" : "pagado",
    }));
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-white/55">
          Semana {getWeekLabel(week.startDate, week.endDate)}
        </p>
        <Link
          href="/admin/propinas"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[10px] border border-black/20 bg-white px-3 text-sm font-medium text-black transition-colors hover:border-black/40"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </div>

      {/* Summary */}
      <section className="panel flex items-center justify-between gap-4 px-4 py-3">
        <p className="text-2xl font-bold text-black">{formatCurrency(totalTips)}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="tag">{summary.paid} pagados</span>
          <span className="tag">{summary.pending} pendientes</span>
        </div>
      </section>

      {/* Daily tips — editable */}
      <section className="mt-3 panel overflow-hidden">
        {sortedDays.map(([date, amount], idx) => (
          <div
            key={date}
            className={`flex items-center gap-3 px-4 py-2.5 ${idx > 0 ? "border-t border-black/[0.07]" : ""}`}
          >
            <p className="flex-1 text-sm text-black/45">{parseDayLabel(date)}</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-black/45 select-none">$</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-24 rounded-lg border border-black/20 bg-white px-2 py-1 text-right text-sm font-semibold text-black focus:border-black focus:outline-none sm:w-28"
                value={String(dailyTips[date] ?? 0)}
                onChange={(event) => {
                  const value = Number(event.target.value.replace(/\D/g, ""));
                  setDailyTips((current) => ({
                    ...current,
                    [date]: Number.isFinite(value) ? value : 0,
                  }));
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Employee list — compact rows inside one panel */}
      <section className="mt-3 panel overflow-hidden">
        {distribution.map((item, idx) => {
          const isPaid = item.paymentStatus === "pagado";
          return (
            <div
              key={item.employee.id}
              className={`flex items-center gap-3 px-4 py-3 ${idx > 0 ? "border-t border-black/[0.07]" : ""}`}
            >
              {/* Name + days */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black">{item.employee.name}</p>
                <p className="text-xs text-black/45">{item.daysWorked} días</p>
              </div>

              {/* Amount */}
              <p className="shrink-0 text-base font-bold text-black">{formatCurrency(item.amount)}</p>

              {/* Pay toggle */}
              <button
                type="button"
                onClick={() => togglePayment(item.employee.id)}
                className={`shrink-0 inline-flex h-8 items-center gap-1.5 rounded-[10px] px-3 text-xs font-semibold transition-colors ${
                  isPaid
                    ? "border border-black/20 bg-white text-black hover:border-black/40"
                    : "border border-black bg-black text-white hover:bg-black/85"
                }`}
              >
                {isPaid ? <CheckCircle2 className="size-3.5" /> : <Wallet className="size-3.5" />}
                {isPaid ? "Listo" : "Pagar"}
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
}
