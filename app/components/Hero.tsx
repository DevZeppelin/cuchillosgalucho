"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden flex items-center">
      {/* Fondos y efectos de ambiente */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cálido radial inferior — cobre suave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(117,99,69,0.10),transparent_55%)]" />
        {/* Radial superior derecho */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_-10%,rgba(100,85,60,0.05),transparent_55%)]" />
        {/* Velo oscuro inferior — SOLO en dark mode */}
        <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(180deg,rgba(6,8,11,0)_0%,rgba(6,8,11,0.55)_65%,rgba(6,8,11,0.95)_100%)]" />
        {/* Velo claro inferior — SOLO en light mode */}
        <div className="absolute inset-0 dark:hidden bg-[linear-gradient(180deg,transparent_0%,rgba(245,240,232,0.25)_60%,rgba(245,240,232,0.70)_100%)]" />
        {/* Líneas de grano — adapta al modo */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply dark:mix-blend-overlay dark:opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(80,60,30,0.6) 0 1px, transparent 1px 4px)",
          }}
        />
      </div>

      {/* Cuchillo flotante — foto real (public/1.png) */}
      <div
        className={`pointer-events-none absolute right-[-14%] md:right-[-6%] lg:right-[-2%] top-[57%] -translate-y-1/2 w-[92%] md:w-[70%] lg:w-[58%] xl:w-[52%] transition-all duration-1000 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        }`}
      >
        <Image
          src="/1.png"
          alt="Cuchillo Galucho"
          width={900}
          height={600}
          priority
          className="w-full h-auto animate-float"
          style={{
            filter:
              "drop-shadow(0 16px 40px rgba(0,0,0,0.22)) drop-shadow(0 4px 12px rgba(117,99,69,0.08))",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full pt-4 md:pt-20 pb-24">
        <div className="max-w-3xl">
          {/* Logo prominente */}
          <div
            className={`mb-8 flex justify-center md:justify-start transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Image
              src="/logo.png"
              alt="Cuchillos Galucho"
              width={420}
              height={168}
              priority
              className="dark:invert h-36 md:h-40 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.10)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.18)]"
            />
          </div>

          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-px w-12 bg-copper-400" />
            <span className="text-xs uppercase tracking-[0.35em] text-copper-500 dark:text-copper-300">
              Herrería artesanal · Argentina
            </span>
          </div>

          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight transition-all duration-1000 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-stone-900 dark:text-steel-50">Cuchillos</span>{" "}
            <em className="not-italic text-gradient-copper">artesanales.</em>
          </h1>

          <p
            className={`mt-8 max-w-xl text-lg md:text-xl text-stone-600 dark:text-steel-200 leading-relaxed transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Garantía eterna para una hoja con historia. Te invitamos a formar
            parte de nuestra historia y llevar a tu mesa un pedazo de nuestra
            tradición.
          </p>

          <div
            className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="#catalogo"
              className="group relative bg-copper-500 hover:bg-copper-400 text-white font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 overflow-hidden mt-28 md:mt-0"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              Ver catálogo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/nosotros"
              className="border border-stone-300 dark:border-steel-700 hover:border-copper-400 text-stone-700 dark:text-steel-100 uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all hover:bg-stone-100/80 dark:hover:bg-steel-900/60 inline-flex items-center justify-center"
            >
              Conocé la historia
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`mt-16 grid grid-cols-3 gap-6 max-w-xl transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Stat numero="21K+" texto="Seguidores en Instagram" />
            <Stat numero="40K+" texto="Seguidores en TikTok" />
            <Stat numero="+11" texto="Años" />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400 dark:text-steel-400 text-xs uppercase tracking-widest flex flex-col items-center gap-2 opacity-60">
        <span>Deslizá</span>
        <span className="w-px h-12 bg-gradient-to-b from-copper-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function Stat({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="border-l border-copper-400/40 pl-4">
      <p className="font-display text-3xl md:text-4xl text-gradient-copper">
        {numero}
      </p>
      <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-steel-300 mt-1 leading-tight">
        {texto}
      </p>
    </div>
  );
}
