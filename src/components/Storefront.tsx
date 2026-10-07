"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { BenefitsTicker } from "@/components/BenefitsTicker";
import { BottomNav, type CategoryFilter } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { SearchDialog } from "@/components/SearchDialog";
import { Showcase } from "@/components/Showcase";
import type { Usage } from "@/generated/prisma/enums";
import type { ProductView } from "@/lib/products";

export function Storefront({ products }: { products: ProductView[] }) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [[index, direction], setPosition] = useState<[number, number]>([0, 0]);
  const [searchOpen, setSearchOpen] = useState(false);

  const visible = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "All" || product.category === category) &&
          (usage === null || product.recommendedUsage.includes(usage)),
      ),
    [products, category, usage],
  );

  const navigate = useCallback(
    (step: 1 | -1) =>
      setPosition(([current]) => [(current + step + visible.length) % visible.length, step]),
    [visible.length],
  );

  const changeCategory = (value: CategoryFilter) => {
    setCategory(value);
    setPosition([0, 0]);
  };

  const changeUsage = (value: Usage | null) => {
    setUsage(value);
    setPosition([0, 0]);
  };

  const selectFromSearch = (product: ProductView) => {
    setCategory("All");
    setUsage(null);
    setPosition([products.indexOf(product), 0]);
    setSearchOpen(false);
  };

  return (
    <div className="grid h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden">
      <Header onSearch={() => setSearchOpen(true)} />
      <BenefitsTicker />

      <main className="min-h-0 pt-4">
        {visible.length > 0 ? (
          <Showcase products={visible} index={Math.min(index, visible.length - 1)} direction={direction} onNavigate={navigate} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="font-display text-2xl text-champagne">Sin fragancias para este filtro</p>
            <button
              type="button"
              onClick={() => {
                changeCategory("All");
                setUsage(null);
              }}
              className="rounded-full border border-gold px-5 py-2 text-sm text-champagne transition hover:bg-gold/10"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}
      </main>

      <BottomNav category={category} usage={usage} onCategory={changeCategory} onUsage={changeUsage} />

      <AnimatePresence>
        {searchOpen && (
          <SearchDialog products={products} onSelect={selectFromSearch} onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
