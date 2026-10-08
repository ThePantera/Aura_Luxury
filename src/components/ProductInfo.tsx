"use client";

import { BadgeCheck, Check, Feather, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  CATEGORY_LABELS,
  GENDER_LABELS,
  PRESENTATION_LABELS,
  USAGE_OPTIONS,
  formatARS,
  formatUSD,
} from "@/lib/labels";
import type { ProductView } from "@/lib/products";
import { useCart } from "@/store/cart";

// Beneficios definidos en el PRD; no se prometen plazos ni costos de envío que el negocio no fijó.
const BENEFITS = [
  { icon: BadgeCheck, label: "Original con Batch" },
  { icon: Truck, label: "Envíos a todo el país" },
  { icon: MessageCircle, label: "Pedido por WhatsApp" },
];

function stockLabel(stock: number) {
  if (stock === 0) return "Sin stock";
  if (stock <= 3) return `Últimas ${stock} unidades`;
  return "Disponible";
}

export function ProductInfo({ product }: { product: ProductView }) {
  const add = useCart((state) => state.add);
  const [notesOpen, setNotesOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  const soldOut = product.stock === 0;

  const pyramid = [
    { label: "Salida", notes: product.topNotes },
    { label: "Corazón", notes: product.heartNotes },
    { label: "Fondo", notes: product.baseNotes },
  ].filter(({ notes }) => notes.length > 0);

  const details = [
    { label: "Duración", value: `Hasta ${product.durationHours} h` },
    { label: "Género", value: GENDER_LABELS[product.gender] },
    {
      label: "Ocasión",
      value: product.recommendedUsage.map((usage) => USAGE_OPTIONS[usage].label).join(" · ") || "Todo uso",
    },
    { label: "Stock", value: stockLabel(product.stock), warn: product.stock <= 3 },
  ];

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl lg:max-h-full flex-col gap-3 overflow-y-auto rounded-[1.75rem] border border-gold/15 bg-[linear-gradient(160deg,rgba(38,33,22,0.72)_0%,rgba(20,19,17,0.82)_45%,rgba(14,14,13,0.9)_100%)] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl no-scrollbar max-sm:px-4 max-sm:py-4 sm:gap-5 sm:p-8 lg:max-w-none lg:p-10 [&>*]:shrink-0">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
          {product.brand}
          <span className="text-ivory/40"> · {CATEGORY_LABELS[product.category]}</span>
        </p>
        <h2 className="mt-2 font-display text-[1.7rem] leading-[1.05] text-ivory sm:text-5xl">{product.name}</h2>
        <p className="mt-1 text-sm italic text-ivory/65 sm:mt-2 max-sm:[@media(max-height:700px)]:hidden">{PRESENTATION_LABELS[product.presentation]}</p>
      </div>

      <div className="hairline [@media(max-height:700px)]:hidden" aria-hidden />

      <div>
        <p className="font-display text-[1.75rem] leading-none tracking-tight text-champagne sm:text-[2.75rem] sm:leading-none">
          {formatARS(product.priceARS)}
        </p>
        <p className="mt-1.5 text-xs text-ivory/60 sm:text-sm">
          Equivale a <span className="text-ivory/85">{formatUSD(product.priceUSD)}</span>
        </p>
      </div>

      <dl className="grid grid-cols-2 [@media(max-height:700px)]:hidden gap-x-5 gap-y-2 sm:grid-cols-4 sm:gap-y-3">
        {details.map(({ label, value, warn }) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/50">{label}</dt>
            <dd className={`mt-0.5 text-[13px] leading-snug sm:text-sm ${warn ? "text-champagne" : "text-ivory/90"}`}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex gap-2.5 sm:gap-3">
        <motion.button
          type="button"
          onClick={() => {
            add(product);
            setAdded(true);
          }}
          disabled={soldOut}
          whileTap={{ scale: 0.97 }}
          className="bg-gold-sheen group relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-3 text-sm font-semibold sm:text-[15px] text-matte shadow-[0_12px_30px_-12px_rgba(212,175,55,0.7)] transition hover:shadow-[0_16px_40px_-10px_rgba(212,175,55,0.85)] disabled:opacity-40 disabled:shadow-none sm:h-14"
        >
          <span
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
            aria-hidden
          />
          {added ? <Check className="size-5" aria-hidden /> : <ShoppingBag className="size-5" aria-hidden />}
          {soldOut ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
        </motion.button>

        {pyramid.length > 0 && (
          <button
            type="button"
            onClick={() => setNotesOpen((value) => !value)}
            aria-expanded={notesOpen}
            className={`flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-300 sm:h-14 sm:px-6 ${
              notesOpen
                ? "border-gold bg-gold/15 text-ivory"
                : "border-gold/35 text-champagne hover:border-gold hover:bg-gold/10"
            }`}
          >
            <Feather className="size-4" aria-hidden />
            Ver notas
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {notesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <dl className="grid gap-3 rounded-2xl border border-gold/10 bg-black/25 p-4 sm:p-5">
              {pyramid.map(({ label, notes }, i) => (
                <div key={label} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                  <dt className="flex items-baseline gap-2 text-[10px] uppercase tracking-[0.24em] text-gold">
                    <span className="font-display text-sm tracking-normal text-gold/60">0{i + 1}</span>
                    {label}
                  </dt>
                  <dd className="font-display text-base italic leading-snug text-ivory/90">{notes.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="hidden flex-wrap gap-x-5 gap-y-2 border-t border-gold/10 pt-4 text-xs text-ivory/65 sm:flex">
        {BENEFITS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5">
            <Icon className="size-4 text-gold" strokeWidth={1.5} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
