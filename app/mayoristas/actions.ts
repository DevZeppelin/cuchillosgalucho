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
