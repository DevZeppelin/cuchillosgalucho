import Image from "next/image";
import type { ReactNode } from "react";

type FamosoItem = { src: string; alt: string };

const FAMOSOS: FamosoItem[] = [
  { src: "/famosos/famoso-ppal.jpeg", alt: "Embajador de la marca" },
  { src: "/famosos/famoso01.jpg",     alt: "Famoso 01"            },
  { src: "/famosos/famoso02.jpg",     alt: "Famoso 02"            },
  { src: "/famosos/famso03.jpg",      alt: "Famoso 03"            },
  { src: "/famosos/famoso04.jpg",     alt: "Famoso 04"            },
  { src: "/famosos/famoso05.png",     alt: "Famoso 05"            },
];

// Duplicar para loop perfecto — el track translateX(-50%) = volver al inicio
const ITEMS = [...FAMOSOS, ...FAMOSOS];

interface FamososCarouselProps {
  eyebrow?: string;
  titulo?: ReactNode;
  descripcion?: string;
}

export function FamososCarousel({
  eyebrow = "Los que los eligen",
  titulo,
  descripcion,
}: FamososCarouselProps) {
  return (
    <section className="relative py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-500/25 to-transparent"
      />

      {(titulo || eyebrow) && (
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
            {eyebrow}
          </p>
          {titulo && (
            <h2 className="font-display text-4xl md:text-5xl text-steel-50">
              {titulo}
            </h2>
          )}
          {descripcion && (
            <p className="mt-4 max-w-2xl mx-auto text-steel-300">{descripcion}</p>
          )}
        </div>
      )}

      {/* ── Carrusel ──────────────────────────────────────── */}
      <div className="famosos-wrap relative">
        {/* Degradado en bordes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{ background: "linear-gradient(90deg, var(--color-steel-950), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{ background: "linear-gradient(270deg, var(--color-steel-950), transparent)" }}
        />

        <div className="famosos-track gap-4" style={{ width: "max-content" }}>
          {ITEMS.map((f, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-2xl overflow-hidden bg-steel-900"
              style={{ width: "clamp(180px, 16vw, 240px)", aspectRatio: "3/4" }}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
