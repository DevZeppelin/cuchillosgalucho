import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-steel-800 bg-steel-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-copper-500/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="space-y-5 md:col-span-1">
          <Image
            src="/logo.png"
            alt="Cuchillos Galucho"
            width={140}
            height={56}
            className="invert h-14 w-auto"
          />
          <p className="text-sm text-steel-300 leading-relaxed max-w-xs">
            Forja artesanal argentina. Cada pieza es única, hecha a mano para
            acompañar toda una vida.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-copper-300 mb-4">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm text-steel-300">
            <li>
              <Link
                href="/"
                className="hover:text-copper-400 transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/#catalogo"
                className="hover:text-copper-400 transition-colors"
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros"
                className="hover:text-copper-400 transition-colors"
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/mayoristas"
                className="hover:text-copper-400 transition-colors"
              >
                Mayoristas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-copper-300 mb-4">
            Materiales
          </h3>
          <ul className="space-y-2 text-sm text-steel-300">
            <li>Acero Inoxidable 420</li>
            <li>Madera de algarrobo</li>
            <li>Madera de jacarandá</li>
            <li>Cuero suela natural</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-copper-300 mb-4">
            Contacto
          </h3>
          <ul className="space-y-2 text-sm text-steel-300">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper-400 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.5.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.5.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.5-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.5-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 2.2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.5-1.3.8-.4.4-.6.7-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.5.9.8 1.3.4.4.7.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.8.4-.4.6-.7.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.8-1.3-.4-.4-.7-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.7a4.1 4.1 0 110 8.2 4.1 4.1 0 010-8.2zm0 6.8a2.7 2.7 0 100-5.4 2.7 2.7 0 000 5.4zm5.2-7c0 .5-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1z" />
                </svg>
                @cuchillos.galucho
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5492241672338"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper-400 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.6 6.32A8 8 0 005.93 17.5l-1.18 4.31 4.41-1.16a8 8 0 008.43-13.32z" />
                </svg>
                WhatsApp
              </a>
            </li>
            <li className="text-xs pt-2">Buenos Aires · Argentina</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-steel-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-steel-400">
          <p>
            © {new Date().getFullYear()} Cuchillos Galucho — Todos los derechos
            reservados.
          </p>
          <p>Forjado en Argentina.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-5 flex justify-center">
          <p className="text-[10px] text-steel-700 tracking-widest">
            made with{" "}
            <span className="text-steel-600" aria-label="amor">
              ♥
            </span>{" "}
            by{" "}
            <a
              href="https://devzeppelin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-steel-400 transition-colors duration-300"
            >
              DevZeppelin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
