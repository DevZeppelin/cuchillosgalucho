"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";
import { formatARS } from "@/app/lib/whatsapp";
import type { Product } from "@/app/lib/types";

interface ProductCardProps {
  product: Product;
  priceOverride?: number;
  badge?: string;
}

export function ProductCard({ product, priceOverride, badge }: ProductCardProps) {
  const { add, isMayorista } = useCart();
  const precio = priceOverride
    ?? (isMayorista && product.precioMayorista
      ? product.precioMayorista
      : product.precio);

  return (
    <article className="group relative bg-steel-900/50 border border-steel-800 hover:border-copper-600/60 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-copper-900/20 hover:-translate-y-1">
      {/* halo */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-copper-500/20 via-transparent to-wood-700/10" />

      <div className="relative aspect-[4/3] overflow-hidden bg-steel-800">
        {product.imagen ? (
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-steel-500 text-sm">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-steel-950/90 via-steel-950/30 to-transparent" />

        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold bg-copper-500 text-steel-950 rounded-full shadow">
            {badge}
          </span>
        )}
        {product.destacado && !badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold bg-copper-500 text-steel-950 rounded-full shadow">
            Destacado
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[60%]">
          {product.materiales.slice(0, 3).map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-steel-950/70 backdrop-blur-sm text-steel-100 border border-steel-700 rounded-full"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl text-steel-50 leading-tight truncate">
              {product.nombre}
            </h3>
            <p className="text-xs uppercase tracking-widest text-copper-400 mt-1">
              {product.categoria} · hoja {product.hojaCm} cm
            </p>
          </div>
        </div>

        <p className="text-sm text-steel-300 line-clamp-2 leading-relaxed">
          {product.descripcionCorta}
        </p>

        <div className="flex items-end justify-between pt-2">
          <div>
            {isMayorista && product.precioMayorista && (
              <p className="text-[10px] uppercase tracking-widest text-copper-400">
                Precio mayorista
              </p>
            )}
            <p className="font-display text-2xl text-gradient-copper tabular-nums">
              {formatARS(precio)}
            </p>
          </div>
          <button
            onClick={() => add(product)}
            className="relative bg-copper-500 hover:bg-copper-400 text-steel-950 font-semibold text-xs uppercase tracking-widest px-4 py-2.5 rounded-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            aria-label={`Agregar ${product.nombre} al carrito`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
