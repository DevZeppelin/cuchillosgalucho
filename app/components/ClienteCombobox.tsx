"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AccesoWebContacto } from "@/app/lib/types";

/** Normaliza para buscar sin acentos ni mayúsculas. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Buscador con sugerencias para elegir un cliente registrado de ACCESOS_WEB.
 * Reemplaza al `<select>` nativo: al tipear las primeras letras del nombre,
 * la ciudad o el celular, filtra y sugiere. Al elegir uno, avisa por `onSelect`.
 */
export function ClienteCombobox({
  contactos,
  onSelect,
  onClear,
  seleccionadoLabel,
  inputClass,
  labelClass,
}: {
  contactos: AccesoWebContacto[];
  onSelect: (c: AccesoWebContacto) => void;
  onClear: () => void;
  seleccionadoLabel: string | null;
  inputClass: string;
  labelClass: string;
}) {
  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const resultados = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return contactos.slice(0, 8);
    const terminos = q.split(/\s+/);
    return contactos
      .filter((c) => {
        const heno = norm(`${c.nombre} ${c.ciudad} ${c.celular}`);
        return terminos.every((t) => heno.includes(t));
      })
      .slice(0, 8);
  }, [query, contactos]);

  // Cerrar al hacer click afuera
  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [abierto]);

  const elegir = (c: AccesoWebContacto) => {
    onSelect(c);
    setQuery("");
    setAbierto(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!abierto && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setAbierto(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (abierto && resultados[activo]) {
        e.preventDefault();
        elegir(resultados[activo]);
      }
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  };

  if (seleccionadoLabel) {
    return (
      <div className="block">
        <span className={labelClass}>Cliente registrado</span>
        <div className={`${inputClass} flex items-center justify-between gap-2`}>
          <span className="truncate">{seleccionadoLabel}</span>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs uppercase tracking-wide text-copper-600 dark:text-copper-300 hover:underline"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="block" ref={wrapRef}>
      <span className={labelClass}>Buscar cliente registrado</span>
      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder="Escribí el nombre, la ciudad o el celular…"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setActivo(0);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={abierto}
          aria-controls="cliente-combobox-lista"
          className={inputClass}
        />

        {abierto && (
          <ul
            id="cliente-combobox-lista"
            role="listbox"
            className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-stone-200 dark:border-steel-700 bg-white dark:bg-steel-900 shadow-xl"
          >
            {resultados.length === 0 ? (
              <li className="px-4 py-3 text-sm text-stone-400 dark:text-steel-400">
                Sin coincidencias — cargá los datos abajo a mano.
              </li>
            ) : (
              resultados.map((c, idx) => (
                <li
                  key={`${c.celular}-${idx}`}
                  role="option"
                  aria-selected={idx === activo}
                  onMouseEnter={() => setActivo(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    elegir(c);
                  }}
                  className={[
                    "cursor-pointer px-4 py-2.5 text-sm",
                    idx === activo
                      ? "bg-copper-500/10 text-stone-900 dark:text-steel-50"
                      : "text-stone-700 dark:text-steel-200",
                  ].join(" ")}
                >
                  <span className="font-medium">{c.nombre || "Sin nombre"}</span>
                  <span className="text-stone-400 dark:text-steel-400">
                    {c.ciudad ? ` · ${c.ciudad}` : ""} · {c.celular}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <span className="mt-1 block text-xs text-stone-400 dark:text-steel-400">
        {contactos.length} cliente{contactos.length !== 1 ? "s" : ""} registrado
        {contactos.length !== 1 ? "s" : ""}. Al elegir uno se completan los datos.
      </span>
    </div>
  );
}
