"use client";

/**
 * Contraseña del panel de Raúl, validada y guardada en este dispositivo.
 *
 * Se pide UNA sola vez por dispositivo — al ingresar como Raúl en
 * `/mayoristas` — y después se reutiliza para todas las acciones del panel
 * (agregar acceso mayorista, etc.) sin volver a pedirla.
 *
 * El valor se guarda normalizado (trim + minúsculas) porque la contraseña
 * es un email y el teclado del celular suele capitalizar o dejar espacios.
 */
const RAUL_PWD_KEY = "galucho.raul.accesos.pwd.v1";

export function getRaulPassword(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(RAUL_PWD_KEY) ?? "";
  } catch {
    return "";
  }
}

export function tieneRaulPassword(): boolean {
  return getRaulPassword() !== "";
}

export function guardarRaulPassword(pwd: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RAUL_PWD_KEY, pwd.trim().toLowerCase());
  } catch {
    // Modo privado / storage bloqueado: seguimos sin persistir.
  }
}

export function olvidarRaulPassword(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RAUL_PWD_KEY);
  } catch {
    // no-op
  }
}
