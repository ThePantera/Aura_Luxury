import { create } from "zustand";
import type { ProductView } from "@/lib/products";

// Estado mínimo del carrito para la Fase 2; la Fase 3 suma cantidades editables y el drawer.
type CartItem = { product: ProductView; quantity: number };

type CartState = {
  items: CartItem[];
  add: (product: ProductView) => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
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
}));

export const selectCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
