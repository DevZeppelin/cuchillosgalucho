import { Hero } from "@/app/components/Hero";
import { MaterialsSection } from "@/app/components/MaterialsSection";
import { CatalogGrid } from "@/app/components/CatalogGrid";
import { ProductCard } from "@/app/components/ProductCard";
import { Reveal } from "@/app/components/Reveal";
import { CTABanner } from "@/app/components/CTABanner";
import { InstagramStrip } from "@/app/components/InstagramStrip";
import { fetchProducts } from "@/app/lib/airtable";

export default async function Home() {
  const products = await fetchProducts();
  const destacados = products.filter((p) => p.destacado);

  return (
    <>
      <Hero />

      <MaterialsSection />

      {/* Sección destacados */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
                  Selección de la casa
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-steel-50">
                  Piezas{" "}
                  <em className="text-gradient-copper not-italic">destacadas</em>
                </h2>
              </div>
              <a
                href="#catalogo"
                className="text-sm uppercase tracking-widest text-copper-400 hover:text-copper-300 transition-colors inline-flex items-center gap-2"
              >
                Ver todo el catálogo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destacados.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo completo */}
      <section id="catalogo" className="relative py-20 lg:py-28 scroll-mt-20">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-500/30 to-transparent"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
                Catálogo completo
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-steel-50">
                Encontrá{" "}
                <em className="text-gradient-copper not-italic">el tuyo</em>
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-steel-300">
                Filtrá por uso. Cada pieza está disponible para coordinar entrega vía
                WhatsApp.
              </p>
            </div>
          </Reveal>
          <CatalogGrid products={products} />
        </div>
      </section>

      <CTABanner />

      <InstagramStrip />
    </>
  );
}
