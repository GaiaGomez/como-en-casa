"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import {
  getBuyQty,
  inventory,
  manualShoppingItems,
  type ManualShoppingItem,
} from "@/lib/mock-data";

type ShopItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  buyQty: number;
  source: "inventory";
};

type PendingShopItem =
  | ShopItem
  | {
      id: string;
      name: string;
      category: string;
      supplier: string;
      unit: string;
      buyQty: number;
      source: "manual";
    };

type GroupBy = "category" | "supplier";

export default function PurchasesPage() {
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(inventory.map((i) => [i.id, i.currentStock]))
  );
  const [manualItems, setManualItems] = useState<ManualShoppingItem[]>(
    () => manualShoppingItems
  );

  const inventoryItems = useMemo<ShopItem[]>(
    () =>
      inventory
        .map((item) => ({ ...item, currentStock: stocks[item.id] ?? item.currentStock }))
        .filter((item) => getBuyQty(item) > 0)
        .map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          supplier: item.supplier?.trim() || "Sin proveedor",
          unit: item.unit,
          buyQty: getBuyQty(item),
          source: "inventory" as const,
        })),
    [stocks]
  );

  const items = useMemo<PendingShopItem[]>(
    () => [
      ...inventoryItems,
      ...manualItems
        .filter((item) => item.status === "pendiente")
        .map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category?.trim() || "Manual",
          supplier: "Sin proveedor",
          unit: item.unit,
          buyQty: item.quantity,
          source: "manual" as const,
        })),
    ],
    [inventoryItems, manualItems]
  );

  const groups = useMemo(
    () => [...new Set(items.map((i) => (groupBy === "supplier" ? i.supplier : i.category)))],
    [groupBy, items]
  );

  function completeItem(item: PendingShopItem) {
    if (item.source === "inventory") {
      const inventoryItem = inventory.find((candidate) => candidate.id === item.id);
      if (!inventoryItem) return;
      setStocks((current) => ({ ...current, [item.id]: inventoryItem.idealStock }));
      return;
    }

    setManualItems((current) => current.filter((manualItem) => manualItem.id !== item.id));
  }

  function addManualItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const quantity = Number(formData.get("quantity") ?? 0);
    const unit = String(formData.get("unit") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    if (!name || !unit || !Number.isFinite(quantity) || quantity <= 0) return;

    setManualItems((current) => [
      ...current,
      {
        id: `manual-${Date.now()}`,
        name,
        quantity,
        unit,
        category: category || undefined,
        status: "pendiente",
      },
    ]);
    form.reset();
  }

  return (
    <>
      <PageHeader title="Compras" />

      <div className="mb-3 flex items-center gap-2">
        {(["category", "supplier"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setGroupBy(mode)}
            className={`rounded-[10px] border px-3 py-1.5 text-sm font-medium leading-none transition ${
              groupBy === mode
                ? "border-white bg-white text-black"
                : "border-white/15 text-white/50 hover:text-white/80"
            }`}
          >
            {mode === "category" ? "Categoría" : "Proveedor"}
          </button>
        ))}
      </div>

      {groups.map((group) => {
        const groupItems = items.filter((i) =>
          groupBy === "supplier" ? i.supplier === group : i.category === group
        );
        return (
          <section key={group} className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
              {group}
            </p>
            <div className="overflow-hidden rounded-[16px] border border-black/10 bg-white">
              {groupItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => completeItem(item)}
                      aria-label={`Marcar ${item.name} como comprado`}
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2 border-black/25 bg-transparent transition-colors hover:border-black/50"
                    >
                      <Check className="size-2.5 stroke-[3] text-transparent" />
                    </button>

                    <p className="min-w-0 flex-1 text-left text-[0.8125rem] font-medium text-black">
                      <span className="truncate">{item.name}</span>
                    </p>

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

      {items.length === 0 ? (
        <section className="rounded-[16px] border border-white/10 px-4 py-6 text-center text-sm text-white/45">
          Sin compras pendientes
        </section>
      ) : null}

      <form
        onSubmit={addManualItem}
        className="mt-3 grid grid-cols-[minmax(0,1fr)_72px_72px] gap-1.5 rounded-[16px] border border-black/10 bg-white p-2 sm:grid-cols-[minmax(0,1fr)_88px_88px_120px_auto]"
      >
        <input
          name="name"
          placeholder="Item manual"
          className="h-8 min-w-0 rounded-[10px] border border-black/10 bg-black/[0.03] px-2 text-sm font-medium text-black outline-none placeholder:text-black/30 focus:border-black/25 focus:bg-white"
        />
        <input
          name="quantity"
          type="number"
          min={0}
          step={1}
          placeholder="Cant."
          className="h-8 min-w-0 rounded-[10px] border border-black/10 bg-black/[0.03] px-2 text-sm font-medium text-black outline-none placeholder:text-black/30 focus:border-black/25 focus:bg-white"
        />
        <input
          name="unit"
          placeholder="Und."
          className="h-8 min-w-0 rounded-[10px] border border-black/10 bg-black/[0.03] px-2 text-sm font-medium text-black outline-none placeholder:text-black/30 focus:border-black/25 focus:bg-white"
        />
        <input
          name="category"
          placeholder="Categoría"
          className="col-span-2 h-8 min-w-0 rounded-[10px] border border-black/10 bg-black/[0.03] px-2 text-sm font-medium text-black outline-none placeholder:text-black/30 focus:border-black/25 focus:bg-white sm:col-span-1"
        />
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center gap-1 rounded-[10px] bg-black px-3 text-sm font-semibold text-white hover:bg-black/85"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </form>
    </>
  );
}
