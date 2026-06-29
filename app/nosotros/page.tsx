import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/app/components/Reveal";
import { FamososCarousel } from "@/app/components/FamososCarousel";

export const metadata: Metadata = {
  title: "Nosotros — Cuchillos Galucho",
  description:
    "La historia de Cuchillos Galucho: forja artesanal argentina con más de 15 años de oficio y una comunidad de 40 mil seguidores.",
};


export default function NosotrosPage() {
  return (
    <>
      {/* Encabezado */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(201,117,37,0.18),transparent_55%)]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
            Cuchillos Galucho
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-steel-50 leading-[1] mb-6">
            <em className="text-gradient-copper not-italic">Forjadores</em>{" "}
            del oficio.
          </h1>
          <p className="text-lg md:text-xl text-steel-300 max-w-2xl mx-auto leading-relaxed">
            Una historia argentina hecha de fuego, paciencia y manos que saben. Cada
            cuchillo lleva el peso de más de quince años de oficio.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
                La historia
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-steel-50 leading-tight mb-6">
                Empezó en un{" "}
                <em className="text-gradient-copper not-italic">taller chico</em>,
                con un yunque heredado.
              </h2>
              <div className="space-y-4 text-steel-300 leading-relaxed">
                <p>
                  Cuchillos Galucho nace de una obsesión simple: hacer la mejor pieza
                  posible, con los materiales que siempre se usaron, sin atajos
                  industriales.
                </p>
                <p>
                  Lo que empezó como un oficio familiar terminó convirtiéndose en una
                  marca reconocida en todo el país. Hoy mandamos piezas a todas las
                  provincias y a más de diez países, sin perder la mano artesanal que
                  nos define.
                </p>
                <p>
                  Cada cuchillo pasa por las mismas manos. Desde la forja hasta el
                  ajuste del cabo. Esa firma se nota.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-copper-700/30 group">
              <Image
                src="/taller.jpg"
                alt="El taller de Cuchillos Galucho"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-2">
                  El taller
                </p>
                <p className="font-display text-2xl md:text-3xl text-steel-50 leading-tight">
                  Donde nace cada pieza.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Stats grandes */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: "15+", t: "Años de oficio" },
                { n: "40K+", t: "En Instagram" },
                { n: "10+", t: "Países" },
                { n: "100%", t: "Hecho a mano" },
              ].map(({ n, t }) => (
                <div
                  key={t}
                  className="text-center p-6 rounded-xl bg-steel-900/50 border border-steel-800"
                >
                  <p className="font-display text-5xl md:text-6xl text-gradient-copper">
                    {n}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-steel-300">
                    {t}
                  </p>
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
            De{" "}
            <em className="text-gradient-copper not-italic">la cocina</em> al
            escenario.
          </>
        }
        descripcion="Nuestras piezas eligen su lugar. Compartimos algunas de las personas que nos hicieron el aguante."
      />

      {/* Detrás de escena: stand + taller */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
                Detrás de escena
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-steel-50">
                Del taller{" "}
                <em className="text-gradient-copper not-italic">a la calle</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <BackstageCard
                src="/taller.jpg"
                eyebrow="El taller"
                titulo="Donde se forja cada filo."
                bajada="Acero al rojo vivo, yunque y paciencia. Acá nace cada pieza."
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

      {/* Filosofía */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-6">
              Nuestra forma
            </p>
            <blockquote className="font-display text-3xl md:text-5xl text-steel-100 italic leading-tight">
              “Un buen cuchillo es{" "}
              <span className="text-gradient-copper not-italic font-normal">
                la herramienta
              </span>{" "}
              y la herencia.”
            </blockquote>
            <p className="mt-6 text-steel-300">— Galucho</p>
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
    <figure className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-steel-800 hover:border-copper-600/50 transition-all">
      <Image
        src={src}
        alt={eyebrow}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/40 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-copper-300 mb-2">
          {eyebrow}
        </p>
        <p className="font-display text-2xl md:text-3xl text-steel-50 leading-tight">
          {titulo}
        </p>
        <p className="mt-2 text-sm text-steel-300 max-w-md">{bajada}</p>
      </figcaption>
    </figure>
  );
}
