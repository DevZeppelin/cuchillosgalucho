import { Reveal } from "./Reveal";

type Post = {
  titulo: string;
  bajada: string;
  likes: string;
  gradient: string;
  icono: "fuego" | "forja" | "cobre" | "madera" | "edicion" | "cuero";
};

const POSTS: Post[] = [
  {
    titulo: "Asado de domingo",
    bajada: "El ritual del fuego",
    likes: "2.4K",
    gradient: "from-copper-700 via-copper-500 to-wood-800",
    icono: "fuego",
  },
  {
    titulo: "Forja en vivo",
    bajada: "Del yunque a tu mesa",
    likes: "3.1K",
    gradient: "from-steel-700 via-steel-500 to-steel-900",
    icono: "forja",
  },
  {
    titulo: "Detalle de cobre",
    bajada: "Martillado a mano",
    likes: "1.8K",
    gradient: "from-copper-600 via-copper-400 to-copper-800",
    icono: "cobre",
  },
  {
    titulo: "Cabo en algarrobo",
    bajada: "Madera curada",
    likes: "2.0K",
    gradient: "from-wood-700 via-wood-500 to-wood-900",
    icono: "madera",
  },
  {
    titulo: "Edición limitada",
    bajada: "Pieza numerada",
    likes: "4.2K",
    gradient: "from-wood-900 via-copper-700 to-steel-900",
    icono: "edicion",
  },
  {
    titulo: "Vaina repujada",
    bajada: "Cuero al natural",
    likes: "1.5K",
    gradient: "from-wood-800 via-wood-600 to-wood-900",
    icono: "cuero",
  },
];

export function InstagramStrip() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-copper-400 mb-4">
              Nuestra comunidad
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-steel-50">
              Más de{" "}
              <span className="text-gradient-copper">40.000</span>{" "}
              forjeros en Instagram
            </h2>
            <p className="mt-4 text-steel-300">
              Compartimos cada paso del proceso. Desde el yunque hasta tu mesa.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-copper-400 hover:text-copper-300 transition-colors text-sm uppercase tracking-widest"
            >
              <InstagramGlyph className="w-4.5 h-4.5" />
              @cuchillos.galucho
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.titulo} delay={i * 80}>
              <PostTile post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PostTile({ post }: { post: Post }) {
  return (
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver post: ${post.titulo}`}
      className="group relative block aspect-square rounded-xl overflow-hidden border border-steel-800 hover:border-copper-500 transition-all duration-500"
    >
      {/* Fondo con gradiente temático */}
      <div className={`absolute inset-0 bg-linear-to-br ${post.gradient}`} />

      {/* Patrón sutil que aporta textura */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.45), transparent 50%)",
        }}
        aria-hidden
      />

      {/* Capa oscura para legibilidad */}
      <div className="absolute inset-0 bg-linear-to-t from-steel-950 via-steel-950/20 to-transparent" />

      {/* Icono temático centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-steel-950/40 backdrop-blur-sm border border-steel-50/15 flex items-center justify-center text-steel-50 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
          <PostIcon kind={post.icono} />
        </div>
      </div>

      {/* Logo Instagram que aparece en hover (esquina sup. der.) */}
      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-steel-950/60 backdrop-blur-sm flex items-center justify-center text-copper-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <InstagramGlyph className="w-3.5 h-3.5" />
      </div>

      {/* Likes en esquina sup. izq. */}
      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-steel-950/60 backdrop-blur-sm flex items-center gap-1 text-[10px] text-steel-100 font-medium">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-copper-300"
        >
          <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
        {post.likes}
      </div>

      {/* Pie con título y bajada */}
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="font-display text-base sm:text-lg leading-tight text-steel-50 group-hover:text-copper-200 transition-colors">
          {post.titulo}
        </p>
        <p className="text-[11px] uppercase tracking-widest text-steel-300 mt-0.5 line-clamp-1">
          {post.bajada}
        </p>
      </div>

      {/* Borde brillante en hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(236, 170, 92, 0.45)",
        }}
      />
    </a>
  );
}

function PostIcon({ kind }: { kind: Post["icono"] }) {
  switch (kind) {
    case "fuego":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2c1 3 4 4.5 4 8a4 4 0 01-8 0c0-1.2.4-2.2 1-3-.2 2 1 3 2 3 0-3-3-4-1-8z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M5 14a7 7 0 1014 0c0 4-3 7-7 7s-7-3-7-7z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.7"
            fill="none"
          />
        </svg>
      );
    case "forja":
      // martillo
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 3l7 4-3 5-3-1.5-9 9-2.5-2.5 9-9L11 6l3-3z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M3 21l3-3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cobre":
      // gota brillante
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2c4 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 3-7 7-12z"
            fill="currentColor"
          />
          <path
            d="M9 13c-.5 1.5 0 3 1.5 3.5"
            stroke="rgba(6,8,11,0.5)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "madera":
      // anillos de madera
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.95" />
          <circle
            cx="12"
            cy="12"
            r="6"
            stroke="rgba(6,8,11,0.45)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="rgba(6,8,11,0.45)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="12" cy="12" r="1.2" fill="rgba(6,8,11,0.6)" />
        </svg>
      );
    case "edicion":
      // estrella / numerado
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l2.6 5.6 6.2.7-4.6 4.3 1.3 6.1L12 16.9 6.5 19.7l1.3-6.1L3.2 9.3l6.2-.7L12 3z"
            fill="currentColor"
          />
        </svg>
      );
    case "cuero":
      // hoja+vaina simplificada
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 6h11c2.2 0 4 1.8 4 4s-1.8 4-4 4H5V6z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M7 10h10"
            stroke="rgba(6,8,11,0.5)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          <path
            d="M5 6v8"
            stroke="rgba(6,8,11,0.5)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.5.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8-.3 1.8-.4 2.2c-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.5.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.5-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.5-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 6.1a3.7 3.7 0 100 7.4 3.7 3.7 0 000-7.4zm5.2-.7a.9.9 0 11-1.8 0 .9.9 0 011.8 0z" />
    </svg>
  );
}
