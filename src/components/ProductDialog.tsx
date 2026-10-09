"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { BottleImage } from "@/components/BottleImage";
import { ProductInfo } from "@/components/ProductInfo";
import { formatARS } from "@/lib/labels";
import type { ProductView } from "@/lib/products";
import { relatedProducts } from "@/lib/related";
import { displayName, formatMl } from "@/lib/size";

type Props = {
  product: ProductView;
  products: ProductView[];
  whatsappPhone: string;
  onSelect: (product: ProductView) => void;
  onClose: () => void;
};

// Ficha completa del perfume: en celular sube como hoja desde abajo, en escritorio es un modal a dos columnas.
export function ProductDialog({ product, products, whatsappPhone, onSelect, onClose }: Props) {
  const related = useMemo(() => relatedProducts(product, products), [product, products]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.brand} ${displayName(product)}`}
        onClick={(event) => event.stopPropagation()}
        className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-t-[1.75rem] border border-gold/15 bg-[linear-gradient(160deg,#1f1b13_0%,#141311_45%,#0e0e0d_100%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] no-scrollbar sm:rounded-[1.75rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="orb absolute right-3 top-3 z-10 size-10 bg-black/70"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="relative h-64 shrink-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.2)_0%,rgba(212,175,55,0.05)_45%,transparent_70%)] sm:h-80 md:h-auto md:min-h-[520px]">
          <div className="absolute inset-0 px-[18%] py-[10%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)]">
            <BottleImage src={product.imageUrl} name={product.name} brand={product.brand} priority />
          </div>
        </div>

        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pb-8 md:max-h-[92dvh] md:overflow-y-auto md:py-10 md:pr-10 md:no-scrollbar">
          <ProductInfo product={product} whatsappPhone={whatsappPhone} />

          {related.length > 0 && (
            <section className="mt-6 border-t border-gold/10 pt-5" aria-label="También te puede gustar">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">También te puede gustar</p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="flex h-full w-full flex-col gap-1.5 rounded-xl border border-gold/10 bg-black/20 p-2 text-left transition hover:border-gold/40"
                    >
                      <div className="relative aspect-square w-full">
                        <BottleImage src={item.imageUrl} name={item.name} brand={item.brand} sizes="120px" />
                      </div>
                      <p className="truncate text-[9px] uppercase tracking-[0.18em] text-gold">{item.brand}</p>
                      <p className="line-clamp-2 text-xs leading-snug text-ivory/90">{displayName(item)}</p>
                      {item.sizeMl && <p className="text-[11px] text-champagne">{formatMl(item.sizeMl)}</p>}
                      <p className="mt-auto font-display text-sm text-champagne">{formatARS(item.priceARS)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
