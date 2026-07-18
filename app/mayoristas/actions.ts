"use server";

import { getAccesoWEB } from "@/app/lib/catalogo";

export interface LoginResult {
  ok: boolean;
  error?: string;
  session?: {
    usuario: string;
    nombreComercial: string;
    descuento: number;
    expira: number;
    mail?: string;
    celular?: string;
  };
}

export interface VentaItem {
  producto: string;
  medida: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

export interface VentaPayload {
  remito: string;
  vendedor: string;
  cliente: string;
  ciudad: string;
  celular: string;
  total: number;
  items: VentaItem[];
}

export interface VentaResult {
  ok: boolean;
  error?: string;
}

const SESSION_MS = 1000 * 60 * 60 * 8; // 8 horas

// Normaliza un celular a solo dígitos
function normCel(v: string): string {
  return v.replace(/\D/g, "");
}

export async function loginMayoristaAction(formData: FormData): Promise<LoginResult> {
  const celularRaw = String(formData.get("celular") ?? "").trim();

  if (!celularRaw) {
    return { ok: false, error: "Ingresá tu número de celular" };
  }

  const celular = normCel(celularRaw);
  if (celular.length < 8) {
    return { ok: false, error: "El número no parece válido" };
  }

  const lista = await getAccesoWEB();

  // Buscar coincidencia — el número puede venir con o sin código de país
  const encontrado = lista.find((r) => {
    const rc = normCel(r.celular);
    return rc === celular || rc.endsWith(celular) || celular.endsWith(rc);
  });

  if (!encontrado) {
    return { ok: false, error: "Celular no registrado. Pedí acceso por WhatsApp." };
  }

  const nombreComercial =
    encontrado.nombre ||
    (encontrado.mail ? encontrado.mail.split("@")[0] : "") ||
    "Mayorista";

  return {
    ok: true,
    session: {
      usuario: celular,
      nombreComercial,
      descuento: 0,
      expira: Date.now() + SESSION_MS,
      mail: encontrado.mail || undefined,
      celular,
    },
  };
}

/**
 * Registra una venta (remito de Raúl) en la hoja VENTAS del Google Sheet,
 * vía el doPost del Apps Script (que crea la hoja si no existe).
 */
export async function registrarVentaAction(payload: VentaPayload): Promise<VentaResult> {
  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) {
    return { ok: false, error: "SHEETS_WEBAPP_URL no está configurada" };
  }

  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    return { ok: false, error: "La venta no tiene productos" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      // text/plain evita el redirect-preflight de Apps Script; el body es JSON igual
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ accion: "venta", ...payload }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json().catch(() => null);
    if (!data?.ok) {
      return { ok: false, error: data?.error ?? "El Apps Script rechazó la venta" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[ventas] Error al registrar la venta:", err);
    return { ok: false, error: "No se pudo registrar la venta en el sheet" };
  }
}
