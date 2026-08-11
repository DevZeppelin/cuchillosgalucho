import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/app/components/Reveal";
import { FamososCarousel } from "@/app/components/FamososCarousel";

export const metadata: Metadata = {
  title: "Nosotros — Cuchillos Galucho",
  description:
    "La historia de Cuchillos Galucho: el renacer de Raúl Herrera en Dolores, Buenos Aires, y el homenaje a su padre que le dio nombre a la marca.",
};

export default function NosotrosPage() {
  return (
    <>
      {/* Encabezado */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(117,99,69,0.08),transparent_55%)]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-4">
            Cuchillos Galucho
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-stone-900 dark:text-steel-50 leading-[1] mb-6">
            <em className="text-gradient-copper not-italic">Herrería</em> de
            oficio.
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-steel-300 max-w-2xl mx-auto leading-relaxed">
            Un renacer hecho a mano en Dolores, Buenos Aires. Cada cuchillo
            lleva el nombre de un padre, el oficio de un hijo y el peso de una
            historia familiar.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-4">
                La historia
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-steel-50 leading-tight mb-6">
                Empezó casi de{" "}
                <em className="text-gradient-copper not-italic">cero</em>, con
                un horno a gas y un soplete.
              </h2>
              <div className="space-y-4 text-stone-600 dark:text-steel-300 leading-relaxed">
                <p>
                  Cuchillos Galucho nació en Dolores, Buenos Aires, como el
                  renacer de su creador, Raúl Herrera. Tras superar una dura
                  enfermedad, Raúl decidió dar un vuelco definitivo a su vida
                  y volcarse por completo al noble oficio de la herrería y la
                  cuchillería artesanal.
                </p>
                <p>
                  Lo que comenzó casi desde cero, con un horno a gas, un
                  soplete y una dedicación inquebrantable, pronto se convirtió
                  en un símbolo de la tradición cuchillera argentina.
                </p>
                <p>
                  Cada cuchillo es una obra única, hecha a mano, que combina
                  aceros de máxima calidad con cabos cuidadosamente
                  seleccionados en madera, asta, hueso, alpaca y otros
                  materiales nobles.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-copper-600/25 dark:border-copper-700/30 group">
              <Image
                src="/taller.jpg"
                alt="El taller de Cuchillos Galucho"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-2">
                  El taller
                </p>
                <p className="font-display text-2xl md:text-3xl text-white leading-tight">
                  Donde nace cada pieza.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* El nombre */}
      <section className="relative py-20 lg:py-28 wood-texture">
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950/95 via-steel-950/85 to-steel-950/60" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-6">
              El origen del nombre
            </p>
            <blockquote className="font-display text-3xl md:text-5xl text-steel-50 leading-tight">
              &ldquo;Galucho&rdquo; evoca el apodo de{" "}
              <em className="text-gradient-copper not-italic">
                su padre
              </em>
              , quien partió cuando Raúl era apenas un niño.
            </blockquote>
            <p className="mt-6 text-steel-300 max-w-2xl mx-auto leading-relaxed">
              El nombre de la marca es un homenaje cargado de orgullo y amor
              familiar. Hoy, cada pieza es un puente vivo hacia su recuerdo y
              sus raíces.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats grandes */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: "21K+", t: "En Instagram" },
                { n: "40K+", t: "En TikTok" },
                { n: "10+", t: "Países" },
                { n: "100%", t: "Hecho a mano" },
              ].map(({ n, t }) => (
                <div
                  key={t}
                  className="text-center p-6 rounded-xl bg-white dark:bg-steel-900/50 border border-stone-200 dark:border-steel-800 shadow-sm dark:shadow-none"
                >
                  <p className="font-display text-5xl md:text-6xl text-gradient-copper">
                    {n}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-stone-500 dark:text-steel-300">
                    {t}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Festivales */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-4">
              Presencia federal
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-steel-50 leading-tight mb-6">
              De <em className="text-gradient-copper not-italic">festival</em>{" "}
              en festival.
            </h2>
            <p className="text-stone-600 dark:text-steel-300 max-w-2xl mx-auto leading-relaxed mb-10">
              La excelencia de su trabajo llevó a Cuchillos Galucho a
              acompañar a campeones de algunos de los festivales y encuentros
              más importantes del país.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Festival de Jesús María, Córdoba",
                "Festival del Caldén, San Luis",
                "Festival de Diamante, Entre Ríos",
                "Jineteadas en toda la Argentina",
              ].map((f) => (
                <div
                  key={f}
                  className="p-5 rounded-xl bg-white dark:bg-steel-900/50 border border-stone-200 dark:border-steel-800 text-sm text-stone-600 dark:text-steel-300"
                >
                  {f}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Famosos */}
      <FamososCarousel
        eyebrow="Quienes los usan"
        titulo={
          <>
            El cuchillo de{" "}
            <em className="text-gradient-copper not-italic">los famosos</em>.
          </>
        }
        descripcion="Sus piezas también llegaron a manos de reconocidas personalidades. Compartimos algunas de las personas que nos hicieron el aguante."
      />

      {/* Detrás de escena */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-4">
                Detrás de escena
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-steel-50">
                Del taller{" "}
                <em className="text-gradient-copper not-italic">a la calle</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <BackstageCard
                src="/premio.jpeg"
                eyebrow="El reconocimiento"
                titulo="El trabajo que se premia."
                bajada="Cada pieza reconocida en los festivales más importantes del país."
              />
            </Reveal>
            <Reveal delay={120}>
              <BackstageCard
                src="/stand.jpg"
                eyebrow="En el stand"
                titulo="Cara a cara con la comunidad."
                bajada="Encuentros, ferias y eventos donde mostramos el oficio."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Garantía y legado */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-copper-500 dark:text-copper-400 mb-6">
              Garantía de por vida
            </p>
            <blockquote className="font-display text-3xl md:text-5xl text-stone-800 dark:text-steel-100 italic leading-tight">
              &ldquo;Un Galucho está hecho para acompañar historias y
              convertirse en{" "}
              <span className="text-gradient-copper not-italic font-normal">
                un legado eterno
              </span>{" "}
              para compartir alrededor del fuego.&rdquo;
            </blockquote>
            <p className="mt-6 text-stone-500 dark:text-steel-300 max-w-2xl mx-auto leading-relaxed">
              Con absoluta confianza en la nobleza y calidad de sus trabajos,
              Cuchillos Galucho ofrece garantía de por vida, asegurando que
              cada hoja pase de generación en generación.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function BackstageCard({
  src,
  eyebrow,
  titulo,
  bajada,
}: {
  src: string;
  eyebrow: string;
  titulo: string;
  bajada: string;
}) {
  return (
    <figure className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 dark:border-steel-800 hover:border-copper-500/50 dark:hover:border-copper-600/50 transition-all">
      <Image
        src={src}
        alt={eyebrow}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-2">
          {eyebrow}
        </p>
        <p className="font-display text-2xl md:text-3xl text-white leading-tight">
          {titulo}
        </p>
        <p className="mt-2 text-sm text-white/70 max-w-md">{bajada}</p>
      </figcaption>
    </figure>
  );
}
