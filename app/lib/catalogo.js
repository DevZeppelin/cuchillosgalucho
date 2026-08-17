/**
 * Adaptador Google Sheets → Product[]
 *
 * Columnas de la hoja "INVENTARIO" (las sirve el Apps Script, ver apps-script/Code.gs):
 *   ID          — identificador de la fila
 *   ORDEN       — orden de aparición en la web (menor primero)
 *   IMAGEN      — rango de fotos, ej: "7-9" → 7.png, 8.png, 9.png
 *                 en /productos/. También acepta número suelto ("5" → 5.png),
 *                 foto + foto de caja compartida ("107-CAJA6", "107-109-CAJA12",
 *                 "136-cajaDOBLE" o "82-84-cajaPARR" — el sufijo de la caja puede
 *                 ser un número o un nombre), nombre de archivo con extensión,
 *                 URLs y links de Google Drive.
 *   SHEET       — categoría del producto (ej: "FINOX")
 *   MODELO      — medida/variante (ej: "30 cm") → una fila por medida
 *   DESCRIPCION — nombre del producto (las filas con igual DESCRIPCION+SHEET
 *                 se agrupan en una tarjeta con selector de medidas)
 *   UNIDADES    — stock
 *   TOTAL       — precio mayorista; el precio público = TOTAL × (1 + markup/100).
 *                 El markup vive en la hoja COSTOS, celda M5 (ej: 90 = +90%)
 *                 y lo sirve el Apps Script vía ?config=precios.
 *
 * Si SHEETS_WEBAPP_URL no está definida o la petición falla,
 * devuelve los productos de demostración (MOCK_PRODUCTS).
 */

import { MOCK_PRODUCTS } from "./products";

const PLACEHOLDER_IMG = "/logo.png";

// Precio máximo plausible — celdas con valores > a este son errores de Excel
const MAX_PRECIO = 5_000_000;

// % de ganancia minorista si no se puede leer COSTOS!M5 del sheet
const MARKUP_PCT_DEFAULT = 90;

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

const IMG_EXT_RE = /\.(png|jpe?g|webp|avif|gif)$/i;
const RANGE_RE = /^(\d+)\s*-\s*(\d+)$/;
const BARE_NUM_RE = /^\d+$/;
// Ítem con foto de caja compartida (la misma caja se usa en varios productos):
// "107-CAJA6" → 107.png + caja6.png  |  "107-109-CAJA12" → 107,108,109.png + caja12.png
// El sufijo de la caja también puede ser un nombre, no solo un número:
// "136-cajaDOBLE" → 136.png + cajaDOBLE.png  |  "82-84-cajaPARR" → 82,83,84.png + cajaPARR.png
const CAJA_RE = /^(\d+)(?:-(\d+))?-caja([a-z0-9]+)$/i;
// Google Sheets en formato DD-MM autoconvierte celdas tipo "9-10" en una fecha real
// (ej: "2026-10-09T07:00:00.000Z" = 9 de octubre). Detectamos ese ISO y reconstruimos
// el rango original a partir del día/mes en UTC (evita corromper el valor de vuelta).
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
// Misma autoconversión pero con getDisplayValues(): "9-10" se muestra "9/10/2026" o "9/10"
const SLASH_DATE_RE = /^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/;

// "7" → "/productos/7.png" — las fotos están numeradas sin ceros a la izquierda
function numToImg(n) {
  return `/productos/${n}.png`;
}

function expandRange(a, b) {
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const imgs = [];
  for (let n = lo; n <= hi; n++) imgs.push(numToImg(n));
  return imgs;
}

/**
 * Resuelve el campo imagen a un array de imágenes (carrusel):
 *   "7-9"                        → ["/productos/7.png", "8.png", "9.png"]   (rango → una imagen por número)
 *   "5"                          → ["/productos/5.png"]                     (número suelto sin extensión)
 *   "9/10/2026" o "9/10"         → ["/productos/9.png", "10.png"]           (Sheets convirtió "9-10" en fecha → se reconstruye)
 *   "2026-10-09T07:00:00.000Z"   → ídem anterior (fecha serializada como ISO)
 *   "107-CAJA6"                  → ["/productos/107.png", "caja6.png"]      (foto + foto de caja compartida entre varios ítems)
 *   "107-109-CAJA12"             → ["/productos/107.png", "108.png", "109.png", "caja12.png"]  (rango + foto de caja)
 *   "136-cajaDOBLE"              → ["/productos/136.png", "cajaDOBLE.png"]  (sufijo de caja con nombre, no solo número)
 *   "82-84-cajaPARR"             → ["/productos/82.png", "83.png", "84.png", "cajaPARR.png"]    (rango + foto de caja con nombre)
 *   "01.jpg"                     → ["/productos/01.jpg"]                    (con extensión → respeta el nombre tal cual)
 *   "https://cdn.com/img.jpg"    → ["https://cdn.com/img.jpg"]
 *   "https://drive.google.com/file/d/ID/view" → ["uc?export=view&id=ID"]
 *   "" / undefined               → [imagen placeholder]
 */
