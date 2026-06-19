import type { Metadata } from "next";
import { fetchProducts } from "@/app/lib/airtable";
import { MayoristasGate } from "./MayoristasGate";

export const metadata: Metadata = {
  title: "Mayoristas — Cuchillos Galucho",
  description:
    "Acceso exclusivo para comercios. Catálogo con precios mayoristas y pedidos coordinados vía WhatsApp.",
};

export default async function MayoristasPage() {
  const products = await fetchProducts();
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,117,37,0.12),transparent_55%)]" />

      <section className="relative pt-28 lg:pt-40 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
            Comercios y revendedores
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-steel-50 leading-tight">
            Una alianza{" "}
            <em className="text-gradient-copper not-italic">forjada</em>{" "}
            a fuego.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-steel-300">
            Espacio reservado para nuestros aliados. Ingresá con tu usuario para ver
            precios mayoristas, armar el pedido y enviarlo en un clic.
          </p>
        </div>
      </section>

      <section className="relative py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <MayoristasGate products={products} />
        </div>
      </section>
    </div>
  );
}
