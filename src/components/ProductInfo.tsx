"use client";

import { Check, ChevronDown, Clock, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  CATEGORY_LABELS,
  PRESENTATION_LABELS,
  USAGE_OPTIONS,
  formatARS,
  formatUSD,
} from "@/lib/labels";
import type { ProductView } from "@/lib/products";
import { useCart } from "@/store/cart";

export function ProductInfo({ product }: { product: ProductView }) {
  const add = useCart((state) => state.add);
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  const pyramid = [
    { label: "Salida", notes: product.topNotes },
    { label: "Corazón", notes: product.heartNotes },
    { label: "Fondo", notes: product.baseNotes },
  ];

  return (
    <div className="glass flex min-h-0 flex-col gap-4 overflow-y-auto rounded-3xl p-5 no-scrollbar sm:p-7 [&>*]:shrink-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">{product.brand}</p>
        <h2 className="mt-1 font-display text-3xl leading-tight text-ivory sm:text-4xl">{product.name}</h2>
        <p className="mt-1 text-xs text-ivory/60">
          {CATEGORY_LABELS[product.category]} · {PRESENTATION_LABELS[product.presentation]}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-champagne sm:text-3xl">{formatARS(product.priceARS)}</span>
        <span className="text-sm text-ivory/60">{formatUSD(product.priceUSD)}</span>
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Uso recomendado">
        {product.recommendedUsage.map((usage) => {
          const { label, icon: Icon } = USAGE_OPTIONS[usage];
          return (
            <li
              key={usage}
              className="flex items-center gap-1.5 rounded-full border border-champagne/20 px-3 py-1 text-xs text-ivory/80"
            >
              <Icon className="size-3.5 text-gold" aria-hidden />
              {label}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => {
          add(product);
          setAdded(true);
        }}
        disabled={product.stock === 0}
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne font-semibold text-matte transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
      >
        {added ? <Check className="size-5" aria-hidden /> : <ShoppingBag className="size-5" aria-hidden />}
        {product.stock === 0 ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
      </button>

      <div className="border-t border-champagne/10 pt-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between text-sm font-medium text-champagne"
        >
          Ver ficha de uso &amp; notas
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <dl className="mt-3 grid gap-3 text-sm">
                {pyramid.map(({ label, notes }) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-widest text-ivory/50">{label}</dt>
                    <dd className="text-ivory/90">{notes.join(", ")}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ivory/50">Duración estimada</dt>
                  <dd className="flex items-center gap-1.5 text-ivory/90">
                    <Clock className="size-3.5 text-gold" aria-hidden />
                    Hasta {product.durationHours} horas en piel
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ivory/50">Presentación</dt>
                  <dd className="text-ivory/90">{PRESENTATION_LABELS[product.presentation]}</dd>
                </div>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
