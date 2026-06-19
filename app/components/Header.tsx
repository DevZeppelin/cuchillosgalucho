"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

export function Header() {
  const { cantidad, toggle, isMayorista, mayorista, setMayorista } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCantidad = useRef(cantidad);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "Pop" visual cuando aumenta la cantidad
  useEffect(() => {
    if (cantidad > prevCantidad.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prevCantidad.current = cantidad;
      return () => clearTimeout(t);
    }
    prevCantidad.current = cantidad;
  }, [cantidad]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const nav = [
    { href: "/", label: "Inicio" },
    { href: "/#catalogo", label: "Catálogo" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/mayoristas", label: "Mayoristas" },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-steel-950/90 backdrop-blur-md border-b border-steel-800 shadow-[0_2px_30px_-12px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Cuchillos Galucho"
            width={120}
            height={48}
            priority
            className="invert h-10 lg:h-12 w-auto group-hover:scale-105 transition-transform"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm uppercase tracking-widest text-steel-200 hover:text-copper-400 transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-copper-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          {isMayorista && mayorista && (
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-[10px] uppercase tracking-widest text-copper-400">
                Mayorista
              </span>
              <button
                onClick={() => setMayorista(null)}
                className="text-xs text-steel-200 hover:text-copper-400 transition-colors"
                title="Cerrar sesión"
              >
                {mayorista.nombreComercial}
              </button>
            </div>
          )}

          <button
            onClick={toggle}
            className={`relative p-2 text-steel-100 hover:text-copper-400 transition-transform ${
              bump ? "animate-cart-bump" : ""
            }`}
            aria-label="Abrir carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3h2l2.4 12.3a2 2 0 002 1.7h7.7a2 2 0 002-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="21" r="1.2" fill="currentColor" />
              <circle cx="17" cy="21" r="1.2" fill="currentColor" />
            </svg>
            {cantidad > 0 && (
              <>
                <span
                  className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-copper-500 text-steel-950 text-[10px] font-bold flex items-center justify-center transition-transform duration-300 ${
                    bump ? "scale-125" : "scale-100"
                  } animate-glow-pulse`}
                >
                  {cantidad}
                </span>
                {bump && (
                  <span
                    aria-hidden
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-copper-400 animate-cart-ping"
                  />
                )}
              </>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-steel-100 hover:text-copper-400 transition-colors"
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
          menuOpen ? "max-h-96" : "max-h-0"
        } bg-steel-950/95 backdrop-blur-md border-b border-steel-800`}
      >
        <nav className="px-6 py-4 flex flex-col gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-steel-100 hover:text-copper-400 transition-colors uppercase text-sm tracking-widest border-b border-steel-800 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
