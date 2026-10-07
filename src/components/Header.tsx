"use client";

import { Search, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { selectCount, useCart } from "@/store/cart";

type Props = { onSearch: () => void; onAdvisor: () => void };

export function Header({ onSearch, onAdvisor }: Props) {
  const count = useCart(selectCount);
  const openCart = useCart((state) => state.open);

  return (
    <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-[max(0.85rem,env(safe-area-inset-top))] sm:px-8 sm:pb-4 sm:pt-5 lg:px-12">
      <div className="flex min-w-0 flex-col leading-none">
        <span className="truncate font-display text-lg font-semibold uppercase tracking-[0.14em] text-gold-gradient min-[400px]:text-xl sm:text-[1.7rem] sm:tracking-[0.2em]">
          Aura Luxury
        </span>
        <span className="mt-1.5 text-[9px] uppercase tracking-[0.38em] text-ivory/60 sm:text-[11px] sm:tracking-[0.45em]">
          Perfumes de autor
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onSearch}
          aria-label="Buscar perfume"
          className="orb size-10 gap-2.5 text-sm sm:size-12 lg:w-60 lg:justify-start lg:px-5"
        >
          <Search className="size-[18px] shrink-0" aria-hidden />
          <span className="hidden text-ivory/70 lg:inline">Buscar perfume…</span>
        </button>

        <button
          type="button"
          onClick={onAdvisor}
          aria-label="Asesor IA"
          className="orb size-10 gap-2 border-gold/50 sm:size-12 md:w-auto md:px-5"
        >
          <Sparkles className="size-[18px] shrink-0 text-gold" aria-hidden />
          <span className="hidden text-sm font-medium tracking-wide text-gold-gradient md:inline">Asesor IA</span>
        </button>

        <button
          type="button"
          onClick={openCart}
          aria-label={`Carrito: ${count} productos`}
          className={`orb relative size-10 sm:size-12 ${count > 0 ? "border-gold/80 shadow-[0_0_24px_-8px_rgba(212,175,55,0.6)]" : ""}`}
        >
          <ShoppingBag className="size-5" aria-hidden />
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="bg-gold-sheen absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums text-matte ring-2 ring-matte"
                aria-hidden
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