function resolveImagenes(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return [PLACEHOLDER_IMG];

  // URL completa o ruta absoluta — usar tal cual
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) {
    // Convertir link de compartir de Drive a link directo
    const drive = s.match(/\/d\/([^/?#]+)/);
    if (drive) return [`https://drive.google.com/uc?export=view&id=${drive[1]}`];
    return [s];
  }

  // Ya trae extensión de imagen → respeta el nombre tal cual (aunque tenga guion, ej: "105-110.png")
  if (IMG_EXT_RE.test(s)) return [`/productos/${s}`];

  // Fecha ISO (Sheets autoconvirtió el rango) → recuperar día/mes como rango
  const isoDate = s.match(ISO_DATE_RE);
  if (isoDate) {
    const day = parseInt(isoDate[3], 10);
    const month = parseInt(isoDate[2], 10);
    return expandRange(day, month);
  }

  // Fecha mostrada "9/10" o "9/10/2026" (ídem, con getDisplayValues) → día/mes como rango
  const slashDate = s.match(SLASH_DATE_RE);
  if (slashDate) {
    return expandRange(parseInt(slashDate[1], 10), parseInt(slashDate[2], 10));
  }

  // Foto(s) numerada(s) + foto de caja compartida (ej: "107-CAJA6", "107-109-CAJA12")
  const caja = s.match(CAJA_RE);
  if (caja) {
    const [, first, second, cajaSufijo] = caja;
    const imgs = second
      ? expandRange(parseInt(first, 10), parseInt(second, 10))
      : [numToImg(parseInt(first, 10))];
    imgs.push(`/productos/caja${cajaSufijo}.png`);
    return imgs;
  }

  // Rango sin extensión (ej: "1-3", "7-9") → carrusel con una imagen por número
  const range = s.match(RANGE_RE);
  if (range) {
    return expandRange(parseInt(range[1], 10), parseInt(range[2], 10));
  }

  // Número suelto sin extensión → foto numerada
  if (BARE_NUM_RE.test(s)) return [numToImg(parseInt(s, 10))];

  // Nombre de archivo sin extensión reconocida → carpeta /productos/ tal cual
  return [`/productos/${s}`];
}

// La fila tiene ORDEN = 0 explícito en el sheet (no vacío) → se oculta del catálogo
function tieneOrdenCero(rawRow) {
  const row = {};
  for (const [k, v] of Object.entries(rawRow)) row[nk(k)] = v;
  const raw = pick(row, "orden");
  return raw !== undefined && String(raw).trim() === "0";
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

function rowToProduct(rawRow, index, markupPct = MARKUP_PCT_DEFAULT) {
  // Normalizar todas las claves
  const row = {};
  for (const [k, v] of Object.entries(rawRow)) {
    row[nk(k)] = v;
  }

  const id = String(pick(row, "id", "codigo", "sku") ?? index + 1);
  // DESCRIPCION es el nombre del producto en la hoja INVENTARIO
  const rawNombre = String(pick(row, "nombre", "descripcion", "name", "producto", "titulo") ?? "Sin nombre").trim();
  const nombre = toTitleCase(rawNombre);
  const slug = makeSlug(rawNombre, id);

  // SHEET es la categoría en la hoja INVENTARIO (con TIPOHOJA de respaldo)
  const rawCat = String(pick(row, "categoria", "sheet", "tipohoja", "category", "tipo", "linea") ?? "").trim();
  const categoria = toTitleCase(rawCat) || "Sin categoría";

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
  const imagenes = resolveImagenes(rawImg);
  const imagen = imagenes[0];

  // TOTAL de la hoja INVENTARIO = precio mayorista
  const precioMayoristaRaw = toNumber(
    pick(row, "total", "preciomayorista", "precio_mayorista", "mayorista", "precio_may") ?? 0
  );
  // Precio público = mayorista + markup% (COSTOS!M5). Si el sheet ya tiene columna "precio", la usa.
  const precioPublicoRaw = toNumber(pick(row, "precio", "price") ?? 0);
  const precio = precioPublicoRaw > 0
    ? precioPublicoRaw
    : Math.round(precioMayoristaRaw * (1 + markupPct / 100));

  // MODELO trae la medida ("30 cm", "10 cm"). Ojo: la columna HOJA ahora es un costo, no cm.
  const medida = String(pick(row, "modelo", "medida", "talle", "tamano") ?? "").trim();
  const cmDeMedida = medida.match(/(\d+(?:[.,]\d+)?)\s*cm/i);
  const cm = cmDeMedida
    ? toNumber(cmDeMedida[1])
    : toNumber(pick(row, "cm", "hoja_cm", "largo", "medida_cm") ?? 0);

  return {
    id,
    slug,
    nombre,
    categoria,
    orden: toNumber(pick(row, "orden") ?? 0),
    descripcionCorta: medida || (cm > 0 ? `${cm} cm` : ""),
    // "descripcion" NO va acá: en la hoja INVENTARIO es el nombre del producto
    descripcionLarga: String(pick(row, "descripcion_larga") ?? "").trim(),
    precio,
    precioMayorista: precioMayoristaRaw > 0 ? precioMayoristaRaw : undefined,
    hojaCm: cm,
    materiales: toMateriales(pick(row, "materiales", "material", "materials")),
    imagen,
    imagenes,
    imagenSecundaria: String(pick(row, "imagen_secundaria", "imagen2") ?? "") || undefined,
    destacado: toBoolean(pick(row, "destacado", "featured", "principal")),
    stock: (() => {
      const s = pick(row, "unidades", "stock", "existencia", "cantidad");
      return s != null && s !== "" ? toNumber(s) : undefined;
    })(),
  };
}

/**
 * Lee el % de ganancia minorista (hoja COSTOS, celda M5) vía ?config=precios.
 * Si falla o el valor no es válido, usa MARKUP_PCT_DEFAULT.
 */
export async function getMarkupPct(url) {
  try {
    const res = await fetch(`${url}?config=precios`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const pct = toNumber(raw?.markupPct);
    if (pct > 0) return pct;
  } catch (err) {
    console.error("[catalogo] No se pudo leer el markup (COSTOS!M5):", err?.message ?? err);
  }
  return MARKUP_PCT_DEFAULT;
}

/** @returns {Promise<import("./types").Product[]>} */
export async function getCatalogo() {
  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) return MOCK_PRODUCTS;

  try {
    const markupPromise = getMarkupPct(url);
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

    const markupPct = await markupPromise;

    return rows
      .filter((r) => r && typeof r === "object")
      .filter((r) => !tieneOrdenCero(r))
      .map((r, i) => rowToProduct(r, i, markupPct))
      .filter((p) => {
        // Descartar filas con errores de Excel (#REF!, precios imposibles)
        if (p.nombre.includes("#REF!") || p.nombre.includes("#N/A")) return false;
        if (p.precio > MAX_PRECIO) return false;
        // Filas sin nombre ni precio (separadores, subtotales, etc.)
        if (p.nombre === "Sin Nombre" && p.precio <= 0) return false;
        return true;
      })
      // Respetar la columna ORDEN de la hoja (sin orden → al final)
      .sort((a, b) => (a.orden || Infinity) - (b.orden || Infinity));
  } catch (err) {
    console.error("[catalogo] Error al leer Google Sheet:", err?.message ?? err);
    return MOCK_PRODUCTS;
  }
}

/**
 * Lee la hoja ACCESO_WEB del mismo Google Sheet.
 * Columnas esperadas: nombre (opcional), mail (opcional), ciudad (opcional),
 * celular (requerido). Requiere que el Apps Script acepte ?sheet=ACCESO_WEB.
 * Se llama sin cache para que los cambios en la hoja sean inmediatos.
 *
 * @returns {Promise<Array<{nombre: string, mail: string, ciudad: string, celular: string}>>}
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
          ciudad:  String(pick(row, "ciudad", "localidad", "city") ?? "").trim(),
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
