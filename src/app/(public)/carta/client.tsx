"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";

import { Reveal } from "@/components/public/reveal";
import type { MenuGroup, MenuItem, MenuKind, MenuSection } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

// ─── Búsqueda ─────────────────────────────────────────────────

/** Pasa a minúsculas y quita tildes: "Albóndigas" → "albondigas". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function itemMatches(item: MenuItem, q: string) {
  const haystack = [item.name, item.description, item.detail, ...(item.options ?? []).flatMap((o) => [o.name, o.description])]
    .filter(Boolean)
    .join(" ");
  return normalize(haystack).includes(q);
}

/**
 * Filtra la carta según el texto buscado.
 * - Si el título de la sección o del grupo coincide, se muestra completo.
 * - Si no, solo quedan los productos que coinciden.
 * Devuelve solo las secciones con algún resultado.
 */
function filterMenu(sections: MenuSection[], query: string): MenuSection[] {
  const q = normalize(query.trim());
  if (!q) return sections;

  return sections.flatMap((section) => {
    if (normalize(section.title).includes(q)) return [section];

    const groups = section.groups.flatMap((group): MenuGroup[] => {
      if (group.title && normalize(group.title).includes(q)) return [group];
      if (group.table) {
        const rows = group.table.rows.filter((r) => normalize(r.name).includes(q));
        return rows.length ? [{ ...group, table: { ...group.table, rows } }] : [];
      }
      const items = (group.items ?? []).filter((it) => itemMatches(it, q));
      return items.length ? [{ ...group, items }] : [];
    });

    return groups.length ? [{ ...section, groups, footnotes: undefined }] : [];
  });
}

// ─── Componente principal ─────────────────────────────────────

