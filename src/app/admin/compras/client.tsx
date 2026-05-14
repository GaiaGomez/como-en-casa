"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import {
  formatUnit,
  getBuyQty,
  type InventoryItem,
  type ManualShoppingItem,
} from "@/lib/mock-data";
import { updateInventoryStock } from "@/lib/supabase/inventory-writes";
import {
  completeManualShoppingItem,
  deleteManualShoppingItem,
  insertManualShoppingItem,
} from "@/lib/supabase/shopping-item-writes";

type ShopItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit: string;
  buyQty: number;
  source: "inventory";
  done: boolean;
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
      done: boolean;
    };

type GroupBy = "category" | "supplier";

export default function PurchasesPage({
  initialManualItems = [],
  initialInventory = [],
  canDelete = false,
  canAdd = true,
  canMarkBought = true,
}: {
  initialManualItems?: ManualShoppingItem[];
  initialInventory?: InventoryItem[];
  canDelete?: boolean;
  canAdd?: boolean;
  canMarkBought?: boolean;
}) {
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(initialInventory.map((i) => [i.id, i.currentStock]))
  );
  const [manualItems, setManualItems] = useState<ManualShoppingItem[]>(
    () => initialManualItems
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const inventoryItems = useMemo<ShopItem[]>(
    () =>
      initialInventory
        .map((item) => ({ ...item, currentStock: stocks[item.id] ?? item.currentStock }))
        .filter((item) => getBuyQty(item) > 0 || completedIds.has(item.id))
        .map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          supplier: item.supplier?.trim() || "Sin proveedor",
          unit: item.unit,
          buyQty: completedIds.has(item.id) ? item.idealStock - item.currentStock : getBuyQty(item),
          source: "inventory" as const,
          done: completedIds.has(item.id),
        })),
    [completedIds, initialInventory, stocks]
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
          done: completedIds.has(item.id),
        })),
    ],
    [completedIds, inventoryItems, manualItems]
  );

  const groups = useMemo(
    () => [...new Set(items.map((i) => (groupBy === "supplier" ? i.supplier : i.category)))],
    [groupBy, items]
  );

  async function completeItem(item: PendingShopItem) {
    if (!canMarkBought) return;
    setCompletedIds((current) => new Set(current).add(item.id));

    if (item.source === "inventory") {
      const inventoryItem = initialInventory.find((candidate) => candidate.id === item.id);
      if (inventoryItem) {
        setStocks((current) => ({ ...current, [item.id]: inventoryItem.idealStock }));
        const saved = await updateInventoryStock(item.id, inventoryItem.idealStock);
        if (!saved) alert("No se pudo guardar el stock en el servidor.");
      }
    } else {
      const saved = await completeManualShoppingItem(item.id);
      if (!saved) alert("No se pudo marcar el item como completado en el servidor.");
    }
  }

  async function deleteItem(id: string) {
    if (!canDelete) return;
    setManualItems((current) => current.filter((i) => i.id !== id));
    const deleted = await deleteManualShoppingItem(id);
    if (!deleted) alert("No se pudo eliminar el item del servidor.");
  }

  async function addManualItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAdd) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const quantity = Number(formData.get("quantity") ?? 0);
    const unit = String(formData.get("unit") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    if (!name || !unit || !Number.isFinite(quantity) || quantity <= 0) return;

    const tempId = `manual-${Date.now()}`;
    setManualItems((current) => [
      ...current,
      { id: tempId, name, quantity, unit, category: category || undefined, status: "pendiente" },
    ]);
    form.reset();

    const realId = await insertManualShoppingItem({ name, quantity, unit, category: category || undefined });
    if (realId) {
      setManualItems((current) =>
        current.map((i) => (i.id === tempId ? { ...i, id: realId } : i))
      );
    }
  }

  return (
    <section className="w-full lg:mx-auto lg:max-w-4xl xl:max-w-5xl">
      <div className="mb-3 grid grid-cols-2 gap-1.5 rounded-[18px] border border-white/10 bg-white/[0.03] p-1.5">
        {(["category", "supplier"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setGroupBy(mode)}
            className={`h-8 rounded-[12px] border px-3 text-sm font-medium leading-none transition ${
              groupBy === mode
                ? "border-white bg-white text-black"
                : "border-white/25 bg-black text-neutral-400 hover:border-white/50 hover:text-white"
            }`}
          >
            {mode === "category" ? "Categoría" : "Proveedor"}
          </button>
        ))}
      </div>

      <div className="lg:columns-2 lg:gap-x-5">
      {groups.map((group) => {
        const groupItems = items.filter((i) =>
          groupBy === "supplier" ? i.supplier === group : i.category === group
        );
        return (
          <section key={group} className="mb-3 lg:mb-5 lg:break-inside-avoid">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {group}
            </p>
            <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white">
              {groupItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-black/[0.05] px-4 py-3 leading-5 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => completeItem(item)}
                      aria-label={`Marcar ${item.name} como comprado`}
                      disabled={item.done || !canMarkBought}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        item.done
                          ? "border-black bg-black text-white"
                          : canMarkBought
                            ? "border-black/20 bg-white text-transparent hover:border-black/40"
                            : "border-black/10 bg-white text-transparent cursor-not-allowed"
                      }`}
                    >
                      <Check className="size-2.5 stroke-[3]" />
                    </button>

                    <p className={`min-w-0 flex-1 truncate text-left text-base font-medium leading-5 ${item.done ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                      {item.name}
                    </p>

                    <span className={`shrink-0 text-sm font-normal ${item.done ? "text-neutral-400 line-through" : "text-neutral-400"}`}>
                      {item.buyQty} {formatUnit(item.unit)}
                    </span>

                    {canDelete && item.source === "manual" && (
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-300 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      </div>

      {items.length === 0 ? (
        <section className="rounded-[16px] border border-white/10 px-4 py-6 text-center text-sm font-normal text-neutral-400">
          Sin compras pendientes
        </section>
      ) : null}

      {canAdd ? (
        <form
          onSubmit={addManualItem}
          className="mt-3 grid grid-cols-[minmax(0,1fr)_72px_72px] gap-1.5 rounded-[20px] border border-black/10 bg-white p-2 sm:grid-cols-[minmax(0,1fr)_88px_88px_120px_auto] lg:grid-cols-[minmax(220px,1fr)_96px_96px_160px_auto] lg:gap-2"
        >
          <input
            name="name"
            placeholder="Item manual"
            className="h-9 min-w-0 rounded-[10px] border border-black/20 bg-white px-2 text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black"
          />
          <input
            name="quantity"
            type="number"
            min={0}
            step={1}
            placeholder="Cant."
            className="h-9 min-w-0 rounded-[10px] border border-black/20 bg-white px-2 text-base font-semibold text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black"
          />
          <input
            name="unit"
            placeholder="Und."
            className="h-9 min-w-0 rounded-[10px] border border-black/20 bg-white px-2 text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black"
          />
          <input
            name="category"
            placeholder="Categoría"
            className="col-span-2 h-9 min-w-0 rounded-[10px] border border-black/20 bg-white px-2 text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black sm:col-span-1"
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center gap-1 rounded-[10px] bg-black px-3 text-sm font-medium text-white hover:bg-black/85"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </form>
      ) : (
        <p className="mt-3 text-center text-xs font-normal text-neutral-400">Solo lectura</p>
      )}
    </section>
  );
}
