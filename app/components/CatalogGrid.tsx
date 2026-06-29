"use client";

import { useCallback, useMemo, useState } from "react";
import type { Product } from "@/app/lib/types";
import { groupProducts } from "@/app/lib/groupProducts";
import { ProductCard } from "./ProductCard";

interface CatalogGridProps {
  products: Product[];
  showPriceMayorista?: boolean;
}

function getIcon(cat: string): React.ReactElement {
  const lower = cat.toLowerCase();
  if (lower.includes("hoja"))   return <IcHoja />;
  if (lower.includes("vaina"))  return <IcVaina />;
  if (lower.includes("chaira")) return <IcChaira />;
  if (lower.includes("picnic") || lower.includes("juego") || lower.includes("caja") || lower.includes("set"))
    return <IcSet />;
  return <IcCuchillo />;
}

function shortLabel(cat: string): string {
  if (cat.length <= 22) return cat;
  const words = cat.split(/\s+/);
  let label = words[0];
  for (let i = 1; i < words.length; i++) {
    const next = `${label} ${words[i]}`;
    if (next.length > 20) break;
    label = next;
  }
  return label.length < cat.length ? label + "…" : label;
}

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function CatalogGrid({ products, showPriceMayorista }: CatalogGridProps) {
  const [filtro, setFiltro]     = useState<string>("destacados");
  const [busqueda, setBusqueda] = useState("");
  const [fading, setFading]     = useState(false);

  // Agrupar una sola vez cuando cambia el array de productos
  const grouped = useMemo(() => groupProducts(products), [products]);

  // Categorías únicas en el orden que aparecen en el catálogo
  const categorias = useMemo(() => {
    const seen = new Set<string>();
    for (const g of grouped) if (g.categoria) seen.add(g.categoria);
    return Array.from(seen);
  }, [grouped]);

  // Conteo por categoría sobre los grupos (no filas), respetando búsqueda
  const counts = useMemo(() => {
    const q = norm(busqueda);
    const base = q
      ? grouped.filter(
          (g) =>
            norm(g.nombre).includes(q) ||
            norm(g.categoria).includes(q),
        )
      : grouped;
    const c: Record<string, number> = {
      todos: base.length,
      destacados: base.filter((g) => g.destacado).length,
    };
    for (const g of base) c[g.categoria] = (c[g.categoria] ?? 0) + 1;
    return c;
  }, [grouped, busqueda]);

  const filtered = useMemo(() => {
    const q = norm(busqueda);
    let base =
      filtro === "todos"       ? grouped :
      filtro === "destacados"  ? grouped.filter((g) => g.destacado) :
      grouped.filter((g) => g.categoria === filtro);
    if (q) {
      base = base.filter(
        (g) =>
          norm(g.nombre).includes(q) ||
          norm(g.categoria).includes(q),
      );
    }
    return base;
  }, [filtro, grouped, busqueda]);

  const cambiarFiltro = useCallback(
    (cat: string) => {
      if (cat === filtro) return;
      setFading(true);
      setTimeout(() => {
        setFiltro(cat);
        setFading(false);
      }, 190);
    },
    [filtro],
  );

  const labelActivo = filtro === "todos" ? "Todos" : filtro;

  return (
    <div>
      {/* ── Buscador ────────────────────────────────────────── */}
      <div className="relative mb-5 group">
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "0 0 0 1px rgba(117,99,69,0.45), 0 0 20px rgba(117,99,69,0.08)" }}
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-500 group-focus-within:text-copper-400 transition-colors duration-200 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar pieza…"
          className="w-full bg-steel-900/70 border border-steel-700 focus:border-copper-600 rounded-xl pl-11 pr-10 py-3.5 text-sm text-steel-100 placeholder:text-steel-600 focus:outline-none transition-colors duration-200"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-steel-500 hover:text-steel-200 hover:bg-steel-700 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Filtros ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-2 min-w-max flex-wrap md:flex-wrap">
            <FilterPill
              active={filtro === "todos"}
              label="Todos"
              count={grouped.length}
              icon={<IcGrid />}
              title="Todos"
              onClick={() => cambiarFiltro("todos")}
            />
            <FilterPill
              active={filtro === "destacados"}
              label="Destacados"
              count={counts.destacados ?? 0}
              icon={<IcEstrella />}
              title="Destacados"
              onClick={() => cambiarFiltro("destacados")}
            />
            {categorias.map((cat) => (
              <FilterPill
                key={cat}
                active={filtro === cat}
                label={shortLabel(cat)}
                count={counts[cat] ?? 0}
                icon={getIcon(cat)}
                title={cat}
                onClick={() => cambiarFiltro(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Meta ────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-7">
        <span className="text-[11px] uppercase tracking-widest text-steel-500 whitespace-nowrap shrink-0">
          <span className="text-steel-300 font-medium">{filtered.length}</span>
          {" "}{filtered.length === 1 ? "modelo" : "modelos"}
          {busqueda && (
            <span className="text-copper-500 ml-1">· &ldquo;{busqueda}&rdquo;</span>
          )}
          {!busqueda && filtro !== "todos" && (
            <span className="text-copper-500 ml-1">· {shortLabel(labelActivo)}</span>
          )}
        </span>
        <div
          aria-hidden
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(117,99,69,0.18), transparent)" }}
        />
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3 text-steel-600">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="text-sm">
            {busqueda
              ? <>No se encontró &ldquo;<span className="text-steel-300">{busqueda}</span>&rdquo;</>
              : "No hay piezas en esta categoría."}
          </p>
        </div>
      ) : (
        <div
          className={[
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
            "transition-opacity duration-200",
            fading ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {filtered.map((g) => (
            <ProductCard
              key={g.key}
              product={g}
              showPriceMayorista={showPriceMayorista}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Pill reutilizable ──────────────────────────────────── */

interface FilterPillProps {
  active: boolean;
  label: string;
  count: number;
  icon: React.ReactElement;
  title: string;
  onClick: () => void;
}

function FilterPill({ active, label, count, icon, title, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={[
        "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0",
        "text-[11px] font-semibold uppercase tracking-widest",
        "transition-all duration-300 whitespace-nowrap",
        active
          ? "bg-copper-500 text-steel-950 shadow-[0_0_28px_-4px_rgba(117,99,69,0.50)]"
          : "bg-steel-900/70 border border-steel-700 text-steel-300 hover:border-copper-600/50 hover:text-copper-300",
      ].join(" ")}
    >
      <span className={active ? "text-steel-950" : "text-copper-500 group-hover:text-copper-300"}>
        {icon}
      </span>
      {label}
      <span
        className={[
          "px-1.5 py-px text-[10px] rounded-md tabular-nums font-mono",
          active ? "bg-steel-950/20 text-steel-900" : "bg-steel-800 text-steel-500",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

/* ── Íconos ─────────────────────────────────────────────── */

function IcGrid() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="0.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IcCuchillo() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 11.5 L9 3 C9.8 2 11.5 2 12 3 C12.5 4 11.5 5.5 10.5 6.5 L3 12.5 Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M1 11.5 L3 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IcHoja() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 12 L10 2.5 L12 4.5 L3.5 12.5"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 2.5 L12 2 L12 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IcVaina() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="3" y="1" width="7" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 4 L8 4 M5 6.5 L8 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IcChaira() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1 L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="6.5" cy="11.5" rx="2" ry="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 3.5 L6.5 2 L10 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcSet() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 10 L4.5 2 L5.5 2 L5.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7.5 2 L7.5 10 M10 2 C11.5 2 12 3 12 4.5 C12 6 11.5 7 10 7 L7.5 7"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IcEstrella() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M6.5 1.5 L7.7 4.8 L11.3 4.8 L8.4 6.9 L9.6 10.2 L6.5 8.1 L3.4 10.2 L4.6 6.9 L1.7 4.8 L5.3 4.8 Z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"
      />
    </svg>
  );
}
