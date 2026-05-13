"use client";

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  formatUnit,
  getBuyQty,
  getStockLevel,
  type InventoryItem,
} from "@/lib/mock-data";
import { resetInventoryStock } from "@/lib/supabase/inventory-writes";

function AutoResizeTextarea({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      wrap="soft"
      value={value}
      onChange={(e) => {
        const textarea = e.currentTarget;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        onChange(textarea.value);
      }}
      className={className}
      style={{ height: "auto", minHeight: "1.5rem", whiteSpace: "pre-wrap" }}
    />
  );
}

export default function InventoryClient({
  initialItems,
  canReset = false,
}: {
  initialItems: InventoryItem[];
  canReset?: boolean;
}) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(initialItems.map((i) => [i.id, i.currentStock]))
  );

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  );

  function updateItemField(id: string, field: Exclude<keyof InventoryItem, "currentStock">, value: string | number | undefined) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "idealStock"
                  ? Math.max(0, Number(value ?? 0))
                  : String(value ?? ""),
            }
          : item
      )
    );
  }

  function updateStock(id: string, raw: number) {
    const value = Number.isNaN(raw) ? 0 : Math.max(0, raw);
    setStocks((prev) => ({ ...prev, [id]: value }));
  }

  async function resetCurrentQuantities() {
    const confirmed = window.confirm(
      "¿Reiniciar cantidades actuales?\nEsto pondrá todas las cantidades actuales en 0, pero conservará los valores ideales."
    );

    if (!confirmed) return;

    setStocks(Object.fromEntries(items.map((item) => [item.id, 0])));

    const saved = await resetInventoryStock();
    if (!saved) {
      alert("No se pudo guardar el reinicio en el servidor. Los valores se restaurarán al recargar.");
    }
  }

  const computedItems = useMemo<InventoryItem[]>(
    () => items.map((i) => ({ ...i, currentStock: stocks[i.id] ?? i.currentStock })),
    [items, stocks]
  );

  const criticalCount = computedItems.filter((i) => getStockLevel(i) === "crítico").length;
  const toBuyCount = computedItems.filter((i) => getBuyQty(i) > 0).length;

  return (
    <section className="w-full lg:mx-auto lg:max-w-5xl xl:max-w-6xl">
      {canReset && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={resetCurrentQuantities}
            className="inline-flex h-9 items-center justify-center rounded-[10px] border border-white/25 bg-black px-3 text-sm font-medium text-neutral-400 transition hover:border-white/50 hover:text-white"
          >
            Reiniciar cantidades
          </button>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Críticos</p>
          <p className="mt-1 text-3xl font-bold leading-none text-white">{criticalCount}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Por comprar</p>
          <p className="mt-1 text-3xl font-bold leading-none text-white">{toBuyCount}</p>
        </div>
      </div>

      {categories.map((category) => {
        const catItems = computedItems.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {category}
            </p>

            <div className="space-y-2 sm:hidden">
              {catItems.map((item) => {
                const buyQty = getBuyQty(item);
                return (
                  <div key={item.id} className="rounded-[18px] border border-black/10 bg-white p-3 text-black">
                    <AutoResizeTextarea
                      value={item.name}
                      onChange={(value) => updateItemField(item.id, "name", value)}
                      className="block w-full resize-none bg-transparent border-0 p-0 text-base font-medium leading-5 break-words text-neutral-900 outline-none focus:ring-0"
                    />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <label className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Actual</span>
                        <span className="mt-1 flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={stocks[item.id] ?? item.currentStock}
                            onChange={(e) => updateStock(item.id, Number(e.target.value))}
                            className="h-9 min-w-0 flex-1 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <span className="shrink-0 text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                        </span>
                      </label>
                      <label className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Ideal</span>
                        <span className="mt-1 flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={item.idealStock}
                            onChange={(e) => updateItemField(item.id, "idealStock", Number(e.target.value))}
                            className="h-9 min-w-0 flex-1 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <span className="shrink-0 text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                        </span>
                      </label>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Comprar</span>
                        <span className={`mt-2 block truncate text-sm font-normal ${buyQty > 0 ? "text-neutral-900" : "text-neutral-400"}`}>
                          {buyQty > 0 ? `+${buyQty} ${formatUnit(item.unit)}` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto rounded-[20px] border border-black/10 bg-white sm:block" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
              <div className="grid min-w-[520px] items-start grid-cols-[minmax(180px,1fr)_96px_96px_120px] overflow-hidden lg:min-w-0 lg:grid-cols-[minmax(280px,1fr)_96px_96px_128px]">

                <span className="border-b border-black/[0.07] pl-4 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Producto</span>
                <span className="border-b border-black/[0.07] px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Actual</span>
                <span className="border-b border-black/[0.07] px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Ideal</span>
                <span className="border-b border-black/[0.07] pl-2 pr-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Comprar</span>

                {catItems.map((item) => {
                  const buyQty = getBuyQty(item);
                  return (
                    <Fragment key={item.id}>
                      <div className="min-w-0 border-b border-black/[0.04] py-2 pl-4 pr-2">
                        <AutoResizeTextarea
                          value={item.name}
                          onChange={(value) => updateItemField(item.id, "name", value)}
                          className="block w-full resize-none bg-transparent border-0 p-0 text-base font-medium leading-5 break-words text-neutral-900 outline-none focus:ring-0"
                        />
                      </div>

                    <div className="flex items-center gap-0.5 border-b border-black/[0.04] px-2 py-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={stocks[item.id] ?? item.currentStock}
                        onChange={(e) => updateStock(item.id, Number(e.target.value))}
                        className="h-8 w-12 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                    </div>

                    <span className="flex items-center flex-nowrap border-b border-black/[0.04] px-2 py-2 text-sm font-normal text-neutral-400">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.idealStock}
                        onChange={(e) => updateItemField(item.id, "idealStock", Number(e.target.value))}
                        className="h-8 w-12 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="ml-1">{formatUnit(item.unit)}</span>
                    </span>

                    <span className={`flex items-center border-b border-black/[0.04] py-2 pl-2 pr-3 text-sm font-normal ${buyQty > 0 ? "text-neutral-900" : "text-neutral-400"}`}>
                      {buyQty > 0 ? `+${buyQty} ${formatUnit(item.unit)}` : "—"}
                    </span>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </section>
  );
}
