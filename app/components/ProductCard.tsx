"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatARS } from "@/app/lib/whatsapp";
import type { GroupedProduct, SizeOption } from "@/app/lib/types";

interface ProductCardProps {
  product: GroupedProduct;
  showPriceMayorista?: boolean;
  badge?: string;
}

export function ProductCard({ product, showPriceMayorista, badge }: ProductCardProps) {
  const { add, isMayorista } = useCart();
  const [selectedSize, setSelectedSize] = useState<SizeOption>(product.sizes[0]);
  const [imgError, setImgError] = useState(false);

  const useLogo = imgError || !product.imagen || product.imagen === "/logo.png";

  const useMayPrice = (showPriceMayorista || isMayorista) && selectedSize.precioMayorista;
  const precio = useMayPrice ? selectedSize.precioMayorista! : selectedSize.precio;

  function handleAdd() {
    add({
      id: selectedSize.id,
      slug: `${product.slug}-${selectedSize.cm || selectedSize.medida}`,
      nombre:
        product.sizes.length > 1
          ? `${product.nombre} · ${selectedSize.medida}`
          : product.nombre,
      categoria: product.categoria,
      descripcionCorta: selectedSize.medida,
      descripcionLarga: "",
      precio: selectedSize.precio,
      precioMayorista: selectedSize.precioMayorista,
      hojaCm: selectedSize.cm,
      materiales: product.materiales,
      imagen: product.imagen,
      destacado: product.destacado,
      stock: selectedSize.stock,
    });
  }

  return (
    <article className="group relative bg-steel-900/50 border border-steel-800 hover:border-copper-600/60 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-copper-900/20 hover:-translate-y-1 flex flex-col">
      {/* halo */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-copper-500/20 via-transparent to-wood-700/10" />

      {/* ── Imagen ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-steel-900 shrink-0">
        {useLogo ? (
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <Image
              src="/logo.png"
              alt="Cuchillos Galucho"
              fill
              className="object-contain opacity-15 transition-opacity duration-500 group-hover:opacity-25"
            />
          </div>
        ) : (
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        )}

        {!useLogo && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-steel-950/90 via-steel-950/30 to-transparent" />
        )}

        {/* Badge */}
        {(badge || product.destacado) && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold bg-copper-500 text-steel-950 rounded-full shadow">
            {badge ?? "Destacado"}
          </span>
        )}

        {/* Materiales */}
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

      {/* ── Contenido ──────────────────────────────────────── */}
      <div className="relative p-5 flex flex-col gap-3 flex-1">
        {/* Nombre y categoría */}
        <div>
          <h3 className="font-display text-xl text-steel-50 leading-tight">
            {product.nombre}
          </h3>
          <p className="text-xs uppercase tracking-widest text-copper-400 mt-0.5">
            {product.categoria}
          </p>
        </div>

        {/* ── Selector de medidas ──────────────────────────── */}
        {product.sizes.length > 1 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-steel-500 mb-2">
              Medida
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => {
                const active = s.id === selectedSize.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    className={[
                      "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200",
                      active
                        ? "bg-copper-500 text-steel-950 shadow-[0_0_12px_-2px_rgba(201,117,37,0.5)]"
                        : "bg-steel-800 text-steel-300 border border-steel-700 hover:border-copper-600/50 hover:text-copper-300",
                    ].join(" ")}
                  >
                    {s.medida}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Precio y agregar ─────────────────────────────── */}
        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            {useMayPrice && (
              <p className="text-[10px] uppercase tracking-widest text-copper-400">
                Precio mayorista
              </p>
            )}
            {selectedSize.precio > 0 ? (
              <p className="font-display text-2xl text-gradient-copper tabular-nums">
                {formatARS(precio!)}
              </p>
            ) : (
              <p className="text-sm text-steel-500 italic">Consultar precio</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="relative bg-copper-500 hover:bg-copper-400 text-steel-950 font-semibold text-xs uppercase tracking-widest px-4 py-2.5 rounded-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
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
