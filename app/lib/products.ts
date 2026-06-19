import "server-only";
import type { Product } from "./types";

/**
 * Catálogo demo. En producción esto vendrá de Airtable vía `lib/airtable.ts`.
 * Mantener la misma forma del objeto `Product` para no romper consumidores.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    slug: "asador-clasico-25",
    nombre: "Asador Clásico 25",
    categoria: "asador",
    descripcionCorta: "Hoja de 25 cm en acero al carbono, cabo en algarrobo.",
    descripcionLarga:
      "Cuchillo de asador con hoja de acero al carbono templado a mano. Cabo en madera de algarrobo curado, virola y cabeza de bronce. Pensado para el ritual del fuego, con balance al servicio del corte limpio.",
    precio: 78000,
    precioMayorista: 54600,
    hojaCm: 25,
    materiales: ["acero", "madera"],
    imagen: "/productos/01.jpg",
    destacado: true,
    stock: 12,
  },
  {
    id: "prod-002",
    slug: "criollo-cobre-18",
    nombre: "Criollo Cobre 18",
    categoria: "criollo",
    descripcionCorta: "Estilo tradicional con guarniciones en cobre martillado.",
    descripcionLarga:
      "Cuchillo criollo con hoja de 18 cm, cabo de madera de ñandubay y guarniciones en cobre martillado a mano. Una pieza de uso diario que mejora con el tiempo.",
    precio: 65000,
    precioMayorista: 45500,
    hojaCm: 18,
    materiales: ["acero", "madera", "cobre"],
    imagen: "/productos/02.jpg",
    destacado: true,
    stock: 8,
  },
  {
    id: "prod-003",
    slug: "tactico-carbon-14",
    nombre: "Táctico Carbon 14",
    categoria: "tactico",
    descripcionCorta: "Diseño moderno, hoja de 14 cm, mango micarta.",
    descripcionLarga:
      "Cuchillo táctico con hoja de acero al carbono y mango en micarta negra. Filo agresivo y balance hacia la punta para trabajo fino y exigente.",
    precio: 92000,
    precioMayorista: 64400,
    hojaCm: 14,
    materiales: ["carbono", "acero"],
    imagen: "/productos/03.jpg",
    destacado: true,
    stock: 5,
  },
  {
    id: "prod-004",
    slug: "cocina-chef-22",
    nombre: "Chef 22 Madera",
    categoria: "cocina",
    descripcionCorta: "Cuchillo de chef con cabo en madera de jacarandá.",
    descripcionLarga:
      "Hoja de 22 cm pensada para cocina exigente. Cabo en jacarandá con remaches de bronce. Distribución equilibrada para tablas de corte largas.",
    precio: 85000,
    precioMayorista: 59500,
    hojaCm: 22,
    materiales: ["acero", "madera"],
    imagen: "/productos/04.jpg",
    stock: 7,
  },
  {
    id: "prod-005",
    slug: "campo-asta-16",
    nombre: "Campo Asta 16",
    categoria: "campo",
    descripcionCorta: "Cabo en asta de ciervo, ideal para tareas rurales.",
    descripcionLarga:
      "Una pieza pensada para el campo. Cabo en asta de ciervo argentina y hoja resistente de 16 cm. Funda en cuero suela curtido al natural.",
    precio: 72000,
    precioMayorista: 50400,
    hojaCm: 16,
    materiales: ["acero", "asta"],
    imagen: "/productos/02.jpg",
    stock: 10,
  },
  {
    id: "prod-006",
    slug: "coleccion-pampa-30",
    nombre: "Pampa Edición Limitada",
    categoria: "coleccion",
    descripcionCorta: "Pieza única numerada, vaina de cuero repujado.",
    descripcionLarga:
      "Edición limitada de la línea Pampa. Cada pieza es numerada y firmada. Vaina de cuero repujado a mano por artesanos argentinos. Apta para colección o uso ceremonial.",
    precio: 215000,
    precioMayorista: 150500,
    hojaCm: 30,
    materiales: ["acero", "madera", "cobre"],
    imagen: "/productos/01.jpg",
    destacado: true,
    stock: 2,
  },
  {
    id: "prod-007",
    slug: "criollo-corto-12",
    nombre: "Criollo Corto 12",
    categoria: "criollo",
    descripcionCorta: "Compacto para el día a día. Cabo en madera dura.",
    descripcionLarga:
      "Cuchillo criollo de 12 cm, ideal como herramienta de cinto. Cabo en madera de quebracho con remaches de bronce.",
    precio: 48000,
    precioMayorista: 33600,
    hojaCm: 12,
    materiales: ["acero", "madera"],
    imagen: "/productos/04.jpg",
    stock: 15,
  },
  {
    id: "prod-008",
    slug: "asador-cobre-28",
    nombre: "Asador Cobre 28",
    categoria: "asador",
    descripcionCorta: "Hoja extendida, virolas y cabeza en cobre pulido.",
    descripcionLarga:
      "Para los que mandan el fuego: 28 cm de hoja, cabo de algarrobo con virola y cabeza de cobre pulido a espejo. Una declaración a la mesa.",
    precio: 98000,
    precioMayorista: 68600,
    hojaCm: 28,
    materiales: ["acero", "madera", "cobre"],
    imagen: "/productos/03.jpg",
    stock: 4,
  },
];

export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.destacado);
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
