"use client";

import { useState } from "react";
import { useCart } from "@/app/components/CartProvider";
import { CatalogGrid } from "@/app/components/CatalogGrid";
import {
  loginMayoristaAction,
  verificarPasswordRaulAction,
  type LoginResult,
} from "./actions";
import type { Product } from "@/app/lib/types";
import {
  buildWhatsAppUrl,
  esRaul,
  formatARS,
  MENSAJE_SOLICITAR_ACCESO,
} from "@/app/lib/whatsapp";

// Marca este dispositivo como "ya verificado" para el ingreso de Raúl —
// así la contraseña solo se pide una vez por dispositivo, no en cada sesión.
const RAUL_TRUSTED_KEY = "galucho.raul.trusted.v1";

function esDispositivoConfiable(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(RAUL_TRUSTED_KEY) === "1";
}

export function MayoristasGate({ products }: { products: Product[] }) {
  const { isMayorista, mayorista, setMayorista, clear } = useCart();
  const [celular, setCelular] = useState("");
  const [passwordRaul, setPasswordRaul] = useState("");
  const [paso, setPaso] = useState<"celular" | "password">("celular");
  const [pendingSession, setPendingSession] = useState<LoginResult["session"] | null>(null);
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
      // A Raúl se le pide la contraseña una única vez por dispositivo antes
      // de darle acceso al panel de vendedor (remitos, agregar mayoristas).
      if (esRaul(result.session.celular ?? result.session.usuario) && !esDispositivoConfiable()) {
        setPendingSession(result.session);
        setPaso("password");
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

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("password", passwordRaul);
      const result = await verificarPasswordRaulAction(fd);
      if (!result.ok) {
        setError(result.error ?? "Contraseña incorrecta");
        return;
      }
      localStorage.setItem(RAUL_TRUSTED_KEY, "1");
      if (pendingSession) setMayorista(pendingSession);
      setCelular("");
      setPasswordRaul("");
      setPendingSession(null);
      setPaso("celular");
    } catch {
      setError("No pudimos validar la contraseña. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const volverACelular = () => {
    setPaso("celular");
    setPendingSession(null);
    setPasswordRaul("");
    setError(null);
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
              <p className="font-sans text-3xl font-bold tracking-tight text-gradient-copper tabular-nums">
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
          {paso === "celular" ? (
            <>
              <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-3">
                Acceso restringido
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-steel-50 leading-tight">
                Ingreso{" "}
                <em className="text-gradient-copper not-italic">mayorista</em>
              </h2>
              <p className="mt-3 text-sm text-steel-300">
                Ingresá tu número de celular para acceder al catálogo con precios
                mayoristas.
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

              {/* Solicitar acceso */}
              <div className="mt-8 pt-6 border-t border-steel-800 text-center">
                <p className="text-sm text-steel-300 mb-4">
                  ¿Todavía no tenés acceso mayorista?
                </p>
                <a
                  href={buildWhatsAppUrl(MENSAJE_SOLICITAR_ACCESO)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-wa-glow flex w-full items-center justify-center gap-2.5 rounded-md bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold uppercase tracking-widest text-sm py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.6 6.32A8 8 0 005.93 17.5l-1.18 4.31 4.41-1.16a8 8 0 008.43-13.32zm-5.6 12.3a6.65 6.65 0 01-3.38-.92l-.24-.14-2.62.69.7-2.56-.16-.26a6.65 6.65 0 1112.34-3.55 6.65 6.65 0 01-6.64 6.74zm3.64-4.97c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99a6 6 0 01-1.1-1.37c-.12-.2-.01-.31.09-.41.1-.1.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.34.05-.52.25s-.69.67-.69 1.65c0 .98.71 1.92.81 2.05.1.13 1.39 2.12 3.37 2.97.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
                  </svg>
                  Solicitar acceso
                </a>
                <p className="mt-3 text-xs text-steel-400">
                  Se abre WhatsApp con el pedido de acceso ya escrito.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-3">
                Panel de Raúl
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-steel-50 leading-tight">
                Confirmá tu{" "}
                <em className="text-gradient-copper not-italic">contraseña</em>
              </h2>
              <p className="mt-3 text-sm text-steel-300">
                Es la primera vez que entrás como Raúl desde este dispositivo.
                Se pide una sola vez — no se te va a volver a pedir acá salvo
                que uses otro celular o computadora.
              </p>

              <form onSubmit={onSubmitPassword} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-steel-300">
                    Contraseña
                  </span>
                  <input
                    type="password"
                    autoComplete="off"
                    autoFocus
                    value={passwordRaul}
                    onChange={(e) => setPasswordRaul(e.target.value)}
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
                  {loading ? "Verificando…" : "Confirmar"}
                </button>
                <button
                  type="button"
                  onClick={volverACelular}
                  className="w-full text-xs text-steel-400 hover:text-steel-200 transition-colors py-1"
                >
                  ‹ Volver
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
