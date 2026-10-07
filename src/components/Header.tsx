"use client";

import { Lightbulb, Search, ShoppingBag } from "lucide-react";
import { selectCount, useCart } from "@/store/cart";

type Props = { onSearch: () => void; onAdvisor: () => void };

export function Header({ onSearch, onAdvisor }: Props) {
  const count = useCart(selectCount);
  const openCart = useCart((state) => state.open);

  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
      <span className="font-display text-xl font-semibold tracking-wide text-gold-gradient sm:text-2xl">
        Perfum Luxury
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearch}
          className="glass flex h-10 items-center gap-2 rounded-full px-3 text-sm text-ivory/80 transition hover:text-champagne sm:w-56"
        >
          <Search className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Buscar perfume…</span>
        </button>

        <button
          type="button"
          onClick={onAdvisor}
          className="glass flex h-10 items-center gap-2 rounded-full px-3 text-sm text-champagne transition hover:text-gold"
        >
          <Lightbulb className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Asesor IA</span>
        </button>

        <button
          type="button"
          onClick={openCart}
          aria-label={`Carrito: ${count} productos`}
          className="glass relative flex size-10 items-center justify-center rounded-full text-champagne transition hover:text-gold"
        >
          <ShoppingBag className="size-5" aria-hidden />
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold leading-5 text-matte">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
