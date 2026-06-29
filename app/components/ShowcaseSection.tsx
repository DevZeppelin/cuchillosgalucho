"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ── Fotos de detalle (se pasan desde el server component padre) ── */
interface GenialPhoto { src: string; alt: string }

/* ── Materiales ─────────────────────────────────────────────────── */
const MATERIALES = [
  {
    nombre: "Acero",
    parte: "La hoja",
    descripcion: "Carbono de alta dureza, templado al fuego y enfriado en aceite.",
    circleBg: [
      "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.15) 0%, transparent 50%)",
      "radial-gradient(circle at 36% 30%, #e2e7ed 0%, #c4cdd8 10%, #97a4b4 26%, #4a5666 50%, #262d38 70%, #181d25 100%)",
    ].join(", "),
    accent: "#c4cdd8",
    glow: "rgba(148,163,179,0.36)",
    shine: "rgba(220,232,245,0.34)",
    borderBase: "rgba(148,163,179,0.22)",
    borderHover: "rgba(196,205,216,0.9)",
    aurora: "rgba(148,163,179,0.07)",
  },
  {
    nombre: "Madera",
    parte: "El mango",
    descripcion: "Algarrobo, jacarandá, ñandubay. Maderas nobles argentinas.",
    circleBg: [
      "radial-gradient(circle at 28% 22%, rgba(199,153,98,0.24) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, #1a0f07 0%, #22140a 7%, #3a2210 13%, #22140a 17%, #553318 23%, #22140a 27%, #6e4520 33%, #22140a 37%, #8b5a2b 43%, #22140a 47%, #a87741 55%, #22140a 59%, #c79962 67%, #a87741 72%, #8b5a2b 80%, #3a2210 90%, #1a0f07 100%)",
    ].join(", "),
    accent: "#c79962",
    glow: "rgba(168,119,65,0.38)",
    shine: "rgba(224,196,140,0.3)",
    borderBase: "rgba(168,119,65,0.22)",
    borderHover: "rgba(199,153,98,0.9)",
    aurora: "rgba(168,119,65,0.07)",
  },
  {
    nombre: "Cobre",
    parte: "Las virolas",
    descripcion: "Martillado a mano. Una textura única que envejece con vos.",
    circleBg: [
      "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.18) 0%, transparent 48%)",
      "radial-gradient(circle at 38% 32%, #f3c285 0%, #ecaa5c 9%, #e08e3a 24%, #c97525 42%, #a85d1c 62%, #7f4516 79%, #57300f 100%)",
    ].join(", "),
    accent: "#ecaa5c",
    glow: "rgba(201,117,37,0.42)",
    shine: "rgba(243,194,133,0.34)",
    borderBase: "rgba(201,117,37,0.22)",
    borderHover: "rgba(236,170,92,0.9)",
    aurora: "rgba(201,117,37,0.085)",
  },
];

interface ShowcaseSectionProps {
  photos: GenialPhoto[];
}

export function ShowcaseSection({ photos }: ShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Layout asimétrico: foto 0 ocupa más, las demás se distribuyen */
  const [main, ...rest] = photos;

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Aurora de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {MATERIALES.map((m, i) => (
          <div
            key={m.nombre}
            className="absolute rounded-full"
            style={{
              top: "70%", left: `${16 + i * 34}%`, width: 400, height: 400,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${m.aurora} 0%, transparent 72%)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.45em] text-copper-400 mb-4">
            Calidad y detalle
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-steel-50 leading-tight">
            Hecho a mano.{" "}
            <em className="text-gradient-copper not-italic">Se nota.</em>
          </h2>
        </div>

        {/* ── Fotos de detalle ────────────────────────────── */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-16">
            {/* Foto principal — portrait, ocupa 2 filas en desktop */}
            {main && (
              <div className="row-span-2 md:row-span-2 relative rounded-xl overflow-hidden group"
                style={{ aspectRatio: "2/3" }}>
                <Image
                  src={main.src} alt={main.alt} fill sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 0 1.5px rgba(201,117,37,0.35)" }}
                />
              </div>
            )}
            {/* Fotos secundarias */}
            {rest.map((p, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden group"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 0 1.5px rgba(201,117,37,0.35)" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Separador ───────────────────────────────────── */}
        <div aria-hidden className="flex items-center justify-center gap-3 mb-14">
          <div className="h-px w-16 opacity-20" style={{ background: "linear-gradient(90deg, transparent, #c97525)" }} />
          <div className="w-1 h-1 rounded-full bg-copper-600 opacity-40" />
          <div className="w-1.5 h-1.5 rounded-full bg-copper-400 opacity-60" />
          <div className="w-1 h-1 rounded-full bg-copper-600 opacity-40" />
          <div className="h-px w-16 opacity-20" style={{ background: "linear-gradient(270deg, transparent, #c97525)" }} />
        </div>

        {/* ── Materiales (compactos) ───────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-14 lg:gap-20">
          {MATERIALES.map((m, i) => (
            <div
              key={m.nombre}
              className={`material-circle-item flex flex-col items-center gap-4${visible ? " circle-visible" : ""}`}
              style={{ "--circle-delay": `${i * 130}ms` } as React.CSSProperties}
            >
              {/* Círculo pequeño */}
              <div
                className="material-circle-card group relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0"
                style={
                  {
                    background: m.circleBg,
                    "--card-glow": m.glow,
                    "--card-border-base": m.borderBase,
                    "--card-border-hover": m.borderHover,
                  } as React.CSSProperties
                }
              >
                <div
                  aria-hidden
                  className={`material-shine${visible ? " material-shine--active" : ""}`}
                  style={{ "--shine-color": m.shine, "--shine-delay": `${i * 180 + 400}ms` } as React.CSSProperties}
                />
              </div>

              {/* Texto */}
              <div className="text-center">
                <h3 className="font-display text-xl leading-none mb-0.5" style={{ color: m.accent }}>
                  {m.nombre}
                </h3>
                <p className="text-[9px] uppercase tracking-[0.35em] mb-2" style={{ color: m.accent, opacity: 0.4 }}>
                  {m.parte}
                </p>
                <p className="text-xs text-steel-300/55 leading-relaxed max-w-[140px]">
                  {m.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
