import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { MenuItemDB } from './MenuContext';

export type CartLine = MenuItemDB & { qty: number };

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  taxes: number;
  total: number;
  add: (item: MenuItemDB) => void;
  decrement: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
  qtyOf: (name: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, CartLine>>({});

  const value = useMemo<CartContextValue>(() => {
    const lines = Object.values(cart);
    const itemCount = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;
    return {
      lines,
      itemCount,
      subtotal,
      taxes,
      total,
      add: (item) =>
        setCart((c) => ({
          ...c,
          [item.name]: c[item.name]
            ? { ...c[item.name], qty: c[item.name].qty + 1 }
            : { ...item, qty: 1 },
        })),
      decrement: (name) =>
        setCart((c) => {
          const existing = c[name];
          if (!existing) return c;
          if (existing.qty <= 1) {
            const rest = { ...c };
            delete rest[name];
            return rest;
          }
          return { ...c, [name]: { ...existing, qty: existing.qty - 1 } };
        }),
      remove: (name) =>
        setCart((c) => {
          const rest = { ...c };
          delete rest[name];
          return rest;
        }),
      clear: () => setCart({}),
      qtyOf: (name) => cart[name]?.qty ?? 0,
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
