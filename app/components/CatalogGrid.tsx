"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/app/lib/types";
import { ProductCard } from "./ProductCard";

const CATEGORIES: { value: ProductCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "asador", label: "Asador" },
  { value: "criollo", label: "Criollo" },
  { value: "cocina", label: "Cocina" },
  { value: "campo", label: "Campo" },
  { value: "tactico", label: "Táctico" },
  { value: "coleccion", label: "Colección" },
];

interface CatalogGridProps {
  products: Product[];
  showPriceMayorista?: boolean;
}

export function CatalogGrid({ products, showPriceMayorista }: CatalogGridProps) {
  const [filtro, setFiltro] = useState<ProductCategory | "todos">("todos");

  const filtered = useMemo(() => {
    if (filtro === "todos") return products;
    return products.filter((p) => p.categoria === filtro);
  }, [filtro, products]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFiltro(c.value)}
            className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all ${
              filtro === c.value
                ? "bg-copper-500 text-steel-950 font-semibold shadow-[0_0_20px_-4px_rgba(201,117,37,0.5)]"
                : "border border-steel-700 text-steel-300 hover:border-copper-500 hover:text-copper-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-steel-400 py-20">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              priceOverride={
                showPriceMayorista && p.precioMayorista ? p.precioMayorista : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
