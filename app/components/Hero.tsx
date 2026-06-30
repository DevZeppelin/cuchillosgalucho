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

      {/* Cuchillo SVG flotante — posición un poco más baja */}
      <div
        className={`pointer-events-none absolute right-[-14%] md:right-[-6%] lg:right-[-2%] top-[57%] -translate-y-1/2 w-[92%] md:w-[70%] lg:w-[58%] xl:w-[52%] transition-all duration-1000 ${
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
              Forja artesanal · Argentina
            </span>
          </div>

          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight transition-all duration-1000 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-stone-900 dark:text-steel-50">Cada filo</span>{" "}
            <em className="not-italic text-gradient-copper">cuenta una</em>{" "}
            <span className="text-gradient-steel italic">historia.</span>
          </h1>

          <p
            className={`mt-8 max-w-xl text-lg md:text-xl text-stone-600 dark:text-steel-200 leading-relaxed transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Cuchillos forjados a mano en Argentina. Acero Inoxidable 420 y cabos en
            materiales nobles. Piezas pensadas para durar generaciones.
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
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <Stat numero="40K+" texto="Seguidores en Instagram" />
            <Stat numero="100%" texto="Hecho a mano" />
            <Stat numero="+15" texto="Años forjando" />
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
      <p className="font-display text-3xl md:text-4xl text-gradient-copper">{numero}</p>
      <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-steel-300 mt-1 leading-tight">
        {texto}
      </p>
    </div>
  );
}

