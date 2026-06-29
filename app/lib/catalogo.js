/**
 * Adaptador Google Sheets → Product[]
 *
 * Columnas esperadas en la hoja "WEB":
 *   id, nombre, categoria, cm, medida, precioMayorista,
 *   destacado   — "si" / vacío
 *   imagen      — nombre de archivo (ej: "cabo-ciervo-16.jpg") → se sirve desde /productos/
 *                 También acepta URLs completas (https://...) y links de Google Drive.
 *
 * Si SHEETS_WEBAPP_URL no está definida o la petición falla,
 * devuelve los productos de demostración (MOCK_PRODUCTS).
 */

import { MOCK_PRODUCTS } from "./products";

const PLACEHOLDER_IMG = "/logo.png";

// Precio máximo plausible — celdas con valores > a este son errores de Excel
const MAX_PRECIO = 5_000_000;

// Normaliza clave de columna: "precioMayorista" → "preciomayorista"
function nk(k) {
  return String(k)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, "_");
}

// Primera key del row normalizado que tenga valor no-vacío
function pick(row, ...keys) {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function toTitleCase(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toNumber(v) {
  if (typeof v === "number") return v;
  // Quita símbolos de moneda, espacios y caracteres no numéricos excepto . y ,
  const s = String(v ?? "").trim().replace(/[^\d.,]/g, "");
  if (!s) return 0;

  // Con coma → formato argentino/europeo: coma=decimal, puntos=miles
  // "18.700,00" → 18700  |  "9.880,50" → 9880.5
  if (s.includes(",")) {
    return parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;
  }

  if (s.includes(".")) {
    const parts = s.split(".");
    const lastPart = parts[parts.length - 1];

    // Un solo punto seguido de 1 o 2 dígitos → punto decimal (formato EEUU)
    // "9880.00" → 9880  |  "9880.5" → 9880.5
    if (parts.length === 2 && lastPart.length <= 2) {
      return parseFloat(s) || 0;
    }

    // Punto(s) de miles: 1 punto seguido de 3 dígitos, o múltiples puntos
    // "18.700" → 18700  |  "1.877.200" → 1877200
    return parseFloat(s.replace(/\./g, "")) || 0;
  }

  // Sin separadores → número puro: "18700" → 18700
  return parseFloat(s) || 0;
}

function toBoolean(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return /^(si|s|yes|true|1|x|✓)$/i.test(String(v ?? "").trim());
}

function toMateriales(v) {
  if (!v) return ["acero"];
  if (Array.isArray(v)) return v.map((m) => String(m).trim().toLowerCase()).filter(Boolean);
  return String(v).split(/[,;/\s]+/).map((m) => m.trim().toLowerCase()).filter(Boolean);
}

/**
 * Resuelve el campo imagen:
 *   "01.jpg"                     → /productos/01.jpg
 *   "https://cdn.com/img.jpg"    → https://cdn.com/img.jpg
 *   "https://drive.google.com/file/d/ID/view" → uc?export=view&id=ID
 *   "" / undefined               → imagen placeholder
 */
function resolveImagen(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return PLACEHOLDER_IMG;
  // URL completa o ruta absoluta — usar tal cual
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) {
    // Convertir link de compartir de Drive a link directo
    const drive = s.match(/\/d\/([^/?#]+)/);
    if (drive) return `https://drive.google.com/uc?export=view&id=${drive[1]}`;
    return s;
  }
  // Nombre de archivo → carpeta /productos/
  return `/productos/${s}`;
}

function makeSlug(nombre, id) {
  const base = String(nombre ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "producto"}-${id}`;
}

function rowToProduct(rawRow, index) {
  // Normalizar todas las claves
  const row = {};
  for (const [k, v] of Object.entries(rawRow)) {
    row[nk(k)] = v;
  }

  const id = String(pick(row, "id", "codigo", "sku") ?? index + 1);
  const rawNombre = String(pick(row, "nombre", "name", "producto", "titulo") ?? "Sin nombre").trim();
  const nombre = toTitleCase(rawNombre);
  const slug = makeSlug(rawNombre, id);

  const rawCat = String(pick(row, "categoria", "category", "tipo", "linea") ?? "").trim();
  const categoria = rawCat || "Sin categoría";

  const rawImg = pick(
    row,
    "imagen",           // columna más común
    "foto",
    "image",
    "imagen_url",
    "nombre_imagen",    // "nombre de la imagen"
    "imagen_nombre",
    "archivo",
    "archivo_imagen",
    "img",
  );
  const imagen = resolveImagen(rawImg);

  const precioMayoristaRaw = toNumber(
    pick(row, "preciomayorista", "precio_mayorista", "mayorista", "precio_may") ?? 0
  );
  // Precio público = mayorista + 90%. Si el sheet ya tiene columna "precio", la usa.
  const precioPublicoRaw = toNumber(pick(row, "precio", "price", "valor") ?? 0);
  const precio = precioPublicoRaw > 0
    ? precioPublicoRaw
    : Math.round(precioMayoristaRaw * 1.9);

  const cm = toNumber(pick(row, "cm", "hoja_cm", "hoja", "largo", "medida_cm") ?? 0);
  const medida = String(pick(row, "medida", "talle", "tamano") ?? "").trim();

  return {
    id,
    slug,
    nombre,
    categoria,
    descripcionCorta: medida || (cm > 0 ? `${cm} cm` : ""),
    descripcionLarga: String(pick(row, "descripcion_larga", "descripcion", "description") ?? "").trim(),
    precio,
    precioMayorista: precioMayoristaRaw > 0 ? precioMayoristaRaw : undefined,
    hojaCm: cm,
    materiales: toMateriales(pick(row, "materiales", "material", "materials")),
    imagen,
    imagenSecundaria: String(pick(row, "imagen_secundaria", "imagen2") ?? "") || undefined,
    destacado: toBoolean(pick(row, "destacado", "featured", "principal")),
    stock: (() => {
      const s = pick(row, "stock", "existencia", "cantidad");
      return s != null && s !== "" ? toNumber(s) : undefined;
    })(),
  };
}

/** @returns {Promise<import("./types").Product[]>} */
export async function getCatalogo() {
  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) return MOCK_PRODUCTS;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json();
    const rows = Array.isArray(raw)
      ? raw
      : (raw.data ?? raw.items ?? raw.productos ?? raw.catalogo ?? []);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("[catalogo] Hoja vacía o formato inesperado — usando datos demo");
      return MOCK_PRODUCTS;
    }

    return rows
      .filter((r) => r && typeof r === "object")
      .map(rowToProduct)
      .filter((p) => {
        // Descartar filas con errores de Excel (#REF!, precios imposibles)
        if (p.nombre.includes("#REF!") || p.nombre.includes("#N/A")) return false;
        if (p.precio > MAX_PRECIO) return false;
        return true;
      });
  } catch (err) {
    console.error("[catalogo] Error al leer Google Sheet:", err?.message ?? err);
    return MOCK_PRODUCTS;
  }
}

/**
 * Lee la hoja ACCESO_WEB del mismo Google Sheet.
 * Columnas esperadas: nombre (opcional), mail (opcional), celular (requerido).
 * Requiere que el Apps Script acepte ?sheet=ACCESO_WEB.
 * Se llama sin cache para que los cambios en la hoja sean inmediatos.
 *
 * @returns {Promise<Array<{nombre: string, mail: string, celular: string}>>}
 */
export async function getAccesoWEB() {
  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) return [];

  try {
    const res = await fetch(`${url}?sheet=ACCESOS_WEB`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.json();
    const rows = Array.isArray(raw)
      ? raw
      : (raw.data ?? raw.items ?? []);

    return rows
      .filter((r) => r && typeof r === "object")
      .map((rawRow) => {
        const row = {};
        for (const [k, v] of Object.entries(rawRow)) row[nk(k)] = v;
        return {
          nombre:  String(pick(row, "nombre", "name", "comercio", "razon_social") ?? "").trim(),
          mail:    String(pick(row, "mail", "email", "correo", "e_mail") ?? "").trim().toLowerCase(),
          celular: String(pick(row, "celular", "cel", "telefono", "phone", "whatsapp") ?? "")
            .replace(/\D/g, ""),
        };
      })
      .filter((r) => r.celular.length >= 6); // descartar filas sin celular
  } catch (err) {
    console.error("[acceso] Error al leer ACCESO_WEB:", err?.message ?? err);
    return [];
  }
}

export async function getCatalogoPorCategoria() {
  const prods = await getCatalogo();
  return prods.reduce((acc, p) => {
    (acc[p.categoria] ??= []).push(p);
    return acc;
  }, {});
}
