"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { buildOrderMessage, buildWhatsAppUrl, formatARS } from "@/app/lib/whatsapp";

export function CartDrawer() {
  const { items, isOpen, close, setCantidad, remove, total, isMayorista, mayorista, clear } =
    useCart();

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleEnviarPedido = () => {
    if (items.length === 0) return;
    const msg = buildOrderMessage({
      items,
      mayorista: mayorista
        ? { nombreComercial: mayorista.nombreComercial, usuario: mayorista.usuario }
        : undefined,
    });
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  if (!isOpen && items.length === 0) {
    // No render del drawer cuando está cerrado y vacío (evita peso innecesario)
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-steel-950/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrito"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-steel-900 border-l border-steel-700 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-steel-700">
          <div>
            <h2 className="font-display text-2xl text-steel-50">Tu pedido</h2>
            {isMayorista && (
              <p className="text-xs uppercase tracking-widest text-copper-400 mt-0.5">
                Precios mayoristas
              </p>
            )}
          </div>
          <button
            onClick={close}
            className="text-steel-300 hover:text-copper-400 transition-colors p-2 -m-2"
            aria-label="Cerrar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-steel-300">
              <div className="w-20 h-20 rounded-full border border-steel-700 flex items-center justify-center text-copper-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l2.4 12.3a2 2 0 002 1.7h7.7a2 2 0 002-1.6L21 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="21" r="1.2" fill="currentColor" />
                  <circle cx="17" cy="21" r="1.2" fill="currentColor" />
                </svg>
              </div>
              <p className="font-display text-xl text-steel-100">Tu carrito está vacío</p>
              <p className="text-sm">Explorá el catálogo y armá tu pedido.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-lg bg-steel-800/60 border border-steel-700 hover:border-copper-600/50 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-steel-700 flex-shrink-0">
                    {item.product.imagen && (
                      <Image
                        src={item.product.imagen}
                        alt={item.product.nombre}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-steel-50 truncate">
                      {item.product.nombre}
                    </h3>
                    <p className="text-xs text-steel-300 mt-0.5">
                      Hoja {item.product.hojaCm} cm
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-steel-700 rounded">
                        <button
                          onClick={() => setCantidad(item.product.id, item.cantidad - 1)}
                          className="px-2 py-0.5 text-steel-300 hover:text-copper-400 transition-colors"
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm tabular-nums text-steel-50">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => setCantidad(item.product.id, item.cantidad + 1)}
                          className="px-2 py-0.5 text-steel-300 hover:text-copper-400 transition-colors"
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-copper-300 tabular-nums">
                        {formatARS(item.precioUnit * item.cantidad)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.product.id)}
                    className="text-steel-400 hover:text-red-400 transition-colors p-1 -m-1 self-start"
                    aria-label="Quitar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-steel-700 px-6 py-5 space-y-4 bg-steel-900">
            <div className="flex justify-between items-baseline">
              <span className="text-steel-300 uppercase text-xs tracking-widest">
                Total
              </span>
              <span className="font-display text-3xl text-gradient-copper tabular-nums">
                {formatARS(total)}
              </span>
            </div>
            <button
              onClick={handleEnviarPedido}
              className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 6.32A8 8 0 005.93 17.5l-1.18 4.31 4.41-1.16a8 8 0 008.43-13.32zm-5.6 12.3a6.65 6.65 0 01-3.38-.92l-.24-.14-2.62.69.7-2.56-.16-.26a6.65 6.65 0 1112.34-3.55 6.65 6.65 0 01-6.64 6.74zm3.64-4.97c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99a6 6 0 01-1.1-1.37c-.12-.2-.01-.31.09-.41.1-.1.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.34.05-.52.25s-.69.67-.69 1.65c0 .98.71 1.92.81 2.05.1.13 1.39 2.12 3.37 2.97.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full text-xs text-steel-400 hover:text-steel-200 transition-colors"
            >
              Vaciar carrito
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
