"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  formatUnit,
  getBuyQty,
  getStockLevel,
  type InventoryItem,
} from "@/lib/mock-data";
import { resetInventoryStock, updateInventoryItem, updateInventoryStock } from "@/lib/supabase/inventory-writes";

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

function NumericInput({
  value,
  disabled,
  onChange,
  className,
}: {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  className?: string;
}) {
  const [raw, setRaw] = useState(() => String(value));
  const hasFocus = useRef(false);

  useEffect(() => {
    if (!hasFocus.current) setRaw(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={raw}
      disabled={disabled}
      onFocus={(e) => {
        hasFocus.current = true;
        if (raw === "0") e.target.select();
      }}
      onChange={(e) => {
        const str = e.target.value.replace(/[^0-9]/g, "");
        setRaw(str);
        if (str !== "") onChange(Math.max(0, Number(str)));
      }}
      onBlur={() => {
        hasFocus.current = false;
        const num = raw === "" || Number.isNaN(Number(raw)) ? 0 : Math.max(0, Number(raw));
        setRaw(String(num));
        onChange(num);
      }}
      className={className}
    />
  );
}

export default function InventoryClient({
  initialItems,
  canReset = false,
  canEditIdealStock = true,
  canEditName = true,
}: {
  initialItems: InventoryItem[];
  canReset?: boolean;
  canEditIdealStock?: boolean;
  canEditName?: boolean;
}) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [stocks, setStocks] = useState<Record<string, number>>(
    () => Object.fromEntries(initialItems.map((i) => [i.id, i.currentStock]))
  );
  const pendingWrites = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingFieldWrites = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  );

  function updateItemField(id: string, field: Exclude<keyof InventoryItem, "currentStock">, value: string | number | undefined) {
    if (field === "idealStock" && !canEditIdealStock) return;
    if (field === "name" && !canEditName) return;
    const normalized = field === "idealStock" ? Math.max(0, Number(value ?? 0)) : String(value ?? "");
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: normalized } : item
      )
    );

    const writeKey = `${id}:${field}`;
    clearTimeout(pendingFieldWrites.current[writeKey]);
    pendingFieldWrites.current[writeKey] = setTimeout(async () => {
      const saved = await updateInventoryItem(
        id,
        field === "idealStock" ? { idealStock: normalized as number } : { name: normalized as string }
      );
      if (!saved) alert("No se pudo guardar el cambio en el servidor.");
    }, 700);
  }

  function updateStock(id: string, raw: number) {
    const value = Number.isNaN(raw) ? 0 : Math.max(0, raw);
    setStocks((prev) => ({ ...prev, [id]: value }));

    clearTimeout(pendingWrites.current[id]);
    pendingWrites.current[id] = setTimeout(async () => {
      const saved = await updateInventoryStock(id, value);
      if (!saved) alert("No se pudo guardar el stock en el servidor.");
    }, 700);
  }

  async function resetCurrentQuantities() {
    const confirmed = window.confirm(
      "¿Reiniciar cantidades actuales?\nEsto pondrá todas las cantidades actuales en 0, pero conservará los valores ideales."
    );

    if (!confirmed) return;

    Object.values(pendingWrites.current).forEach(clearTimeout);
    pendingWrites.current = {};

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
        <button
          type="button"
          onClick={resetCurrentQuantities}
          className="mb-3 flex h-9 w-full items-center justify-center rounded-[14px] border border-white/15 bg-black text-sm font-medium text-neutral-400 transition hover:border-white/35 hover:text-white"
        >
          Reiniciar cantidades
        </button>
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

      <div className="lg:columns-2 lg:gap-x-5">
      {categories.map((category) => {
        const catItems = computedItems.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-3 lg:mb-5 lg:break-inside-avoid">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {category}
            </p>

            <div className="space-y-2 sm:hidden">
              {catItems.map((item) => {
                const buyQty = getBuyQty(item);
                return (
                  <div key={item.id} className="rounded-[18px] border border-black/10 bg-white p-3 text-black">
                    {canEditName ? (
                      <AutoResizeTextarea
                        value={item.name}
                        onChange={(value) => updateItemField(item.id, "name", value)}
                        className="block w-full resize-none bg-transparent border-0 p-0 text-base font-medium leading-5 break-words text-neutral-900 outline-none focus:ring-0"
                      />
                    ) : (
                      <p className="text-base font-medium leading-5 break-words text-neutral-900">{item.name}</p>
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-1">
                      <label className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Actual</span>
                        <span className="flex items-center gap-1">
                          <NumericInput
                            value={stocks[item.id] ?? item.currentStock}
                            onChange={(v) => updateStock(item.id, v)}
                            className="h-9 w-[72px] rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50"
                          />
                          <span className="text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                        </span>
                      </label>
                      <label className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Ideal</span>
                        <span className="flex items-center gap-1">
                          <NumericInput
                            value={item.idealStock}
                            disabled={!canEditIdealStock}
                            onChange={(v) => updateItemField(item.id, "idealStock", v)}
                            className="h-9 w-[72px] rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                        </span>
                      </label>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Comprar</span>
                        <div className={`flex h-9 items-center text-sm font-semibold ${buyQty > 0 ? "text-neutral-900" : "text-neutral-400"}`}>
                          {buyQty > 0 ? `+${buyQty} ${formatUnit(item.unit)}` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto rounded-[20px] border border-black/10 bg-white sm:block">
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
                        {canEditName ? (
                          <AutoResizeTextarea
                            value={item.name}
                            onChange={(value) => updateItemField(item.id, "name", value)}
                            className="block w-full resize-none bg-transparent border-0 p-0 text-base font-medium leading-5 break-words text-neutral-900 outline-none focus:ring-0"
                          />
                        ) : (
                          <p className="text-base font-medium leading-5 break-words text-neutral-900">{item.name}</p>
                        )}
                      </div>

                    <div className="flex items-center gap-0.5 border-b border-black/[0.04] px-2 py-2">
                      <NumericInput
                        value={stocks[item.id] ?? item.currentStock}
                        onChange={(v) => updateStock(item.id, v)}
                        className="h-8 w-12 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50"
                      />
                      <span className="text-sm font-normal text-neutral-400">{formatUnit(item.unit)}</span>
                    </div>

                    <span className="flex items-center flex-nowrap border-b border-black/[0.04] px-2 py-2 text-sm font-normal text-neutral-400">
                      <NumericInput
                        value={item.idealStock}
                        disabled={!canEditIdealStock}
                        onChange={(v) => updateItemField(item.id, "idealStock", v)}
                        className="h-8 w-12 rounded-[8px] border border-black/20 bg-white text-center text-base font-semibold text-neutral-900 outline-none focus:border-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </section>
  );
}
