"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product, WholesaleSession } from "@/app/lib/types";

interface CartContextValue {
  items: CartItem[];
  cantidad: number;
  total: number;
  isOpen: boolean;
  isMayorista: boolean;
  mayorista: WholesaleSession | null;
  add: (product: Product, cantidad?: number) => void;
  remove: (productId: string) => void;
  setCantidad: (productId: string, cantidad: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setMayorista: (s: WholesaleSession | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "galucho.cart.v1";
const SESSION_KEY = "galucho.mayorista.v1";

function priceFor(product: Product, isMayorista: boolean): number {
  if (isMayorista && product.precioMayorista) return product.precioMayorista;
  return product.precio;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mayorista, setMayoristaState] = useState<WholesaleSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const sess = localStorage.getItem(SESSION_KEY);
      if (sess) {
        const parsed: WholesaleSession = JSON.parse(sess);
        if (parsed.expira > Date.now()) {
          setMayoristaState(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // ignorar JSON corrupto
    }
    setHydrated(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Re-precificar items cuando cambia el rol mayorista/minorista
  useEffect(() => {
    if (!hydrated) return;
    setItems((curr) =>
      curr.map((i) => ({ ...i, precioUnit: priceFor(i.product, !!mayorista) })),
    );
  }, [mayorista, hydrated]);

  const add = useCallback(
    (product: Product, cantidad = 1) => {
      setItems((curr) => {
        const idx = curr.findIndex((i) => i.product.id === product.id);
        if (idx >= 0) {
          const next = [...curr];
          next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cantidad };
          return next;
        }
        return [
          ...curr,
          {
            product,
            cantidad,
            precioUnit: priceFor(product, !!mayorista),
          },
        ];
      });
    },
    [mayorista],
  );

  const remove = useCallback((productId: string) => {
    setItems((curr) => curr.filter((i) => i.product.id !== productId));
  }, []);

  const setCantidad = useCallback((productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((curr) => curr.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((curr) =>
      curr.map((i) => (i.product.id === productId ? { ...i, cantidad } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const setMayorista = useCallback((s: WholesaleSession | null) => {
    setMayoristaState(s);
    if (s) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const cantidad = useMemo(
    () => items.reduce((sum, i) => sum + i.cantidad, 0),
    [items],
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.cantidad * i.precioUnit, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    cantidad,
    total,
    isOpen,
    isMayorista: !!mayorista,
    mayorista,
    add,
    remove,
    setCantidad,
    clear,
    open,
    close,
    toggle,
    setMayorista,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