export function CartaClient({ sections }: { sections: MenuSection[] }) {
  const [kind, setKind] = useState<MenuKind>("comer");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const chipsRef = useRef<HTMLDivElement>(null);

  const searching = query.trim().length > 0;

  // Mientras se busca, se busca en TODA la carta (comer + beber).
  const visible = useMemo(
    () => (searching ? filterMenu(sections, query) : sections.filter((s) => s.kind === kind)),
    [sections, kind, query, searching]
  );

  // ── Categoría activa según el scroll ──
  // IntersectionObserver avisa qué sección está cruzando una franja
  // horizontal de la pantalla; esa se marca como activa en los chips.
  useEffect(() => {
    if (searching) return;
    const els = visible.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
        // Arriba de todo (antes de la primera sección) se marca la primera.
        else if (window.scrollY < 400 && visible[0]) setActive(visible[0].id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visible, searching]);

  // Mantiene visible el chip activo cuando la fila de chips se desplaza de lado (móvil).
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    chip?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function switchKind(next: MenuKind) {
    setKind(next);
    setQuery("");
    setActive(sections.find((s) => s.kind === next)?.id ?? "");
    // Vuelve al inicio de la carta al cambiar entre Comer y Beber
    document.getElementById("carta-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ═══ Barra fija: Comer/Beber + buscador + categorías ═══ */}
      <div
        id="carta-top"
        className="sticky top-[73px] z-20 -mx-4 scroll-mt-[73px] border-b border-cec-ink/10 bg-white/95 px-4 py-4 backdrop-blur-md sm:top-[81px] sm:-mx-6 sm:scroll-mt-[81px] sm:px-6 lg:-mx-8 lg:px-8"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector Comer / Beber */}
          <div className="flex rounded-full bg-neutral-100 p-1 text-sm font-medium" role="tablist" aria-label="Tipo de carta">
            {(["comer", "beber"] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={!searching && kind === k}
                onClick={() => switchKind(k)}
                className={cn(
                  "rounded-full px-4 py-2 capitalize transition-colors sm:px-5",
                  !searching && kind === k ? "bg-cec-ink text-white" : "text-cec-ink hover:bg-white"
                )}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-cec-ink/15 px-4 py-2.5 transition-colors focus-within:border-cec-ink/40">
            <Search className="size-4 shrink-0 text-cec-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca en la carta…"
              className="w-full bg-transparent text-base outline-none placeholder:text-cec-ink/40 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              aria-label="Buscar en la carta"
            />
            {searching && (
              <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="text-cec-ink/50 hover:text-cec-ink">
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        {/* Chips de categorías (se ocultan mientras se busca) */}
        {!searching && (
          <div
            ref={chipsRef}
            className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((s) => (
              <button
                key={s.id}
                type="button"
                data-id={s.id}
                onClick={() => goTo(s.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 transition-colors",
                  active === s.id
                    ? "border-cec-ink bg-cec-ink text-white"
                    : "border-cec-ink/15 hover:border-cec-ink/40"
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Secciones ═══ */}
      {visible.length === 0 ? (
        <p className="py-24 text-center text-cec-ink-soft">
          No encontramos “{query}” en la carta.{" "}
          <button type="button" onClick={() => setQuery("")} className="cec-link font-medium text-cec-ink">
            Ver toda la carta
          </button>
        </p>
      ) : (
        visible.map((section, i) => (
          <SectionBlock key={section.id} section={section} index={i} flip={i % 2 === 1} />
        ))
      )}
    </>
  );
}

// ─── Una sección de la carta ──────────────────────────────────

function SectionBlock({ section, index, flip }: { section: MenuSection; index: number; flip: boolean }) {
  return (
    <section
      id={section.id}
      // scroll-mt: al saltar con los chips, deja espacio para header + barra fija
      className={cn(
        "grid scroll-mt-[230px] gap-8 border-b border-cec-ink/10 py-14 last:border-0 sm:scroll-mt-[225px] md:gap-12 md:py-16",
        flip ? "md:grid-cols-[7fr_5fr]" : "md:grid-cols-[5fr_7fr]"
      )}
    >
      {/* Tarjeta con foto: se queda fija mientras bajas por la lista (desktop) */}
      <div className={cn("self-start md:sticky md:top-[240px]", flip && "md:order-2")}>
        <Reveal>
          <div className={cn("rounded-[22px] p-3", section.accent)}>
            {section.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  // sizes le dice a Next qué tamaño real tendrá la imagen →
                  // genera una versión liviana adecuada para cada pantalla.
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className={cn("flex items-baseline justify-between gap-4 px-3 pt-4", section.note ? "pb-1" : "pb-2", !section.image && "pt-8")}>
              <h2 className="cec-display text-3xl sm:text-4xl">{section.title}</h2>
              <span className="text-xs font-medium tracking-[0.2em] text-cec-ink/45">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            {section.note && <p className="px-3 pb-2 text-sm text-cec-ink/65">{section.note}</p>}
          </div>
        </Reveal>
      </div>

      {/* Lista de productos */}
      <div className={cn(flip && "md:order-1")}>
        {section.groups.map((group, gi) => (
          <Group key={group.title ?? gi} group={group} first={gi === 0} />
        ))}
        {section.footnotes && (
          <ul className="mt-6 space-y-1 rounded-2xl bg-neutral-50 p-5 text-xs leading-relaxed text-cec-ink-soft">
            {section.footnotes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Group({ group, first }: { group: MenuGroup; first: boolean }) {
  const items = group.items ?? [];
  // Si los productos no tienen descripción y sus nombres son cortos, van en 2 columnas (más compacto).
  const compact =
    items.length > 3 && items.every((it) => !it.description && !it.options && it.name.length <= 28);

  return (
    <div className={cn(!first && "mt-10")}>
      {group.title && (
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cec-ink-soft">{group.title}</p>
      )}
      {group.note && <p className="mt-2 text-sm text-cec-ink-soft">{group.note}</p>}

      {group.table && (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-xs text-cec-ink/50">
              <th className="pb-2 text-left font-normal">
                <span className="sr-only">Preparación</span>
              </th>
              {group.table.columns.map((c) => (
                <th key={c} className="pb-2 text-right font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.table.rows.map((r) => (
              <tr key={r.name} className="border-t border-cec-ink/10">
                <td className="py-3 font-medium">{r.name}</td>
                {r.prices.map((p, i) => (
                  <td key={i} className="py-3 text-right font-medium tabular-nums">
                    {p}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length > 0 && (
        <div className={cn(group.title && "mt-1", compact && "sm:grid sm:grid-cols-2 sm:gap-x-10")}>
          {items.map((item) => (
            <Item key={item.name} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Item({ item }: { item: MenuItem }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-cec-ink/[0.08] py-4 last:border-0">
      <p className="font-medium">
        {item.name}
        {item.detail && <span className="font-normal text-cec-ink/45"> · {item.detail}</span>}
      </p>
      {/* tabular-nums: los números ocupan el mismo ancho → precios alineados */}
      {item.price && <p className="whitespace-nowrap text-right font-medium tabular-nums">{item.price}</p>}

      {(item.description || item.options) && (
        <div className="col-span-1 text-sm leading-relaxed text-cec-ink-soft">
          {item.description && <p>{item.description}</p>}
          {item.options && (
            <ul className="mt-2 space-y-1">
              {item.options.map((o) => (
                <li key={o.name}>
                  <span className="text-cec-ink">{o.name}</span> — {o.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
