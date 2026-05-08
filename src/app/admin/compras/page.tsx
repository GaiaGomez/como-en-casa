"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { getBuyQty, inventory, type PurchaseStatus } from "@/lib/mock-data";

type ShopItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  buyQty: number;
};

const initialItems: ShopItem[] = inventory
  .filter((item) => getBuyQty(item) > 0)
  .map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    unit: item.unit,
    buyQty: getBuyQty(item),
  }));

const categories = [...new Set(initialItems.map((i) => i.category))];

export default function PurchasesPage() {
  const [statuses, setStatuses] = useState<Record<string, PurchaseStatus>>(
    () => Object.fromEntries(initialItems.map((i) => [i.id, "pendiente" as PurchaseStatus]))
  );

  const items = useMemo(
    () => initialItems.map((i) => ({ ...i, status: statuses[i.id] ?? ("pendiente" as PurchaseStatus) })),
    [statuses]
  );

  const pending   = items.filter((i) => i.status === "pendiente").length;
  const ordered   = items.filter((i) => i.status === "pedido").length;
  const delivered = items.filter((i) => i.status === "entregado").length;

  function toggleDone(id: string) {
    setStatuses((prev) => {
      const current = prev[id] ?? "pendiente";
      return { ...prev, [id]: current === "entregado" ? "pendiente" : "entregado" };
    });
  }

  function toggleOrdered(id: string) {
    setStatuses((prev) => {
      const current = prev[id] ?? "pendiente";
      if (current === "entregado") return prev;
      return { ...prev, [id]: current === "pedido" ? "pendiente" : "pedido" };
    });
  }

  return (
    <>
      <PageHeader title="Compras" description="Lo que hay que pedir" />

      <p className="mb-4 text-sm text-white/50">
        <span className="font-semibold text-white">{pending}</span> por pedir
        <span className="mx-2 text-white/25">·</span>
        <span className="font-semibold text-white">{ordered}</span> pedido
        <span className="mx-2 text-white/25">·</span>
        <span className="font-semibold text-white">{delivered}</span> entregado
      </p>

      {categories.map((category) => {
        const catItems = items.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
              {category}
            </p>
            <div className="overflow-hidden rounded-[16px] border border-black/10 bg-white">
              {catItems.map((item) => {
                const isDone    = item.status === "entregado";
                const isOrdered = item.status === "pedido";
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-2 transition-opacity ${isDone ? "opacity-40" : ""}`}
                  >
                    {/* Checkbox — toggles entregado */}
                    <button
                      type="button"
                      onClick={() => toggleDone(item.id)}
                      aria-label={isDone ? `Desmarcar ${item.name}` : `Marcar ${item.name} como entregado`}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2 transition-colors ${
                        isDone
                          ? "border-black bg-black"
                          : "border-black/25 bg-transparent hover:border-black/50"
                      }`}
                    >
                      {isDone && <Check className="size-2.5 stroke-[3] text-white" />}
                    </button>

                    {/* Name — tap to toggle pedido */}
                    <button
                      type="button"
                      onClick={() => toggleOrdered(item.id)}
                      className={`min-w-0 flex-1 text-left text-[0.8125rem] font-medium transition-colors ${
                        isDone ? "line-through text-black/35" : "text-black"
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      {isOrdered && (
                        <span className="ml-2 text-[0.65rem] font-normal text-black/35">pedido</span>
                      )}
                    </button>

                    {/* Qty */}
                    <span className="shrink-0 text-xs text-black/40">
                      {item.buyQty} {item.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
