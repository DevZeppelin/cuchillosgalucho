/**
 * Genera la imagen PNG del remito (flujo de Raúl) con canvas en el navegador:
 * encabezado con logo, datos del cliente y tabla con cantidad, precio
 * unitario, subtotal por ítem y total.
 */

import type { RemitoData } from "./whatsapp";
import { formatARS } from "./whatsapp";

const W = 1000;
const MARGIN = 48;
const ROW_H = 56;

const COLOR_FONDO = "#ffffff";
const COLOR_HEADER = "#161b22";
const COLOR_TEXTO = "#1c2128";
const COLOR_SUAVE = "#6b7280";
const COLOR_COBRE = "#b87333";
const COLOR_ZEBRA = "#f6f4f1";
const COLOR_LINEA = "#e5e1db";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Recorta un texto con "…" para que entre en maxWidth
function truncar(ctx: CanvasRenderingContext2D, texto: string, maxWidth: number): string {
  if (ctx.measureText(texto).width <= maxWidth) return texto;
  let t = texto;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t}…`;
}

export async function generarRemitoImagen(remito: RemitoData): Promise<Blob> {
  const rows = remito.items;
  const H = 150 + 190 + 48 + rows.length * ROW_H + 200;

  const canvas = document.createElement("canvas");
  const scale = 2; // 2x para que el PNG se vea nítido en pantallas retina
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no soportado");
  ctx.scale(scale, scale);

  // Fondo
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, W, H);

  /* ── Encabezado ── */
  ctx.fillStyle = COLOR_HEADER;
  ctx.fillRect(0, 0, W, 150);

  const logo = await loadImage("/logo.png");
  if (logo) {
    const lh = 90;
    const lw = (logo.width / logo.height) * lh;
    ctx.drawImage(logo, MARGIN, 30, lw, lh);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px Georgia, serif";
  ctx.textAlign = "right";
  ctx.fillText("CUCHILLOS GALUCHO", W - MARGIN, 62);
  ctx.fillStyle = COLOR_COBRE;
  ctx.font = "bold 22px Arial, sans-serif";
  ctx.fillText(`REMITO Nº ${remito.numero}`, W - MARGIN, 96);
  ctx.fillStyle = "#c9d1d9";
  ctx.font = "16px Arial, sans-serif";
  ctx.fillText(`Fecha: ${remito.fecha.toLocaleDateString("es-AR")}`, W - MARGIN, 124);

  /* ── Datos del cliente ── */
  let y = 190;
  ctx.textAlign = "left";
  ctx.fillStyle = COLOR_SUAVE;
  ctx.font = "bold 13px Arial, sans-serif";
  ctx.fillText("CLIENTE", MARGIN, y);
  y += 28;
  ctx.fillStyle = COLOR_TEXTO;
  ctx.font = "bold 20px Arial, sans-serif";
  ctx.fillText(remito.cliente.nombre, MARGIN, y);
  y += 26;
  ctx.font = "16px Arial, sans-serif";
  ctx.fillStyle = COLOR_SUAVE;
  ctx.fillText(`${remito.cliente.ciudad}  ·  Cel: ${remito.cliente.celular}`, MARGIN, y);
  y += 36;

  /* ── Tabla ── */
  const colCant = W - MARGIN - 420;
  const colUnit = W - MARGIN - 240;
  const colSub = W - MARGIN;
  const anchoProducto = colCant - MARGIN - 60;

  ctx.fillStyle = COLOR_COBRE;
  ctx.fillRect(MARGIN, y, W - MARGIN * 2, 40);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("PRODUCTO", MARGIN + 16, y + 26);
  ctx.textAlign = "center";
  ctx.fillText("CANT.", colCant, y + 26);
  ctx.textAlign = "right";
  ctx.fillText("P. UNITARIO", colUnit, y + 26);
  ctx.fillText("SUBTOTAL", colSub - 16, y + 26);
  y += 40;

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    if (i % 2 === 1) {
      ctx.fillStyle = COLOR_ZEBRA;
      ctx.fillRect(MARGIN, y, W - MARGIN * 2, ROW_H);
    }

    const medida = item.product.descripcionCorta;
    const baseY = medida ? y + 24 : y + 34;

    ctx.textAlign = "left";
    ctx.fillStyle = COLOR_TEXTO;
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText(truncar(ctx, item.product.nombre, anchoProducto), MARGIN + 16, baseY);
    if (medida) {
      ctx.fillStyle = COLOR_SUAVE;
      ctx.font = "13px Arial, sans-serif";
      ctx.fillText(medida, MARGIN + 16, baseY + 20);
    }

    ctx.fillStyle = COLOR_TEXTO;
    ctx.font = "16px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(item.cantidad), colCant, y + 34);
    ctx.textAlign = "right";
    ctx.fillText(formatARS(item.precioUnit), colUnit, y + 34);
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.fillText(formatARS(item.precioUnit * item.cantidad), colSub - 16, y + 34);

    y += ROW_H;
    ctx.strokeStyle = COLOR_LINEA;
    ctx.beginPath();
    ctx.moveTo(MARGIN, y);
    ctx.lineTo(W - MARGIN, y);
    ctx.stroke();
  }

  /* ── Total ── */
  y += 36;
  ctx.textAlign = "right";
  ctx.fillStyle = COLOR_SUAVE;
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("TOTAL", colUnit, y);
  ctx.fillStyle = COLOR_COBRE;
  ctx.font = "bold 30px Georgia, serif";
  ctx.fillText(formatARS(remito.total), colSub - 16, y + 2);

  /* ── Pie ── */
  y += 60;
  ctx.textAlign = "center";
  ctx.fillStyle = COLOR_SUAVE;
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("Cuchillos Galucho — ¡Gracias por tu compra!", W / 2, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen del remito"));
    }, "image/png");
  });
}

/** Descarga un blob como archivo (fallback cuando no hay Web Share API) */
export function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Intenta compartir la imagen con la Web Share API (en el celular abre el
 * selector con WhatsApp); si no está disponible, la descarga.
 * Devuelve "compartido" o "descargado" según lo que haya pasado.
 */
export async function compartirODescargarRemito(
  blob: Blob,
  numeroRemito: string,
): Promise<"compartido" | "descargado"> {
  const archivo = new File([blob], `remito-${numeroRemito}.png`, { type: "image/png" });
  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: `Remito ${numeroRemito}` });
      return "compartido";
    } catch {
      // usuario canceló el share → caer a descarga
    }
  }
  descargarBlob(blob, `remito-${numeroRemito}.png`);
  return "descargado";
}
