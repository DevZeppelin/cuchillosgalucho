"use client";

import { useState } from "react";
import { useCart } from "@/app/components/CartProvider";
import { CatalogGrid } from "@/app/components/CatalogGrid";
import { loginMayoristaAction } from "./actions";
import type { Product } from "@/app/lib/types";
import { formatARS } from "@/app/lib/whatsapp";

export function MayoristasGate({ products }: { products: Product[] }) {
  const { isMayorista, mayorista, setMayorista, clear } = useCart();
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("celular", celular);
      const result = await loginMayoristaAction(fd);
      if (!result.ok || !result.session) {
        setError(result.error ?? "Error al validar el acceso");
        return;
      }
      setMayorista(result.session);
      setCelular("");
    } catch {
      setError("No pudimos validar el acceso. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Vista logueado ──────────────────────────────────────── */
  if (isMayorista && mayorista) {
    const ahorroTotal = products.reduce((sum, p) => {
      if (!p.precioMayorista) return sum;
      return sum + (p.precio - p.precioMayorista);
    }, 0);

    return (
      <div className="space-y-12">
        {/* Bienvenida */}
        <div className="relative rounded-2xl overflow-hidden border border-copper-600/40 p-8 md:p-10 wood-texture">
          <div className="absolute inset-0 bg-gradient-to-r from-steel-950/95 via-steel-950/80 to-steel-950/50" />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-2">
                Sesión activa
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-steel-50">
                Bienvenido,{" "}
                <em className="text-gradient-copper not-italic">
                  {mayorista.mail ?? mayorista.nombreComercial}
                </em>
              </h2>
              <p className="mt-3 text-steel-300 text-sm">
                Estás viendo el catálogo con precios mayoristas exclusivos.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <p className="text-xs uppercase tracking-widest text-steel-300">
                Ahorro estimado en catálogo
              </p>
              <p className="font-display text-3xl text-gradient-copper">
                {formatARS(ahorroTotal)}
              </p>
              <button
                onClick={() => {
                  clear();
                  setMayorista(null);
                }}
                className="text-xs uppercase tracking-widest text-steel-300 hover:text-copper-400 transition-colors border border-steel-700 hover:border-copper-500 rounded-md px-4 py-2"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Catálogo mayorista */}
        <div>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-3">
              Catálogo mayorista
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-steel-50">
              Tu lista de{" "}
              <em className="text-gradient-copper not-italic">precios</em>
            </h3>
          </div>
          <CatalogGrid products={products} showPriceMayorista />
        </div>
      </div>
    );
  }

  /* ── Formulario de acceso ────────────────────────────────── */
  return (
    <div className="max-w-md mx-auto">
      <div className="relative rounded-2xl bg-steel-900/60 border border-steel-800 p-8 md:p-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-copper-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-wood-700/30 rounded-full blur-3xl" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-3">
            Acceso restringido
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-steel-50 leading-tight">
            Ingreso{" "}
            <em className="text-gradient-copper not-italic">mayorista</em>
          </h2>
          <p className="mt-3 text-sm text-steel-300">
            Ingresá tu número de celular para acceder. ¿Aún no tenés acceso?{" "}
            <a
              href="https://wa.me/5492241672338?text=Hola%2C%20quiero%20pedir%20acceso%20mayorista"
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper-400 hover:text-copper-300 underline"
            >
              Pedilo por WhatsApp
            </a>
            .
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-steel-300">
                Celular
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={celular}
                autoComplete="tel"
                placeholder="1112345678"
                onChange={(e) => setCelular(e.target.value)}
                className="mt-2 w-full bg-steel-950/70 border border-steel-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/30 outline-none rounded-md px-4 py-3 text-steel-50 placeholder:text-steel-600 transition-all"
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-3 py-2 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-copper-500 hover:bg-copper-400 disabled:opacity-60 disabled:cursor-not-allowed text-steel-950 font-semibold uppercase tracking-widest text-sm py-3.5 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? "Verificando…" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
