"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import {
  calculateTipDistribution,
  formatCurrency,
  getWeekTotalDays,
} from "@/lib/mock-data";

export function TipCalculator() {
  const [totalTips, setTotalTips] = useState(1280000);
  const [saved, setSaved] = useState(false);
  const distribution = useMemo(
    () => calculateTipDistribution(totalTips),
    [totalTips]
  );
  const totalDays = getWeekTotalDays();
  const distributed = distribution.reduce((sum, item) => sum + item.amount, 0);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
      <div className="panel p-4 space-y-3">
        <div className="space-y-2">
          <label htmlFor="totalTips" className="text-xs font-medium text-gray-500">
            Propinas
          </label>
          <input
            id="totalTips"
            type="number"
            min={0}
            step={1000}
            value={totalTips}
            onChange={(event) => setTotalTips(Number(event.target.value))}
            className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm font-semibold text-black outline-none focus:border-black/40"
          />
        </div>

        <div className="grid gap-3">
          <div className="border-b border-black/[0.08] py-2">
            <p className="text-sm text-gray-500">Días</p>
            <p className="mt-1 text-xl font-semibold text-black">{totalDays}</p>
          </div>
          <div className="border-b border-black/[0.08] py-2">
            <p className="text-sm text-gray-500">Reparto</p>
            <p className="mt-1 text-xl font-semibold text-black">
              {formatCurrency(distributed)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-[10px] bg-black text-sm font-semibold text-white disabled:opacity-80"
        >
          {saved ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <RotateCcw className="size-4" />
          )}
          {saved ? "Guardado" : "Guardar semana"}
        </button>
      </div>

      <section className="space-y-3">
        {distribution.map((item) => (
          <div
            key={item.employee.id}
            className="panel p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-black">{item.employee.name}</p>
                <p className="text-sm text-gray-500">{item.daysWorked} días</p>
              </div>
              <span className="tag shrink-0">Pendiente</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-black">
              {formatCurrency(item.amount)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
