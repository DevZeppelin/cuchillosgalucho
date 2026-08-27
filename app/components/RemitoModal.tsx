"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { ClienteCombobox } from "./ClienteCombobox";
import {
  listarAccesosWebAction,
  obtenerMarkupMinoristaAction,
  registrarVentaAction,
  type VentaResult,
} from "@/app/mayoristas/actions";
import type { AccesoWebContacto, CartItem } from "@/app/lib/types";
import {
  buildRemitoMessage,
  buildWhatsAppUrl,
  formatARS,
  generarNumeroRemito,
  normalizarCelularAR,
  type RemitoData,
} from "@/app/lib/whatsapp";
import {
  compartirODescargarRemito,
  generarRemitoImagen,
} from "@/app/lib/remitoImagen";

/** Recalcula los precios del carrito aplicando un recargo % sobre el precio mayorista (el mínimo). */
function aplicarRecargo(items: CartItem[], pct: number): CartItem[] {
  if (pct <= 0) return items;
  return items.map((i) => ({
    ...i,
    precioUnit: Math.round(i.precioUnit * (1 + pct / 100)),
  }));
}

/**
 * Modal del flujo de remito de Raúl: pide los datos del cliente, registra la
 * venta en la hoja VENTAS y ofrece enviar el texto por WhatsApp y compartir o
 * descargar la imagen del remito.
 */
