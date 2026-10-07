import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductView } from "@/lib/products";

export type CartItem = { product: ProductView; quantity: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (product: ProductView) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (!existing) return { items: [...state.items, { product, quantity: 1 }] };
          return {
            items: state.items.map((item) =>
              item === existing ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        })),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "perfum-luxury-cart",
      storage: createJSONStorage(() => localStorage),
      // Solo se guardan los ítems; el drawer siempre arranca cerrado.
      partialize: (state) => ({ items: state.items }),
      // Evita diferencias de hidratación: el carrito guardado se carga en el cliente.
      skipHydration: true,
    },
  ),
);

export const selectCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export function cartTotals(items: CartItem[]) {
  return items.reduce(
    (totals, { product, quantity }) => ({
      ars: totals.ars + product.priceARS * quantity,
      usd: totals.usd + product.priceUSD * quantity,
    }),
    { ars: 0, usd: 0 },
  );
}
