// Las categorías y materiales vienen del Google Sheet — usamos string para flexibilidad
export type ProductCategory = string;
export type ProductMaterial = string;

export interface SizeOption {
  id: string;
  medida: string;   // label para mostrar: "10 CM", "26 CM", "HACHA 16", "Unidad"…
  cm: number;
  precio: number;
  precioMayorista?: number;
  stock?: number;
}

export interface GroupedProduct {
  key: string;            // categoria:::nombre (clave única)
  nombre: string;
  categoria: string;
  imagen: string;
  imagenes?: string[];    // todas las imágenes del carrusel (imagen === imagenes[0])
  materiales: string[];
  destacado: boolean;
  slug: string;
  sizes: SizeOption[];
}

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
  imagenes?: string[];    // todas las imágenes del carrusel (imagen === imagenes[0])
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
  mail?: string;     // email del mayorista — se usa al enviar consulta por WhatsApp
  celular?: string;  // celular con el que ingresó
}
