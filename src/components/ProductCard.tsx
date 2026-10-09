"use client";

import { Check, Plus } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { BottleImage } from "@/components/BottleImage";
import { BADGES, PRESENTATION_BADGES, PRESENTATION_LABELS, formatARS, formatUSD } from "@/lib/labels";
import type { ProductView } from "@/lib/products";
import { displayName, formatMl } from "@/lib/size";
import { useCart } from "@/store/cart";

type Props = { product: ProductView; onOpen: (product: ProductView) => void };

// Memo: abrir una ficha o filtrar no vuelve a dibujar las tarjetas que no cambiaron.
export const ProductCard = memo(function ProductCard({ product, onOpen }: Props) {
  const add = useCart((state) => state.add);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  const soldOut = product.stock === 0;
  const name = displayName(product);
  const badge = BADGES[product.badge] ?? PRESENTATION_BADGES[product.presentation];

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gold/10 bg-[linear-gradient(180deg,rgba(32,29,22,0.55),rgba(16,15,13,0.85))] transition duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-[0_24px_50px_-28px_rgba(212,175,55,0.45)]">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.14)_0%,transparent_65%)] focus-visible:outline-2 focus-visible:outline-gold"
        aria-label={`Ver ${product.brand} ${name}`}
      >
        <div className="absolute inset-0 px-[14%] py-[12%] transition duration-500 group-hover:scale-[1.04]">
          <BottleImage
            src={product.imageUrl}
            name={product.name}
            brand={product.brand}
            sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
          />
        </div>
        {badge && (
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full border border-gold/30 bg-black/70 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-champagne sm:text-[10px]">
            <badge.icon className="size-3 text-gold" strokeWidth={1.75} aria-hidden />
            {badge.label}
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 text-center text-[10px] uppercase tracking-[0.24em] text-ivory/80">
            Sin stock
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4">
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-gold">{product.brand}</p>
        <h3 className="line-clamp-2 font-display text-[15px] leading-snug text-ivory sm:text-[17px]">
          <button type="button" onClick={() => onOpen(product)} className="text-left hover:text-champagne">
            {name}
          </button>
        </h3>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ivory/50">
          {product.sizeMl && <SizeTag ml={product.sizeMl} />}
          <span className="italic">{PRESENTATION_LABELS[product.presentation]}</span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-champagne sm:text-xl">{formatARS(product.priceARS)}</p>
            <p className="mt-1 text-[10px] text-ivory/45 sm:text-[11px]">{formatUSD(product.priceUSD)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              add(product);
              setAdded(true);
            }}
            disabled={soldOut}
            aria-label={`Agregar ${name} al carrito`}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition sm:size-10 disabled:opacity-30 ${
              added
                ? "bg-gold-sheen border-gold text-matte"
                : "border-gold/40 text-champagne hover:border-gold hover:bg-gold/15"
            }`}
          >
            {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          </button>
        </div>
      </div>
    </article>
  );
});

export function SizeTag({ ml, large = false }: { ml: number; large?: boolean }) {
  return (
    <span
      className={`rounded-full border border-gold/40 font-medium not-italic tabular-nums text-champagne ${
        large ? "px-3 py-0.5 text-sm" : "px-2 py-px text-[11px]"
      }`}
    >
      {formatMl(ml)}
    </span>
  );
}
