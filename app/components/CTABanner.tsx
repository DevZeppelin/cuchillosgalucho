import Link from "next/link";
import { Reveal } from "./Reveal";

export function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border border-copper-600/30">
            <div className="absolute inset-0 wood-texture opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-steel-950/95 via-steel-950/80 to-steel-950/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,117,37,0.4),transparent_60%)]" />

            <div className="relative px-8 sm:px-12 lg:px-16 py-16 lg:py-20 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-4">
                ¿Sos comercio?
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-steel-50 leading-tight">
                Acceso{" "}
                <em className="text-gradient-copper not-italic">exclusivo</em>{" "}
                para mayoristas.
              </h2>
              <p className="mt-6 text-lg text-steel-200 leading-relaxed max-w-xl">
                Precios mayoristas, catálogo completo y pedidos coordinados. Ingresá con
                tu usuario asignado y armá la orden en minutos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/mayoristas"
                  className="inline-flex items-center justify-center gap-2 bg-copper-500 hover:bg-copper-400 text-steel-950 font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all hover:scale-[1.02]"
                >
                  Ingresar como mayorista
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/5491100000000?text=Hola%2C%20quiero%20pedir%20acceso%20mayorista"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-steel-300/30 text-steel-100 hover:border-copper-400 hover:text-copper-300 uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all inline-flex items-center justify-center"
                >
                  Solicitar acceso
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
