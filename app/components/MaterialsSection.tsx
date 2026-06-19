import { Reveal } from "./Reveal";

const materiales = [
  {
    nombre: "Acero",
    descripcion:
      "Carbono de alta dureza, templado al fuego y enfriado en aceite. Filo que pide menos y trabaja más.",
    color: "from-steel-700 via-steel-300 to-steel-700",
    icono: SteelIcon,
  },
  {
    nombre: "Madera",
    descripcion:
      "Algarrobo, jacarandá, ñandubay. Maderas nobles argentinas, curadas y aceitadas a mano.",
    color: "from-wood-700 via-wood-400 to-wood-700",
    icono: WoodIcon,
  },
  {
    nombre: "Cobre",
    descripcion:
      "Virolas y guarniciones de cobre martillado. Una textura única, viva, que envejece con vos.",
    color: "from-copper-600 via-copper-300 to-copper-600",
    icono: CopperIcon,
  },
];

export function MaterialsSection() {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
              Los materiales
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-steel-50 leading-tight">
              Tres elementos.{" "}
              <em className="text-gradient-copper not-italic">Una pieza</em>{" "}
              que perdura.
            </h2>
            <p className="mt-6 text-lg text-steel-300 leading-relaxed">
              Trabajamos con los mismos materiales que nuestros abuelos. Sin atajos, sin
              shortcuts. Cada cuchillo nace del fuego y se termina con paciencia.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {materiales.map((m, i) => {
            const Icono = m.icono;
            return (
              <Reveal key={m.nombre} delay={i * 120}>
                <div className="group relative h-full p-8 rounded-2xl bg-steel-900/60 border border-steel-800 hover:border-copper-600/50 transition-all duration-500 overflow-hidden">
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${m.color}`}
                  />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-steel-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-copper-700/50">
                      <Icono />
                    </div>
                    <h3 className="font-display text-3xl text-steel-50 mb-3">
                      {m.nombre}
                    </h3>
                    <div className="hairline-divider mb-4 w-16 origin-left animate-draw-line" />
                    <p className="text-steel-300 leading-relaxed">{m.descripcion}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SteelIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="steel-ic" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6dde6" />
          <stop offset="100%" stopColor="#6a7888" />
        </linearGradient>
      </defs>
      <path
        d="M3 13 L13 3 L20 4 L21 11 L11 21 Z"
        fill="url(#steel-ic)"
        stroke="#97a4b4"
        strokeWidth="0.5"
      />
      <circle cx="16" cy="8" r="1.4" fill="#06080b" />
    </svg>
  );
}
function WoodIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="wood-ic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a87741" />
          <stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#wood-ic)" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="#22140a" strokeWidth="0.6" />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="#22140a" strokeWidth="0.6" />
      <circle cx="12" cy="12" r="1.5" fill="#22140a" />
    </svg>
  );
}
function CopperIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="copper-ic" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3c285" />
          <stop offset="50%" stopColor="#c97525" />
          <stop offset="100%" stopColor="#7f4516" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 L20 9 L17 21 L7 21 L4 9 Z"
        fill="url(#copper-ic)"
        stroke="#7f4516"
        strokeWidth="0.5"
      />
      <path d="M9 11 L15 11 M9 14 L15 14 M9 17 L15 17" stroke="#321b08" strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}
