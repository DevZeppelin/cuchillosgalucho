import { Hero } from "@/app/components/Hero";
import { ShowcaseSectionServer } from "@/app/components/ShowcaseSectionServer";
import { CatalogGrid } from "@/app/components/CatalogGrid";
import { Reveal } from "@/app/components/Reveal";
import { CTABanner } from "@/app/components/CTABanner";
import { FamososCarousel } from "@/app/components/FamososCarousel";
import { getCatalogo } from "@/app/lib/catalogo";

export default async function Home() {
  const products = await getCatalogo();

  return (
    <>
      <Hero />

      <ShowcaseSectionServer />

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
                Filtrá por uso. Cada pieza está disponible para coordinar
                entrega vía WhatsApp.
              </p>
            </div>
          </Reveal>
          <CatalogGrid products={products} />
        </div>
      </section>

      <CTABanner />

      <FamososCarousel
        eyebrow="Los que los eligen"
        titulo={
          <>
            De <em className="text-gradient-copper not-italic">la cocina</em> al
            escenario.
          </>
        }
        descripcion="Referentes que eligieron Galucho. Desde asadores profesionales hasta artistas."
      />
    </>
  );
}
