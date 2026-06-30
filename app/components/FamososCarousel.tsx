import Image from "next/image";
import type { ReactNode } from "react";
import { readdirSync } from "fs";
import { join } from "path";

interface FamososCarouselProps {
  eyebrow?: string;
  titulo?: ReactNode;
  descripcion?: string;
}

function getFotos() {
  try {
    const dir = join(process.cwd(), "public/famosos");
    return readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .map((f) => ({ src: `/famosos/${f}`, alt: f.replace(/\.[^.]+$/, "") }));
  } catch {
    return [];
  }
}

export function FamososCarousel({
  eyebrow = "Los que los eligen",
  titulo,
  descripcion,
}: FamososCarouselProps) {
  const fotos = getFotos();
  const items = [...fotos, ...fotos];

  return (
    <section className="relative py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-400/22 to-transparent"
      />

      {(titulo || eyebrow) && (
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-4">
            {eyebrow}
          </p>
          {titulo && (
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-steel-50">
              {titulo}
            </h2>
          )}
          {descripcion && (
            <p className="mt-4 max-w-2xl mx-auto text-stone-500 dark:text-steel-300">{descripcion}</p>
          )}
        </div>
      )}

      {/* Carrusel infinito */}
      <div className="famosos-wrap relative">
        {/* Fade izquierdo — usa --bg-page para adaptarse al tema */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{ background: "linear-gradient(90deg, var(--bg-page), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{ background: "linear-gradient(270deg, var(--bg-page), transparent)" }}
        />

        <div className="famosos-track gap-4" style={{ width: "max-content" }}>
          {items.map((f, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-2xl overflow-hidden bg-stone-200 dark:bg-steel-900"
              style={{ width: "clamp(160px, 14vw, 220px)", aspectRatio: "3/4" }}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
