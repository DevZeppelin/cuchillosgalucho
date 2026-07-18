import type { CartItem } from "./types";

/**
 * Teléfono del dueño. Reemplazar con la variable de entorno cuando se conecte.
 * Formato internacional sin `+` ni espacios. Argentina: 54 9 11 ...
 */
export const OWNER_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5492241672338";

/** Celular de Raúl (dueño) — habilita el flujo de remito con registro en VENTAS */
export const RAUL_CEL = "2241672338";

/** Mensaje del botón "Solicitar acceso" de la página de mayoristas */
export const MENSAJE_SOLICITAR_ACCESO =
  "Hola Raúl, solicito acceso a los precios mayoristas de la web de Cuchillos Galucho. Mi número es este desde el que te escribo.";

export function esRaul(celular?: string): boolean {
  const c = (celular ?? "").replace(/\D/g, "");
  return c !== "" && (c === RAUL_CEL || c.endsWith(RAUL_CEL));
}

/**
 * Normaliza un celular argentino al formato de wa.me (549 + área + número).
 * "2241512345" → "5492241512345" · "+54 9 2241..." → "5492241..."
 */
export function normalizarCelularAR(celular: string): string {
  let c = celular.replace(/\D/g, "");
  if (c.startsWith("549")) return c;
  if (c.startsWith("54")) return `549${c.slice(2)}`;
  if (c.startsWith("0")) c = c.slice(1);
  return `549${c}`;
}

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export interface WhatsAppOrderOptions {
  items: CartItem[];
  mayorista?: { nombreComercial: string; usuario: string };
}

export function buildOrderMessage({
  items,
  mayorista,
}: WhatsAppOrderOptions): string {
  const lineas: string[] = [];
  lineas.push("*Nuevo pedido — Cuchillos Galucho*");
  if (mayorista) {
    lineas.push(`Tipo: *Mayorista*`);
    lineas.push(`Comercio: ${mayorista.nombreComercial}`);
    lineas.push(`Usuario: ${mayorista.usuario}`);
  } else {
    lineas.push("Tipo: Minorista");
  }
  lineas.push("");
  lineas.push("*Productos:*");
  let total = 0;
  for (const item of items) {
    const subtotal = item.precioUnit * item.cantidad;
    total += subtotal;
    lineas.push(
      `• ${item.product.nombre} × ${item.cantidad} — ${formatARS(subtotal)}`,
    );
  }
  lineas.push("");
  lineas.push(`*Total: ${formatARS(total)}*`);
  lineas.push("");
  lineas.push("¡Hola! Quisiera coordinar este pedido.");
  return lineas.join("\n");
}

/* ── Remito (flujo de Raúl) ─────────────────────────────────── */

export interface RemitoCliente {
  nombre: string;
  ciudad: string;
  celular: string;
}

export interface RemitoData {
  numero: string;
  fecha: Date;
  cliente: RemitoCliente;
  items: CartItem[];
  total: number;
}

/** Número de remito legible basado en fecha y hora: "20260718-1432" */
export function generarNumeroRemito(fecha: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}-${p(fecha.getHours())}${p(fecha.getMinutes())}`;
}

export function buildRemitoMessage(remito: RemitoData): string {
  const lineas: string[] = [];
  lineas.push(`*Remito Nº ${remito.numero} — Cuchillos Galucho*`);
  lineas.push(`Fecha: ${remito.fecha.toLocaleDateString("es-AR")}`);
  lineas.push(`Cliente: ${remito.cliente.nombre} — ${remito.cliente.ciudad}`);
  lineas.push("");
  lineas.push("*Detalle:*");
  for (const item of remito.items) {
    const medida = item.product.descripcionCorta
      ? ` (${item.product.descripcionCorta})`
      : "";
    lineas.push(
      `• ${item.product.nombre}${medida}\n   ${item.cantidad} × ${formatARS(item.precioUnit)} = ${formatARS(item.precioUnit * item.cantidad)}`,
    );
  }
  lineas.push("");
  lineas.push(`*Total: ${formatARS(remito.total)}*`);
  lineas.push("");
  lineas.push("¡Gracias por tu compra!");
  return lineas.join("\n");
}

export function buildWhatsAppUrl(
  message: string,
  phone: string = OWNER_WHATSAPP,
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
