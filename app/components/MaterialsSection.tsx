"use client";

import { useEffect, useRef, useState } from "react";

const materiales = [
  {
    nombre: "Acero Inoxidable 420",
    parte: "La hoja",
    descripcion:
      "Acero Inoxidable 420 de alta dureza. Resistente a la corrosión, filo duradero y fácil de mantener.",
    // polished steel sphere: dark edges, silver highlight off-center
    circleBg: [
      "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.15) 0%, transparent 50%)",
      "radial-gradient(circle at 36% 30%, #e2e7ed 0%, #c4cdd8 10%, #97a4b4 26%, #4a5666 50%, #262d38 70%, #181d25 100%)",
    ].join(", "),
    accentColor: "#c4cdd8",
    glowColor: "rgba(148,163,179,0.36)",
    shineColor: "rgba(220,232,245,0.34)",
    borderBase: "rgba(148,163,179,0.22)",
    borderHover: "rgba(196,205,216,0.9)",
    auroraColor: "rgba(148,163,179,0.075)",
    icono: SteelIcon,
  },
  {
    nombre: "Madera",
    parte: "El mango",
    descripcion:
      "Algarrobo, jacarandá, ñandubay. Maderas nobles argentinas, curadas y aceitadas a mano.",
    // end-grain wood: concentric rings from dark core to warm edge
    circleBg: [
      "radial-gradient(circle at 28% 22%, rgba(199,153,98,0.24) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, #1a0f07 0%, #22140a 7%, #3a2210 13%, #22140a 17%, #553318 23%, #22140a 27%, #6e4520 33%, #22140a 37%, #8b5a2b 43%, #22140a 47%, #a87741 55%, #22140a 59%, #c79962 67%, #a87741 72%, #8b5a2b 80%, #3a2210 90%, #1a0f07 100%)",
    ].join(", "),
    accentColor: "#c79962",
    glowColor: "rgba(168,119,65,0.38)",
    shineColor: "rgba(224,196,140,0.3)",
    borderBase: "rgba(168,119,65,0.22)",
    borderHover: "rgba(199,153,98,0.9)",
    auroraColor: "rgba(168,119,65,0.07)",
    icono: WoodIcon,
  },
];

export function MaterialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Aurora ambiental detrás de cada círculo */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {materiales.map((m, i) => (
          <div
            key={m.nombre}
            className="absolute rounded-full"
            style={{
              top: "58%",
              left: `${16 + i * 34}%`,
              width: 480,
              height: 480,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${m.auroraColor} 0%, transparent 72%)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">

        {/* Título centrado */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.45em] text-copper-400 mb-4">
            Los materiales
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-steel-50 leading-tight">
            Dos materiales.{" "}
            <em className="text-gradient-copper not-italic">Una pieza.</em>
          </h2>
        </div>

        {/* Separador decorativo */}
        <div aria-hidden className="flex items-center justify-center gap-3 mb-16">
          <div
            className="h-px w-20 opacity-25"
            style={{ background: "linear-gradient(90deg, transparent, #756345)" }}
          />
          <div className="w-1 h-1 rounded-full bg-copper-600 opacity-50" />
          <div className="w-1.5 h-1.5 rounded-full bg-copper-400 opacity-70" />
          <div className="w-1 h-1 rounded-full bg-copper-600 opacity-50" />
          <div
            className="h-px w-20 opacity-25"
            style={{ background: "linear-gradient(270deg, transparent, #756345)" }}
          />
        </div>

        {/* Tres círculos */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-14 md:gap-16 lg:gap-24">
          {materiales.map((m, i) => {
            const Icono = m.icono;
            return (
              <div
                key={m.nombre}
                className={`material-circle-item flex flex-col items-center gap-6${visible ? " circle-visible" : ""}`}
                style={{ "--circle-delay": `${i * 150}ms` } as React.CSSProperties}
              >
                {/* Círculo de material */}
                <div
                  className="material-circle-card group relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden"
                  style={
                    {
                      background: m.circleBg,
                      "--card-glow": m.glowColor,
                      "--card-border-base": m.borderBase,
                      "--card-border-hover": m.borderHover,
                    } as React.CSSProperties
                  }
                >
                  {/* Sweep de brillo al scrollear */}
                  <div
                    aria-hidden
                    className={`material-shine${visible ? " material-shine--active" : ""}`}
                    style={
                      {
                        "--shine-color": m.shineColor,
                        "--shine-delay": `${i * 200 + 550}ms`,
                      } as React.CSSProperties
                    }
                  />

                  {/* Ícono centrado con badge oscuro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: "rgba(0,0,0,0.36)",
                        boxShadow:
                          "0 0 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      <Icono />
                    </div>
                  </div>
                </div>

                {/* Texto bajo el círculo — siempre sobre fondo oscuro, máxima legibilidad */}
                <div className="text-center">
                  <h3
                    className="font-display text-2xl md:text-3xl leading-none mb-1"
                    style={{ color: m.accentColor }}
                  >
                    {m.nombre}
                  </h3>
                  <p
                    className="text-[9px] uppercase tracking-[0.38em] mb-3"
                    style={{ color: m.accentColor, opacity: 0.42 }}
                  >
                    {m.parte}
                  </p>
                  <p className="text-xs md:text-sm text-steel-300/65 leading-relaxed max-w-[165px]">
                    {m.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SteelIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="si-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f6f8" />
          <stop offset="55%" stopColor="#97a4b4" />
          <stop offset="100%" stopColor="#36404e" />
        </linearGradient>
        <linearGradient id="si-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e7ed" stopOpacity="0" />
          <stop offset="50%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#e2e7ed" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* blade silhouette */}
      <path d="M3 14 L14 3 L21 4.5 L21.5 11 L10 21 Z" fill="url(#si-g)" stroke="#6a7888" strokeWidth="0.4" />
      {/* edge highlight */}
      <path d="M6 17 L15 8" stroke="url(#si-edge)" strokeWidth="0.9" strokeLinecap="round" />
      {/* pin hole */}
      <circle cx="17.5" cy="7.5" r="1.3" fill="#06080b" />
    </svg>
  );
}

function WoodIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="wi-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c79962" />
          <stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
        <clipPath id="wi-clip">
          <ellipse cx="12" cy="12" rx="9" ry="7" />
        </clipPath>
      </defs>
      {/* handle oval */}
      <ellipse cx="12" cy="12" rx="9" ry="7" fill="url(#wi-g)" />
      {/* vertical grain lines clipped to oval */}
      <g clipPath="url(#wi-clip)" opacity="0.55">
        <line x1="6.5" y1="5" x2="6.5" y2="19" stroke="#22140a" strokeWidth="0.9" />
        <line x1="9.5" y1="5" x2="9.5" y2="19" stroke="#22140a" strokeWidth="0.6" />
        <line x1="12.5" y1="5" x2="12.5" y2="19" stroke="#22140a" strokeWidth="0.6" />
        <line x1="15.5" y1="5" x2="15.5" y2="19" stroke="#22140a" strokeWidth="0.9" />
      </g>
      {/* subtle surface highlight */}
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="rgba(199,153,98,0.22)" />
    </svg>
  );
}

