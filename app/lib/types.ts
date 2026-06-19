export type ProductCategory =
  | "asador"
  | "criollo"
  | "tactico"
  | "cocina"
  | "campo"
  | "coleccion";

export type ProductMaterial = "acero" | "madera" | "cobre" | "asta" | "carbono";

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: ProductCategory;
  descripcionCorta: string;
  descripcionLarga: string;
  precio: number;
  precioMayorista?: number;
  hojaCm: number;
  materiales: ProductMaterial[];
  imagen: string;
  imagenSecundaria?: string;
  destacado?: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  cantidad: number;
  precioUnit: number;
}

export interface WholesaleSession {
  usuario: string;
  nombreComercial: string;
  descuento?: number;
  expira: number;
}
