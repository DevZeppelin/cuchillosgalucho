"use server";

import { getAccesoWEB, getMarkupPct } from "@/app/lib/catalogo";
import type { AccesoWebContacto } from "@/app/lib/types";

// Contraseña del panel de Raúl para agregar contactos a ACCESOS_WEB.
// Se valida de nuevo en el Apps Script como segunda barrera.
const PASSWORD_ACCESOS = "distribuidoraherrera@gmail.com";

// La contraseña es un email, así que en el celular el teclado suele
// capitalizar la primera letra o dejar un espacio al autocompletar.
// Comparamos normalizado para que eso no cuente como incorrecta.
function passwordOk(input: string): boolean {
  return input.trim().toLowerCase() === PASSWORD_ACCESOS;
}

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

export interface VerificarPasswordResult {
  ok: boolean;
  error?: string;
}

/**
 * Verifica la contraseña de Raúl al ingresar por primera vez en un
 * dispositivo nuevo (ver MayoristasGate). Reutiliza la misma contraseña
 * del panel de accesos — solo Raúl la conoce.
 */
export async function verificarPasswordRaulAction(
  formData: FormData,
): Promise<VerificarPasswordResult> {
  const password = String(formData.get("password") ?? "");
  if (!passwordOk(password)) {
    return { ok: false, error: "Contraseña incorrecta" };
  }
  return { ok: true };
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

/**
 * Lista los contactos de la hoja ACCESOS_WEB — usado por el panel de Raúl
 * para elegir un número existente al generar un remito.
 */
export async function listarAccesosWebAction(): Promise<AccesoWebContacto[]> {
  return getAccesoWEB();
}

/**
 * Devuelve el % de ganancia minorista actual (hoja COSTOS, celda M5) —
 * usado en el remito como atajo de "precio de lista minorista".
 */
export async function obtenerMarkupMinoristaAction(): Promise<number | null> {
  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) return null;
  return getMarkupPct(url);
}

export interface AgregarAccesoResult {
  ok: boolean;
  error?: string;
}

/**
 * Agrega un contacto (nombre, celular, ciudad) a la hoja ACCESOS_WEB.
 * Protegido por contraseña — solo Raúl la conoce.
 */
export async function agregarAccesoWebAction(
  formData: FormData,
): Promise<AgregarAccesoResult> {
  const password = String(formData.get("password") ?? "");
  if (!passwordOk(password)) {
    return { ok: false, error: "Contraseña incorrecta" };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const ciudad = String(formData.get("ciudad") ?? "").trim();
  const celular = normCel(String(formData.get("celular") ?? ""));

  if (!nombre) return { ok: false, error: "Ingresá el nombre" };
  if (!ciudad) return { ok: false, error: "Ingresá la ciudad" };
  if (celular.length < 8) return { ok: false, error: "El celular no parece válido" };

  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) {
    return { ok: false, error: "SHEETS_WEBAPP_URL no está configurada" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        accion: "acceso_web",
        password: PASSWORD_ACCESOS,
        nombre,
        celular,
        ciudad,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json().catch(() => null);
    if (!data?.ok) {
      return { ok: false, error: data?.error ?? "El Apps Script rechazó el contacto" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[accesos] Error al agregar contacto:", err);
    return { ok: false, error: "No se pudo agregar el contacto en el sheet" };
  }
}
