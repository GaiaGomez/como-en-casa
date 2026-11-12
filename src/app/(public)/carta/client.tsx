"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import type { MenuGroup, MenuItem, MenuKind, MenuSection } from "@/lib/menu-data";
import { SCENES, sceneImage, sceneStone, type MenuScene } from "@/lib/menu-scenes";
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

  // Secciones visibles: mientras se busca, se busca en TODA la carta.
  const visible = useMemo(
    () => (searching ? filterMenu(sections, query) : sections.filter((s) => s.kind === kind)),
    [sections, kind, query, searching]
  );

  // Escenas con al menos una sección visible (cada escena = una foto de fondo).
  const scenes = useMemo(() => {
    const byId = new Map(visible.map((s) => [s.id, s]));
    return SCENES.map((sc) => ({ scene: sc, secs: sc.sections.map((id) => byId.get(id)).filter(Boolean) as MenuSection[] })).filter(
      (x) => x.secs.length > 0
    );
  }, [visible]);

  // ── Chip activo según el scroll (IntersectionObserver) ──
  useEffect(() => {
    if (searching) return;
    const els = visible.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
        else if (window.scrollY < 400 && visible[0]) setActive(visible[0].id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visible, searching]);

  // Mantiene visible el chip activo en la fila que se desliza (móvil).
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
    document.getElementById("carta-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ═══ Barra fija: Comer/Beber + buscador + categorías ═══ */}
      <div
        id="carta-top"
        className="sticky top-[73px] z-20 scroll-mt-[73px] border-b border-cec-ink/10 bg-[#f4efe8]/92 backdrop-blur-md sm:top-[81px] sm:scroll-mt-[81px]"
      >
        <div className="mx-auto max-w-6xl px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Selector Comer / Beber */}
            <div className="cec-cond cec-pop-sm flex rounded-full bg-[#f4efe8] p-[3px] text-[13px] font-semibold tracking-[0.18em]" role="tablist" aria-label="Tipo de carta">
              {(["comer", "beber"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={!searching && kind === k}
                  onClick={() => switchKind(k)}
                  className={cn(
                    "rounded-full px-4 py-1.5 transition-colors sm:px-5",
                    !searching && kind === k ? "bg-cec-ink text-[#f4efe8]" : "hover:bg-cec-ink/10"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Buscador: línea fina, como los subtítulos de la carta */}
            <label className="flex min-w-0 flex-1 items-center gap-2 border-b border-cec-ink/60 py-2 transition-colors focus-within:border-cec-ink">
              <Search className="size-4 shrink-0 text-cec-ink/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué se te antoja hoy?"
                className="w-full bg-transparent text-base outline-none placeholder:text-cec-ink/45 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
                aria-label="Buscar en la carta"
              />
              {searching && (
                <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="text-cec-ink/50 hover:text-cec-ink">
                  <X className="size-4" />
                </button>
              )}
            </label>
          </div>

          {/* Chips ovalados, como las etiquetas de la carta impresa */}
          {!searching && (
            <div
              ref={chipsRef}
              className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visible.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  data-id={s.id}
                  onClick={() => goTo(s.id)}
                  className={cn(
                    "cec-cond rounded-[50%] border px-4 py-1.5 text-[11.5px] font-semibold tracking-[0.16em] transition-colors",
                    active === s.id ? "border-cec-ink bg-cec-ink text-[#f4efe8]" : "border-cec-ink/35 hover:border-cec-ink"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Escenas con foto de fondo ═══ */}
      {scenes.length === 0 ? (
        <p className="mx-auto max-w-6xl px-4 py-24 text-center text-cec-ink-soft">
          Uy, no encontramos “{query}”.{" "}
          <button type="button" onClick={() => setQuery("")} className="cec-link font-medium text-cec-ink">
            Ver toda la carta
          </button>
        </p>
      ) : (
        scenes.map(({ scene, secs }) => <Scene key={scene.id} scene={scene} sections={secs} />)
      )}
    </>
  );
}

// ─── Una escena: foto de fondo + secciones encima ─────────────

function Scene({ scene, sections }: { scene: MenuScene; sections: MenuSection[] }) {
  // Variables CSS que usa .carta-scene (globals.css) para acomodar la foto.
  const style = {
    "--img": `url(${sceneImage(scene.id)})`,
    "--stone": `url(${sceneStone(scene.id)})`,
    "--freeY": scene.freeY,
  } as React.CSSProperties;

  return (
    <div
      className={cn("carta-scene", `text-${scene.textPos}`, `photo-${scene.photoSide}`, scene.centered && "centered", scene.dark && "dark")}
      style={style}
    >
      {/* Capa 1: la piedra limpia estirada por toda la pantalla */}
      <div className="carta-stone" aria-hidden="true" />
      {/* Capa 2: la foto original, fundida por los bordes */}
      <div className="carta-photo" aria-hidden="true" />

      {/* Capa 3: el texto */}
      <div className="carta-text">
        <div className="carta-col">
          {sections.map((s, i) => (
            <SectionBlock key={s.id} section={s} kicker={i === 0 ? scene.kicker : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section, kicker }: { section: MenuSection; kicker?: string }) {
  const items = section.groups.flatMap((g) => g.items ?? []);
  // Secciones de productos cortos (casi sin descripciones) → grupos en 2 columnas
  const twoCols = section.groups.length > 1 && items.filter((i) => i.description || i.options).length <= 1;

  return (
    <section
      id={section.id}
      // scroll-mt: al saltar con los chips, deja espacio para header + barra fija
      className="scroll-mt-[200px] [&+&]:mt-16"
    >
      {kicker && <p className="cec-cond mb-2 text-[12px] font-semibold tracking-[0.34em] opacity-75">{kicker}</p>}
      <h2 className="cec-display mb-3 text-[clamp(2.1rem,9vw,5.5rem)] [overflow-wrap:anywhere] md:text-[clamp(2.6rem,6vw,5.5rem)]">{section.title}</h2>
      {section.note && section.note !== kicker && <p className="mb-6 text-sm opacity-80">{section.note}</p>}

      <div className={cn("mt-6", twoCols && "sm:columns-2 sm:gap-x-10")}>
        {section.groups.map((group, gi) => (
          <Group key={group.title ?? gi} group={group} />
        ))}
      </div>

      {section.footnotes && (
        <p className="mt-4 text-xs leading-relaxed opacity-75">{section.footnotes.join(" · ")}</p>
      )}
    </section>
  );
}

function Group({ group }: { group: MenuGroup }) {
  const items = group.items ?? [];
  // Si 3+ productos cuestan lo mismo, el precio va una sola vez en un óvalo
  const shared = items.length >= 3 && items.every((i) => i.price === items[0].price) ? items[0].price : null;

  return (
    <div className="mb-8 break-inside-avoid">
      {group.title && (
        <p className="cec-cond mb-2 flex items-center gap-3 border-b border-current pb-1.5 text-[14px] font-semibold tracking-[0.2em]">
          {group.title}
          {shared && (
            <span className="rounded-[50%] border border-current px-3 py-0.5 font-sans text-[12px] font-semibold normal-case tracking-normal">
              {shared}
            </span>
          )}
        </p>
      )}
      {group.note && <p className="mb-2 text-sm leading-relaxed opacity-80">{group.note}</p>}

      {group.table && (
        <table className="cec-cond mb-2 w-full text-[16px] font-semibold">
          <thead>
            <tr className="text-[11px] opacity-70">
              <th className="pb-1 text-left font-medium">
                <span className="sr-only">Preparación</span>
              </th>
              {group.table.columns.map((c) => (
                <th key={c} className="pb-1 text-right font-medium tracking-[0.18em]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.table.rows.map((r) => (
              <tr key={r.name}>
                <td className="py-1.5">{r.name}</td>
                {r.prices.map((p, i) => (
                  <td key={i} className="py-1.5 text-right tabular-nums">
                    {p}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.map((item) => (
        <Item key={item.name} item={item} hidePrice={!!shared} />
      ))}
    </div>
  );
}

function Item({ item, hidePrice }: { item: MenuItem; hidePrice: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-5 py-2.5">
      <p className="cec-cond text-[17px] font-semibold">
        {item.name}
        {item.detail && <span className="ml-1.5 font-sans text-[14px] font-normal normal-case tracking-normal opacity-65">{item.detail}</span>}
      </p>
      {/* tabular-nums: los números ocupan el mismo ancho → precios alineados */}
      {!hidePrice && item.price && <p className="cec-cond text-right text-[17px] font-bold tabular-nums tracking-[0.04em]">{item.price}</p>}

      {(item.description || item.options) && (
        <div className="col-span-1 mt-0.5 text-[14px] leading-relaxed opacity-80">
          {item.description && <p>{item.description}</p>}
          {item.options && (
            <p className="mt-1">
              {item.options.map((o, i) => (
                <span key={o.name}>
                  {i > 0 && " · "}
                  <b className="font-semibold">{o.name}</b> {o.description}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
