"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useEffect } from "react";
import { BottleImage } from "@/components/BottleImage";
import { ProductInfo } from "@/components/ProductInfo";
import { BADGES, PRESENTATION_BADGES } from "@/lib/labels";
import type { ProductView } from "@/lib/products";

// Un gesto cuenta como swipe si recorre bastante distancia o si es un "flick" rápido.
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 450;

type Props = {
  products: ProductView[];
  index: number;
  direction: number;
  onNavigate: (step: 1 | -1) => void;
};

export function Showcase({ products, index, direction, onNavigate }: Props) {
  const product = products[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNavigate]);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) > SWIPE_DISTANCE || (Math.abs(velocity.x) > SWIPE_VELOCITY && Math.abs(offset.x) > 20);
    if (!swipe) return;
    onNavigate(offset.x < 0 ? 1 : -1);
  };

  const badges = [BADGES[product.badge], PRESENTATION_BADGES[product.presentation]].filter(
    (badge) => badge !== undefined,
  );

  return (
    <section className="relative h-full min-h-0" aria-roledescription="carrusel" aria-label="Escaparate">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={product.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 120, rotateY: direction * 18 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: direction * -120, rotateY: direction * -18 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          drag={products.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          dragDirectionLock
          onDragEnd={onDragEnd}
          style={{ transformPerspective: 1200 }}
          className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(150px,1fr)_minmax(0,auto)] gap-4 px-4 pb-2 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-10 md:px-12"
        >
          <div className="relative h-full min-h-0">
            <div className="absolute inset-x-[15%] bottom-[6%] h-6 rounded-[50%] bg-gold/25 blur-2xl" aria-hidden />
            <div className="relative h-full animate-levitate">
              <BottleImage src={product.imageUrl} name={product.name} brand={product.brand} />
            </div>
            <ul className="absolute left-0 top-0 flex flex-col gap-2">
              {badges.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-champagne"
                >
                  <Icon className="size-3.5 text-gold" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <ProductInfo product={product} />
        </motion.div>
      </AnimatePresence>

      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            aria-label="Perfume anterior"
            className="glass absolute left-2 top-1/3 hidden size-11 items-center justify-center rounded-full text-champagne transition hover:text-gold md:top-1/2 md:flex md:-translate-y-1/2"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            aria-label="Perfume siguiente"
            className="glass absolute right-2 top-1/3 hidden size-11 items-center justify-center rounded-full text-champagne transition hover:text-gold md:top-1/2 md:flex md:-translate-y-1/2"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      <p className="pointer-events-none absolute right-4 top-0 text-xs tabular-nums text-ivory/50 md:right-12" aria-live="polite">
        {index + 1} / {products.length}
      </p>
    </section>
  );
}
