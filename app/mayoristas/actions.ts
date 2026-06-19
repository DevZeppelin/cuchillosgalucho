"use server";

import { authenticateWholesaler } from "@/app/lib/airtable";

export interface LoginResult {
  ok: boolean;
  error?: string;
  session?: {
    usuario: string;
    nombreComercial: string;
    descuento: number;
    expira: number;
  };
}

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 horas

export async function loginMayoristaAction(formData: FormData): Promise<LoginResult> {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!usuario || !password) {
    return { ok: false, error: "Completá usuario y contraseña" };
  }

  const result = await authenticateWholesaler(usuario, password);
  if (!result.ok) {
    return { ok: false, error: result.error ?? "Credenciales inválidas" };
  }

  return {
    ok: true,
    session: {
      usuario,
      nombreComercial: result.nombreComercial ?? usuario,
      descuento: result.descuento ?? 0,
      expira: Date.now() + SESSION_DURATION_MS,
    },
  };
}