function BladeSvg() {
  return (
    <svg
      viewBox="0 0 880 280"
      className="w-full h-auto animate-float"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.22)) drop-shadow(0 4px 12px rgba(117,99,69,0.08))" }}
    >
      <defs>
        {/* Gradiente de hoja — vertical, de spine a filo */}
        <linearGradient id="hg-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0c1420" />
          <stop offset="12%"  stopColor="#3a4a5e" />
          <stop offset="26%"  stopColor="#8ca0b8" />
          <stop offset="42%"  stopColor="#d4e2f0" />
          <stop offset="56%"  stopColor="#9ab0c4" />
          <stop offset="70%"  stopColor="#4a5e72" />
          <stop offset="84%"  stopColor="#b8ccd8" />
          <stop offset="100%" stopColor="#dceaf4" />
        </linearGradient>

        {/* Shimmer horizontal sobre la hoja */}
        <linearGradient id="hg-shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
          <stop offset="45%"  stopColor="rgba(255,255,255,0.03)" />
          <stop offset="70%"  stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>

        {/* Virola / bolster */}
        <linearGradient id="hg-bolster" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6a8098" />
          <stop offset="22%"  stopColor="#b4c8d8" />
          <stop offset="42%"  stopColor="#dceaf6" />
          <stop offset="60%"  stopColor="#a4b8c8" />
          <stop offset="100%" stopColor="#30404e" />
        </linearGradient>

        {/* Cabo — madera cálida */}
        <linearGradient id="hg-handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#281408" />
          <stop offset="20%"  stopColor="#4e2a10" />
          <stop offset="45%"  stopColor="#6e3e1c" />
          <stop offset="55%"  stopColor="#7c4a22" />
          <stop offset="78%"  stopColor="#5a3214" />
          <stop offset="100%" stopColor="#1c0e06" />
        </linearGradient>

        {/* Remaches */}
        <radialGradient id="hg-pin" cx="35%" cy="35%" r="65%">
          <stop offset="0%"  stopColor="#6a8098" />
          <stop offset="40%" stopColor="#1a2530" />
          <stop offset="100%" stopColor="#0c1420" />
        </radialGradient>

        {/* Filtro glow para el filo */}
        <filter id="hg-edge-glow">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Hoja principal ────────────────────────────────── */}
      <path
        d="M 76 145
           Q 420 118 612 110
           L 636 106 L 636 204
           Q 420 214 76 155
           Z"
        fill="url(#hg-blade)"
      />

      {/* Shimmer sobre la hoja */}
      <path
        d="M 76 145
           Q 420 118 612 110
           L 636 106 L 636 204
           Q 420 214 76 155
           Z"
        fill="url(#hg-shimmer)"
      />

      {/* Sombra del lomo (parte superior oscura) */}
      <path
        d="M 76 146 Q 380 122 610 112"
        stroke="rgba(4,10,18,0.55)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Línea de lomo — highlight metálico */}
      <path
        d="M 100 144 Q 400 122 604 113"
        stroke="rgba(140,170,195,0.5)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Fuller (canaleta) */}
      <path
        d="M 210 150 Q 430 138 596 134"
        stroke="rgba(6,12,20,0.72)"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Fuller — reflejo superior */}
      <path
        d="M 210 149 Q 430 137 596 133"
        stroke="rgba(150,190,220,0.22)"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Filo — línea brillante del corte */}
      <path
        d="M 82 154 Q 310 212 520 214 Q 590 214 636 202"
        stroke="rgba(210,238,255,0.80)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        filter="url(#hg-edge-glow)"
      />

      {/* ── Virola / bolster ───────────────────────────────── */}
      <path
        d="M 612 108 L 638 104 L 638 206 L 612 204 Z"
        fill="url(#hg-bolster)"
      />
      {/* Virola — línea izquierda brillante */}
      <line x1="612" y1="108" x2="612" y2="204" stroke="#a0bcd0" strokeWidth="1.6" opacity="0.85" />
      {/* Virola — línea derecha oscura */}
      <line x1="637" y1="104" x2="637" y2="206" stroke="#1e2c3a" strokeWidth="1" opacity="0.7" />
      {/* Virola — banda central reflectante */}
      <rect x="620" y="104" width="9" height="102" fill="rgba(210,238,255,0.16)" />

      {/* ── Cabo ──────────────────────────────────────────── */}
      <path
        d="M 638 106 L 856 108 Q 872 108 872 155 Q 872 202 856 202 L 638 206 Z"
        fill="url(#hg-handle)"
      />

      {/* Vetas de madera */}
      <g opacity="0.38" stroke="#120a04" strokeWidth="0.85">
        <line x1="650" y1="106" x2="650" y2="206" />
        <line x1="666" y1="106" x2="666" y2="206" />
        <line x1="684" y1="106" x2="684" y2="206" />
        <line x1="704" y1="106" x2="704" y2="206" />
        <line x1="726" y1="106" x2="726" y2="206" />
        <line x1="750" y1="107" x2="750" y2="205" />
        <line x1="776" y1="107" x2="776" y2="205" />
        <line x1="804" y1="108" x2="804" y2="204" />
        <line x1="836" y1="108" x2="836" y2="203" />
      </g>

      {/* Brillo superior del cabo */}
      <path
        d="M 642 113 Q 750 109 852 111 Q 864 111 868 118"
        stroke="rgba(160,110,55,0.20)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Sombra inferior del cabo */}
      <path
        d="M 642 199 Q 750 203 852 201"
        stroke="rgba(8,4,2,0.42)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Remaches (3) ──────────────────────────────────── */}
      <circle cx="700" cy="156" r="8.5" fill="#16222e" stroke="#7a98b0" strokeWidth="1.3" />
      <circle cx="700" cy="156" r="4.5" fill="url(#hg-pin)" />
      <circle cx="697" cy="153" r="2.2" fill="rgba(210,235,255,0.52)" />

      <circle cx="756" cy="156" r="8.5" fill="#16222e" stroke="#7a98b0" strokeWidth="1.3" />
      <circle cx="756" cy="156" r="4.5" fill="url(#hg-pin)" />
      <circle cx="753" cy="153" r="2.2" fill="rgba(210,235,255,0.52)" />

      <circle cx="812" cy="156" r="8.5" fill="#16222e" stroke="#7a98b0" strokeWidth="1.3" />
      <circle cx="812" cy="156" r="4.5" fill="url(#hg-pin)" />
      <circle cx="809" cy="153" r="2.2" fill="rgba(210,235,255,0.52)" />

      {/* ── Pomo / cabeza del cabo ─────────────────────────── */}
      <path
        d="M 856 108 Q 876 108 876 155 Q 876 202 856 202 L 872 202 Q 888 202 888 155 Q 888 108 872 108 Z"
        fill="url(#hg-bolster)"
        opacity="0.80"
      />
    </svg>
  );
}
