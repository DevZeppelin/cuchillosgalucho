"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AUTOPLAY_MS = 2200;

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const slides = images.length > 0 ? images : ["/logo.png"];
  const multi = slides.length > 1;

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopAutoplay() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startAutoplay() {
    if (!multi) return;
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  useEffect(() => stopAutoplay, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (multi && e.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (multi && e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, multi, slides.length]);

  function goTo(e: React.MouseEvent, next: number) {
    e.preventDefault();
    e.stopPropagation();
    stopAutoplay();
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }

  const current = slides[index];
  const useLogo = failed.has(index) || !current || current === "/logo.png";

  function openLightbox(e: React.MouseEvent) {
    if (useLogo) return;
    e.stopPropagation();
    setLightboxOpen(true);
  }

  return (
    <>
    <div
      className={["absolute inset-0", useLogo ? "" : "cursor-zoom-in"].join(" ")}
      onClick={openLightbox}
      onMouseEnter={() => {
        setHovering(true);
        startAutoplay();
      }}
      onMouseLeave={() => {
        setHovering(false);
        stopAutoplay();
        setIndex(0);
      }}
    >
      {useLogo ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, #36404e 0%, #181d25 45%, #0e1218 75%, #06080b 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(117,99,69,0.06) 0%, transparent 55%)",
            }}
          />
          <div className="relative w-3/5 aspect-square flex items-center justify-center">
            <Image
              src="/logo.png"
              alt={alt}
              fill
              className="object-contain invert opacity-20 group-hover:opacity-35 transition-opacity duration-500"
            />
          </div>
        </div>
      ) : (
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setFailed((prev) => new Set(prev).add(index))}
        />
      )}

      {!useLogo && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}
      />

      {multi && (
        <>
          {/* Barrita de progreso tipo stories — se llena mientras el mouse está encima */}
          <div className="absolute top-0 inset-x-0 flex gap-0.5 p-1 z-20">
            {slides.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden">
                <div
                  key={i === index ? `${i}-active` : `${i}-idle`}
                  className={[
                    "h-full bg-white rounded-full",
                    i < index ? "w-full" : i > index ? "w-0" : "w-0 animate-carousel-fill",
                  ].join(" ")}
                  style={
                    i === index
                      ? {
                          animationDuration: `${AUTOPLAY_MS}ms`,
                          animationPlayState: hovering ? "running" : "paused",
                        }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={(e) => goTo(e, index - 1)}
            className="cursor-pointer absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={(e) => goTo(e, index + 1)}
            className="cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>

    {lightboxOpen &&
      createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] aspect-[4/3] bg-stone-950 rounded-2xl overflow-hidden shadow-2xl animate-[circle-in_0.28s_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current}
              src={current}
              alt={alt}
              fill
              sizes="(min-width: 768px) 640px, 92vw"
              className="object-contain"
            />

            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setLightboxOpen(false)}
              className="cursor-pointer absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            {multi && (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={(e) => goTo(e, index - 1)}
                  className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={(e) => goTo(e, index + 1)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className="absolute bottom-3 inset-x-3 flex gap-1.5 justify-center z-10">
                  {slides.map((_, i) => (
                    <span
                      key={i}
                      className={[
                        "h-1.5 rounded-full transition-all",
                        i === index ? "w-6 bg-white" : "w-1.5 bg-white/40",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
