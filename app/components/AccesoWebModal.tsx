"use client";

import { useState } from "react";
import { agregarAccesoWebAction } from "@/app/mayoristas/actions";

// Guarda la contraseña del panel de Raúl en este dispositivo después de
// validarla una vez, así no se vuelve a pedir para agregar otro contacto.
const ACCESO_PWD_KEY = "galucho.raul.accesos.pwd.v1";

function passwordGuardada(): string {
  return typeof window !== "undefined" ? localStorage.getItem(ACCESO_PWD_KEY) ?? "" : "";
}

/**
 * Modal del panel de Raúl para agregar un contacto mayorista (nombre,
 * celular, ciudad) a la hoja ACCESOS_WEB. Protegido por contraseña, que se
 * guarda en el dispositivo tras la primera vez.
 */
export function AccesoWebModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [password, setPassword] = useState(passwordGuardada);
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  if (!open) return null;

  const pedirPassword = password === "";

  const cerrar = () => {
    setNombre("");
    setCiudad("");
    setCelular("");
    setError(null);
    setOk(false);
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("password", password);
      fd.set("nombre", nombre);
      fd.set("ciudad", ciudad);
      fd.set("celular", celular);
      const result = await agregarAccesoWebAction(fd);
      if (!result.ok) {
        // Si la contraseña guardada dejó de ser válida, la olvidamos para
        // que se vuelva a pedir en el próximo intento.
        if (pedirPassword === false) {
          localStorage.removeItem(ACCESO_PWD_KEY);
          setPassword("");
        }
        setError(result.error ?? "No se pudo agregar el contacto");
        return;
      }
      if (pedirPassword) localStorage.setItem(ACCESO_PWD_KEY, password);
      setOk(true);
      setNombre("");
      setCiudad("");
      setCelular("");
    } catch {
      setError("No se pudo agregar el contacto. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full bg-stone-50 dark:bg-steel-950/70 border border-stone-300 dark:border-steel-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/30 outline-none rounded-md px-4 py-3 text-stone-900 dark:text-steel-50 placeholder:text-stone-400 dark:placeholder:text-steel-600 transition-all";
  const labelClass = "text-xs uppercase tracking-widest text-stone-500 dark:text-steel-300";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={cerrar}
        className="absolute inset-0 bg-black/60 dark:bg-steel-950/85 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="Agregar acceso mayorista"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-steel-900 border border-stone-200 dark:border-steel-700 shadow-2xl p-6 md:p-8 animate-fade-in"
      >
        <button
          onClick={cerrar}
          className="absolute top-4 right-4 text-stone-400 dark:text-steel-300 hover:text-copper-500 transition-colors p-2 -m-2"
          aria-label="Cerrar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-xs uppercase tracking-[0.3em] text-copper-500 dark:text-copper-400 mb-2">
          Panel de Raúl
        </p>
        <h2 className="font-display text-2xl text-stone-900 dark:text-steel-50">
          Agregar acceso mayorista
        </h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-steel-300">
          Se agrega a la hoja ACCESOS_WEB para que el cliente pueda ingresar
          con su celular.
        </p>

        {ok ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-sm px-3 py-2">
              ✓ Contacto agregado
            </div>
            <button
              onClick={() => setOk(false)}
              className="w-full bg-copper-500 hover:bg-copper-400 text-steel-950 font-semibold uppercase tracking-widest text-sm py-3.5 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Agregar otro
            </button>
            <button
              onClick={cerrar}
              className="w-full text-xs text-stone-400 dark:text-steel-400 hover:text-stone-600 dark:hover:text-steel-200 transition-colors py-2"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {pedirPassword && (
              <label className="block">
                <span className={labelClass}>Contraseña</span>
                <input
                  type="password"
                  value={password}
                  autoComplete="off"
                  autoFocus
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                <span className="mt-1 block text-xs text-stone-400 dark:text-steel-400">
                  Se pide una sola vez en este dispositivo.
                </span>
              </label>
            )}
            <label className="block">
              <span className={labelClass}>Nombre</span>
              <input
                type="text"
                value={nombre}
                placeholder="Juan Pérez"
                onChange={(e) => setNombre(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Celular</span>
              <input
                type="tel"
                inputMode="numeric"
                value={celular}
                placeholder="2241512345"
                onChange={(e) => setCelular(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Ciudad</span>
              <input
                type="text"
                value={ciudad}
                placeholder="Chascomús"
                onChange={(e) => setCiudad(e.target.value)}
                className={inputClass}
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-500 dark:text-red-300 text-sm px-3 py-2 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-copper-500 hover:bg-copper-400 disabled:opacity-60 disabled:cursor-not-allowed text-steel-950 font-semibold uppercase tracking-widest text-sm py-3.5 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? "Agregando…" : "Agregar contacto"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
