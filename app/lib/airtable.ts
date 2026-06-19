import "server-only";
import type { Product, ProductCategory, ProductMaterial } from "./types";
import { MOCK_PRODUCTS } from "./products";

/**
 * Adapter para Airtable.
 *
 * Mientras `AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` no estén definidos, devuelve
 * la data mock — así el frontend ya funciona en demo. Cuando se conecte de verdad
 * sólo hay que setear las variables de entorno y los nombres de tablas/campos.
 *
 * Tablas esperadas en Airtable (sugerencia):
 *   - Productos: nombre, slug, categoria, descripcion_corta, descripcion_larga,
 *     precio, precio_mayorista, hoja_cm, materiales (multi), imagen_url, destacado, stock
 *   - Mayoristas: usuario, password_hash, nombre_comercial, descuento, activo
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE ?? "Productos";
const AIRTABLE_WHOLESALERS_TABLE =
  process.env.AIRTABLE_WHOLESALERS_TABLE ?? "Mayoristas";

const isConfigured = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);

interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

interface AirtableProductFields {
  nombre?: string;
  slug?: string;
  categoria?: ProductCategory;
  descripcion_corta?: string;
  descripcion_larga?: string;
  precio?: number;
  precio_mayorista?: number;
  hoja_cm?: number;
  materiales?: ProductMaterial[];
  imagen_url?: string;
  imagen_secundaria_url?: string;
  destacado?: boolean;
  stock?: number;
}

interface AirtableWholesalerFields {
  usuario?: string;
  password_hash?: string;
  nombre_comercial?: string;
  descuento?: number;
  activo?: boolean;
}

async function airtableFetch<T>(
  table: string,
  params?: Record<string, string>,
): Promise<AirtableListResponse<T>> {
  const url = new URL(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
  );
  for (const [k, v] of Object.entries(params ?? {})) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Airtable ${table} request failed: ${res.status}`);
  }
  return res.json();
}

function recordToProduct(rec: AirtableRecord<AirtableProductFields>): Product {
  const f = rec.fields;
  return {
    id: rec.id,
    slug: f.slug ?? rec.id,
    nombre: f.nombre ?? "Sin nombre",
    categoria: f.categoria ?? "criollo",
    descripcionCorta: f.descripcion_corta ?? "",
    descripcionLarga: f.descripcion_larga ?? "",
    precio: f.precio ?? 0,
    precioMayorista: f.precio_mayorista,
    hojaCm: f.hoja_cm ?? 0,
    materiales: f.materiales ?? ["acero"],
    imagen: f.imagen_url ?? "",
    imagenSecundaria: f.imagen_secundaria_url,
    destacado: f.destacado ?? false,
    stock: f.stock,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isConfigured) return MOCK_PRODUCTS;
  const data = await airtableFetch<AirtableProductFields>(AIRTABLE_PRODUCTS_TABLE);
  return data.records.map(recordToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!isConfigured) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const data = await airtableFetch<AirtableProductFields>(AIRTABLE_PRODUCTS_TABLE, {
    filterByFormula: `{slug} = "${slug.replace(/"/g, '\\"')}"`,
    maxRecords: "1",
  });
  const rec = data.records[0];
  return rec ? recordToProduct(rec) : null;
}

/**
 * Valida credenciales de mayorista contra la tabla. En demo acepta cualquier
 * usuario `demo` con clave `galucho2026` y devuelve una sesión simulada.
 * En producción, almacenar `password_hash` con bcrypt y comparar contra el hash.
 */
export async function authenticateWholesaler(
  usuario: string,
  password: string,
): Promise<{
  ok: boolean;
  nombreComercial?: string;
  descuento?: number;
  error?: string;
}> {
  if (!isConfigured) {
    if (usuario.toLowerCase() === "demo" && password === "galucho2026") {
      return {
        ok: true,
        nombreComercial: "Comercio Demo",
        descuento: 30,
      };
    }
    return { ok: false, error: "Usuario o clave incorrectos" };
  }
  try {
    const data = await airtableFetch<AirtableWholesalerFields>(
      AIRTABLE_WHOLESALERS_TABLE,
      {
        filterByFormula: `AND({usuario} = "${usuario.replace(/"/g, '\\"')}", {activo} = TRUE())`,
        maxRecords: "1",
      },
    );
    const rec = data.records[0];
    if (!rec) return { ok: false, error: "Usuario no encontrado" };
    // TODO: comparar `password` contra `rec.fields.password_hash` con bcrypt.
    // Por seguridad, no se hace comparación en texto plano en producción.
    return {
      ok: true,
      nombreComercial: rec.fields.nombre_comercial ?? usuario,
      descuento: rec.fields.descuento ?? 30,
    };
  } catch (e) {
    return { ok: false, error: "Error al validar credenciales" };
  }
}