export function RemitoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items } = useCart();

  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [celular, setCelular] = useState("");
  const [recargoPct, setRecargoPct] = useState("0");
  const [accesos, setAccesos] = useState<AccesoWebContacto[]>([]);
  const [clienteSel, setClienteSel] = useState<AccesoWebContacto | null>(null);
  const [markupMinorista, setMarkupMinorista] = useState<number | null>(null);

  const [paso, setPaso] = useState<"form" | "generando" | "listo">("form");
  const [error, setError] = useState<string | null>(null);
  const [remito, setRemito] = useState<RemitoData | null>(null);
  const [imagen, setImagen] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [registro, setRegistro] = useState<VentaResult | null>(null);
  const [imagenEstado, setImagenEstado] = useState<"pendiente" | "compartido" | "descargado">("pendiente");

  // Liberar la URL del preview cuando cambia o al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Traer los contactos de ACCESOS_WEB para elegir el número destino
  useEffect(() => {
    if (!open) return;
    listarAccesosWebAction()
      .then(setAccesos)
      .catch(() => setAccesos([]));
  }, [open]);

  // Traer el % de lista minorista (COSTOS!M5) para el atajo del recargo
  useEffect(() => {
    if (!open) return;
    obtenerMarkupMinoristaAction()
      .then(setMarkupMinorista)
      .catch(() => setMarkupMinorista(null));
  }, [open]);

  if (!open) return null;

  const onSelectContacto = (c: AccesoWebContacto) => {
    setClienteSel(c);
    setNombre(c.nombre);
    setCiudad(c.ciudad);
    setCelular(c.celular);
  };

  const limpiarCliente = () => {
    setClienteSel(null);
    setNombre("");
    setCiudad("");
    setCelular("");
  };

  const pctNum = Math.max(0, Number(recargoPct.replace(",", ".")) || 0);
  const itemsConRecargo = aplicarRecargo(items, pctNum);
  const totalConRecargo = itemsConRecargo.reduce(
    (sum, i) => sum + i.cantidad * i.precioUnit,
    0,
  );

  const cerrar = () => {
    setPaso("form");
    setError(null);
    setRemito(null);
    setImagen(null);
    setPreviewUrl(null);
    setRegistro(null);
    setImagenEstado("pendiente");
    setRecargoPct("0");
    setClienteSel(null);
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cel = celular.replace(/\D/g, "");
    if (!nombre.trim()) return setError("Ingresá el nombre del cliente");
    if (!ciudad.trim()) return setError("Ingresá la ciudad del cliente");
    if (cel.length < 8) return setError("El celular del cliente no parece válido");
    if (items.length === 0) return setError("El carrito está vacío");

    setPaso("generando");

    const fecha = new Date();
    const data: RemitoData = {
      numero: generarNumeroRemito(fecha),
      fecha,
      cliente: { nombre: nombre.trim(), ciudad: ciudad.trim(), celular: cel },
      items: itemsConRecargo,
      total: totalConRecargo,
    };
    setRemito(data);

    try {
      const blob = await generarRemitoImagen(data);
      setImagen(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      // sin imagen igual se puede enviar el texto y registrar la venta
    }

    const resultado = await registrarVentaAction({
      remito: data.numero,
      vendedor: "Raúl",
      cliente: data.cliente.nombre,
      ciudad: data.cliente.ciudad,
      celular: cel,
      total: totalConRecargo,
      items: itemsConRecargo.map((i) => ({
        producto: i.product.nombre,
        medida: i.product.descripcionCorta,
        cantidad: i.cantidad,
        precioUnit: i.precioUnit,
        subtotal: i.precioUnit * i.cantidad,
      })),
    });
    setRegistro(resultado);
    setPaso("listo");
  };

  const compartirImagen = async () => {
    if (!imagen || !remito) return;
    const como = await compartirODescargarRemito(imagen, remito.numero);
    setImagenEstado(como);
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
        aria-label="Generar remito"
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

        {paso !== "listo" ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-copper-500 dark:text-copper-400 mb-2">
              Remito
            </p>
            <h2 className="font-display text-2xl text-stone-900 dark:text-steel-50">
              Datos del cliente
            </h2>
            <p className="mt-2 text-sm text-stone-500 dark:text-steel-300">
              {items.length} producto{items.length !== 1 ? "s" : ""} ·{" "}
              <span className="font-semibold text-copper-600 dark:text-copper-300">
                {formatARS(totalConRecargo)}
              </span>
              {pctNum > 0 && (
                <span className="text-xs text-stone-400 dark:text-steel-400">
                  {" "}(mayorista + {pctNum}%)
                </span>
              )}
              . La venta se registra en la hoja VENTAS.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className={labelClass}>Recargo sobre precio mayorista (%)</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRecargoPct("0")}
                    className={[
                      "px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all",
                      pctNum === 0
                        ? "bg-copper-500 text-white"
                        : "bg-stone-100 dark:bg-steel-800 text-stone-600 dark:text-steel-300 border border-stone-200 dark:border-steel-700 hover:border-copper-400/50 dark:hover:border-copper-600/50",
                    ].join(" ")}
                  >
                    Mayorista (0%)
                  </button>
                  {markupMinorista != null && (
                    <button
                      type="button"
                      onClick={() => setRecargoPct(String(markupMinorista))}
                      className={[
                        "px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all",
                        pctNum === markupMinorista
                          ? "bg-copper-500 text-white"
                          : "bg-stone-100 dark:bg-steel-800 text-stone-600 dark:text-steel-300 border border-stone-200 dark:border-steel-700 hover:border-copper-400/50 dark:hover:border-copper-600/50",
                      ].join(" ")}
                    >
                      Lista minorista ({markupMinorista}%)
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  inputMode="decimal"
                  value={recargoPct}
                  placeholder="0"
                  onChange={(e) => setRecargoPct(e.target.value)}
                  className={`${inputClass} mt-2`}
                />
                <span className="mt-1 block text-xs text-stone-400 dark:text-steel-400">
                  El precio mayorista es el mínimo. Usá un atajo o escribí un % personalizado por cliente.
                </span>
              </label>

              {accesos.length > 0 && (
                <ClienteCombobox
                  contactos={accesos}
                  onSelect={onSelectContacto}
                  onClear={limpiarCliente}
                  seleccionadoLabel={
                    clienteSel
                      ? `${clienteSel.nombre || "Sin nombre"}${
                          clienteSel.ciudad ? ` · ${clienteSel.ciudad}` : ""
                        } · ${clienteSel.celular}`
                      : null
                  }
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
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
                <span className={labelClass}>Ciudad</span>
                <input
                  type="text"
                  value={ciudad}
                  placeholder="Chascomús"
                  onChange={(e) => setCiudad(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Celular (a donde se envía el remito)</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={celular}
                  placeholder="2241512345"
                  onChange={(e) => setCelular(e.target.value)}
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
                disabled={paso === "generando"}
                className="w-full bg-copper-500 hover:bg-copper-400 disabled:opacity-60 disabled:cursor-not-allowed text-steel-950 font-semibold uppercase tracking-widest text-sm py-3.5 rounded-md transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {paso === "generando" ? "Generando remito…" : "Generar remito"}
              </button>
            </form>
          </>
        ) : (
          remito && (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-copper-500 dark:text-copper-400 mb-2">
                Remito Nº {remito.numero}
              </p>
              <h2 className="font-display text-2xl text-stone-900 dark:text-steel-50">
                Remito listo
              </h2>

              {registro?.ok ? (
                <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-sm px-3 py-2">
                  ✓ Venta registrada en la hoja VENTAS
                </div>
              ) : (
                <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 text-red-500 dark:text-red-300 text-sm px-3 py-2">
                  No se pudo registrar la venta en el sheet
                  {registro?.error ? `: ${registro.error}` : ""}. El remito se
                  puede enviar igual.
                </div>
              )}

              {previewUrl && (
                // El remito se genera con canvas, no hay asset para next/image
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={`Remito ${remito.numero}`}
                  className="mt-4 w-full rounded-lg border border-stone-200 dark:border-steel-700"
                />
              )}

              <div className="mt-5 space-y-3">
                <a
                  href={buildWhatsAppUrl(
                    buildRemitoMessage(remito),
                    normalizarCelularAR(remito.cliente.celular),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Enviar texto por WhatsApp a {remito.cliente.nombre}
                </a>

                {imagen && (
                  <button
                    onClick={compartirImagen}
                    className="w-full border border-copper-500 text-copper-600 dark:text-copper-300 hover:bg-copper-500/10 font-medium py-3.5 rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {imagenEstado === "pendiente"
                      ? "Compartir / descargar imagen del remito"
                      : imagenEstado === "compartido"
                        ? "✓ Imagen compartida"
                        : "✓ Imagen descargada"}
                  </button>
                )}

                <button
                  onClick={cerrar}
                  className="w-full text-xs text-stone-400 dark:text-steel-400 hover:text-stone-600 dark:hover:text-steel-200 transition-colors py-2"
                >
                  Cerrar
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
