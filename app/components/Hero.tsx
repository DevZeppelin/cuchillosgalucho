"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden flex items-center">
      {/* Fondo: gradiente + partículas de chispa */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(117,99,69,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_-10%,rgba(100,85,60,0.07),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,11,0)_0%,rgba(6,8,11,0.6)_70%,rgba(6,8,11,1)_100%)]" />
        {/* Líneas de grano */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 4px)",
          }}
        />
      </div>

      {/* Hoja de cuchillo SVG flotante */}
      <div
        className={`pointer-events-none absolute right-[-12%] md:right-[-6%] lg:right-[-2%] top-1/2 -translate-y-1/2 w-[90%] md:w-[70%] lg:w-[58%] xl:w-[52%] transition-all duration-1000 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        }`}
      >
        <BladeSvg />
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
              className="invert h-36 md:h-40 w-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.22)]"
            />
          </div>

          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-px w-12 bg-copper-400" />
            <span className="text-xs uppercase tracking-[0.35em] text-copper-300">
              Forja artesanal · Argentina
            </span>
          </div>

          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight transition-all duration-1000 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-steel-50">Cada filo</span>{" "}
            <em className="not-italic text-gradient-copper">cuenta una</em>{" "}
            <span className="text-gradient-steel italic">historia.</span>
          </h1>

          <p
            className={`mt-8 max-w-xl text-lg md:text-xl text-steel-200 leading-relaxed transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Cuchillos forjados a mano en Argentina. Acero Inoxidable 420 y maderas
            nobles argentinas. Piezas pensadas para durar generaciones.
          </p>

          <div
            className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="#catalogo"
              className="group relative bg-copper-500 hover:bg-copper-400 text-steel-950 font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 overflow-hidden  mt-28 md:mt-0"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              Ver catálogo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/nosotros"
              className="border border-steel-700 hover:border-copper-500 text-steel-100 uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all hover:bg-steel-900/60 inline-flex items-center justify-center"
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
            <Stat numero="40K+" texto="Seguidores en Instagram" />
            <Stat numero="100%" texto="Hecho a mano" />
            <Stat numero="+15" texto="Años forjando" />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-steel-400 text-xs uppercase tracking-widest flex flex-col items-center gap-2 opacity-70">
        <span>Deslizá</span>
        <span className="w-px h-12 bg-gradient-to-b from-copper-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function Stat({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="border-l border-copper-500/40 pl-4">
      <p className="font-display text-3xl md:text-4xl text-gradient-copper">{numero}</p>
      <p className="text-xs uppercase tracking-widest text-steel-300 mt-1 leading-tight">
        {texto}
      </p>
    </div>
  );
}

function BladeSvg() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full h-auto drop-shadow-[0_30px_60px_rgba(117,99,69,0.10)] animate-float"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1f2630" />
          <stop offset="35%" stopColor="#8a96a8" />
          <stop offset="55%" stopColor="#e8ecf2" />
          <stop offset="75%" stopColor="#8a96a8" />
          <stop offset="100%" stopColor="#1f2630" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2210" />
          <stop offset="40%" stopColor="#6e4520" />
          <stop offset="60%" stopColor="#8b5a2b" />
          <stop offset="100%" stopColor="#22140a" />
        </linearGradient>
        <linearGradient id="copperGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#97a4b4" />
          <stop offset="50%" stopColor="#4a5666" />
          <stop offset="100%" stopColor="#262d38" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hoja */}
      <path
        d="M 60 200 Q 80 170 130 165 L 480 178 Q 520 178 540 200 Q 520 222 480 222 L 130 235 Q 80 230 60 200 Z"
        fill="url(#bladeGrad)"
        filter="url(#glow)"
      />
      {/* Reflejo del filo */}
      <path
        d="M 90 198 Q 130 190 200 192 L 470 195 Q 510 195 525 200"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
        fill="none"
      />

      {/* Virola de acero */}
      <rect x="540" y="178" width="22" height="44" rx="3" fill="url(#copperGrad)" />
      <rect x="538" y="178" width="2" height="44" fill="#c4cdd8" opacity="0.6" />

      {/* Cabo de madera */}
      <path
        d="M 562 178 L 740 175 Q 760 175 760 200 Q 760 225 740 225 L 562 222 Z"
        fill="url(#woodGrad)"
      />
      {/* Vetas */}
      <path
        d="M 580 195 Q 660 192 740 196 M 580 205 Q 660 209 740 203"
        stroke="#22140a"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      {/* Remache */}
      <circle cx="680" cy="200" r="5" fill="url(#copperGrad)" />
      <circle cx="680" cy="200" r="2" fill="#c4cdd8" opacity="0.7" />

      {/* Cabeza de acero */}
      <path
        d="M 758 178 Q 778 178 778 200 Q 778 222 758 222 Z"
        fill="url(#copperGrad)"
      />
    </svg>
  );
}
