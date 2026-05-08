"use client";

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  getBuyQty,
  getStockLevel,
  inventory,
  type InventoryItem,
} from "@/lib/mock-data";

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

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(inventory.map((i) => [i.id, i.currentStock]))
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

  const computedItems = useMemo<InventoryItem[]>(
    () => items.map((i) => ({ ...i, currentStock: stocks[i.id] ?? i.currentStock })),
    [items, stocks]
  );

  const criticalCount = computedItems.filter((i) => getStockLevel(i) === "crítico").length;
  const toBuyCount = computedItems.filter((i) => getBuyQty(i) > 0).length;

  return (
    <>
      <p className="mb-4 text-sm text-white/50">
        <span className="font-semibold text-white">{criticalCount}</span> críticos
        <span className="mx-2 text-white/25">·</span>
        <span className="font-semibold text-white">{toBuyCount}</span> por comprar
      </p>

      {categories.map((category) => {
        const catItems = computedItems.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-3">
            <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white/50">
              {category}
            </p>

            {/*
              Single grid on container — minmax(0,1fr) gives name column priority;
              auto columns size to content width across all rows.
            */}
            <div className="grid items-start grid-cols-[minmax(0,1fr)_auto_auto_auto] overflow-hidden rounded-[16px] border border-black/10 bg-white">

              {/* Column headers */}
              <span className="border-b border-black/[0.07] pl-4 pr-2 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Producto</span>
              <span className="border-b border-black/[0.07] px-2 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Actual</span>
              <span className="border-b border-black/[0.07] px-2 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Ideal</span>
              <span className="border-b border-black/[0.07] pl-2 pr-3 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Comprar</span>

              {catItems.map((item) => {
                const buyQty = getBuyQty(item);
                return (
                  <Fragment key={item.id}>
                    {/* Producto */}
                    <div className="min-w-0 pl-4 pr-2 py-1">
                      <AutoResizeTextarea
                        value={item.name}
                        onChange={(value) => updateItemField(item.id, "name", value)}
                        className="block w-full resize-none bg-transparent border-0 p-0 text-[0.8125rem] leading-4 break-words font-medium text-black outline-none focus:ring-0"
                      />
                    </div>

                    {/* Actual */}
                    <div className="flex items-center gap-0.5 px-2 py-1">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={stocks[item.id] ?? item.currentStock}
                        onChange={(e) => updateStock(item.id, Number(e.target.value))}
                        className="h-7 w-10 rounded-[8px] border border-black/20 bg-white text-center text-xs font-bold text-black outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-[0.65rem] text-black/45">{item.unit}</span>
                    </div>

                    {/* Ideal */}
                    <span className="flex items-center flex-nowrap px-2 py-1 text-xs text-black/45">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.idealStock}
                        onChange={(e) => updateItemField(item.id, "idealStock", Number(e.target.value))}
                        className="h-7 w-10 rounded-[8px] border border-black/20 bg-white text-center text-xs text-black outline-none focus:border-black/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="ml-1">{item.unit}</span>
                    </span>

                    {/* Comprar */}
                    <span className={`flex items-center pl-2 pr-3 py-1 text-xs ${buyQty > 0 ? "font-semibold text-black" : "text-black/20"}`}>
                      {buyQty > 0 ? `+${buyQty} ${item.unit}` : "—"}
                    </span>
                  </Fragment>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
