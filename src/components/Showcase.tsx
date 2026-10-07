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
          className="mx-auto grid h-full min-h-0 max-w-7xl grid-cols-[minmax(0,1fr)] grid-rows-[minmax(170px,1fr)_minmax(0,auto)] gap-3 px-4 pb-3 sm:gap-6 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-1 lg:items-center lg:gap-20 lg:px-16"
        >
          <div className="relative h-full min-h-0">
            {/* Vitrina: halo dorado, anillo fino y sombra de apoyo bajo el frasco. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="aspect-square h-[78%] max-h-[520px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0.07)_45%,transparent_70%)] blur-xl" />
              <div className="absolute aspect-square h-[70%] max-h-[460px] rounded-full border border-gold/10" />
            </div>
            <div className="pointer-events-none absolute inset-x-[22%] bottom-[5%] h-5 rounded-[50%] bg-black/80 blur-xl" aria-hidden />
            <div className="pointer-events-none absolute inset-x-[30%] bottom-[6%] h-2 rounded-[50%] bg-gold/30 blur-md" aria-hidden />
            <div className="relative h-full px-[8%] py-[3%] sm:py-[6%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)] animate-levitate">
              <BottleImage src={product.imageUrl} name={product.name} brand={product.brand} />
            </div>
            <ul className="absolute left-0 top-0 flex flex-col items-start gap-2">
              {badges.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne backdrop-blur-md sm:text-[11px]"
                >
                  <Icon className="size-3.5 text-gold" strokeWidth={1.75} aria-hidden />
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
            className="orb absolute left-3 top-1/3 hidden size-12 bg-black/40 backdrop-blur-md md:flex lg:left-5 lg:top-1/2 lg:-translate-y-1/2"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            aria-label="Perfume siguiente"
            className="orb absolute right-3 top-1/3 hidden size-12 bg-black/40 backdrop-blur-md md:flex lg:right-5 lg:top-1/2 lg:-translate-y-1/2"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      <p
        className="pointer-events-none absolute right-4 top-0 flex items-center gap-2 font-display text-sm tabular-nums text-ivory/60 sm:right-10 lg:right-16"
        aria-live="polite"
      >
        <span className="text-champagne">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-gold/40" aria-hidden />
        <span>{String(products.length).padStart(2, "0")}</span>
        <span className="sr-only">de {products.length}</span>
      </p>
    </section>
  );
}
