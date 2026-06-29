import type { CartItem } from "./types";

/**
 * Teléfono del dueño. Reemplazar con la variable de entorno cuando se conecte.
 * Formato internacional sin `+` ni espacios. Argentina: 54 9 11 ...
 */
export const OWNER_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5492241672338";

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

export function buildWhatsAppUrl(
  message: string,
  phone: string = OWNER_WHATSAPP,
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
