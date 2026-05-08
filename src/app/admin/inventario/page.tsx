"use client";

import { Fragment, useMemo, useState } from "react";

import { PageHeader } from "@/components/admin/page-header";
import {
  getBuyQty,
  getStockLevel,
  inventory,
  type InventoryItem,
} from "@/lib/mock-data";

const categories = [...new Set(inventory.map((i) => i.category))];

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(inventory.map((i) => [i.id, i.currentStock]))
  );

  function updateStock(id: string, raw: number) {
    const value = Number.isNaN(raw) ? 0 : Math.max(0, raw);
    setStocks((prev) => ({ ...prev, [id]: value }));
  }

  const items = useMemo<InventoryItem[]>(
    () => inventory.map((i) => ({ ...i, currentStock: stocks[i.id] ?? i.currentStock })),
    [stocks]
  );

  const criticalCount = items.filter((i) => getStockLevel(i) === "crítico").length;
  const toBuyCount    = items.filter((i) => getBuyQty(i) > 0).length;

  return (
    <>
      <PageHeader title="Inventario" description="Stock actual del café" />

      <p className="mb-4 text-sm text-white/50">
        <span className="font-semibold text-white">{criticalCount}</span> críticos
        <span className="mx-2 text-white/25">·</span>
        <span className="font-semibold text-white">{toBuyCount}</span> por comprar
      </p>

      {categories.map((category) => {
        const catItems = items.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
              {category}
            </p>

            {/*
              Single grid on container — minmax(0,1fr) gives name column priority;
              auto columns size to content width across all rows.
            */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] overflow-hidden rounded-[16px] border border-black/10 bg-white">

              {/* Column headers */}
              <span className="border-b border-black/[0.07] pl-4 pr-2 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Producto</span>
              <span className="border-b border-black/[0.07] px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Actual</span>
              <span className="border-b border-black/[0.07] px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Ideal</span>
              <span className="border-b border-black/[0.07] pl-3 pr-4 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-black/35">Comprar</span>

              {catItems.map((item) => {
                const buyQty = getBuyQty(item);
                return (
                  <Fragment key={item.id}>
                    {/* Producto */}
                    <span className="flex min-w-0 items-center pl-4 pr-2 py-2.5">
                      <span className="truncate text-[0.8125rem] font-medium text-black">
                        {item.name}
                      </span>
                    </span>

                    {/* Actual */}
                    <div className="flex items-center gap-1 px-3 py-2.5">
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
                    <span className="flex items-center px-3 py-2.5 text-xs text-black/45">
                      {item.idealStock}&nbsp;{item.unit}
                    </span>

                    {/* Comprar */}
                    <span className={`flex items-center pl-3 pr-4 py-2.5 text-xs ${buyQty > 0 ? "font-semibold text-black" : "text-black/20"}`}>
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
