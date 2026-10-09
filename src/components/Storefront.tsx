"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdvisorDialog } from "@/components/AdvisorDialog";
import { BenefitsTicker } from "@/components/BenefitsTicker";
import { CartDrawer } from "@/components/CartDrawer";
import { CatalogToolbar, EMPTY_FILTERS, type CatalogFilters } from "@/components/CatalogToolbar";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import type { Badge, Category } from "@/generated/prisma/enums";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { ProductView } from "@/lib/products";
import { matchesQuery } from "@/lib/search";
import { productPath } from "@/lib/site";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";

type Props = { products: ProductView[]; whatsappPhone: string; initialSlug?: string };

// El catálogo se muestra por páginas para que el celular nunca tenga que dibujar cientos de tarjetas.
const PAGE_SIZE = 24;

// "Más vendidos" se basa en la insignia que se carga en el panel: Best Seller, Viral y Oferta, en ese orden.
const BADGE_RANK: Record<Badge, number> = { BestSeller: 0, Viral: 1, Offer: 2, None: 3 };

// En "Destacados" los árabes van primero, después nicho, diseñador y decants.
const CATEGORY_RANK: Record<Category, number> = { Arabian: 0, Niche: 1, Designer: 2, Decant: 3 };

const byName = new Intl.Collator("es", { sensitivity: "base" });

export function Storefront({ products, whatsappPhone, initialSlug }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  // Al entrar por /perfume/<slug> la ficha arranca abierta sobre el catálogo.
  const [selected, setSelected] = useState<ProductView | null>(
    () => products.find((product) => product.slug === initialSlug) ?? null,
  );
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const catalogRef = useRef<HTMLElement>(null);

  // El carrito guardado en el navegador se carga después de hidratar.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort(byName.compare),
    [products],
  );

  const visible = useMemo(() => {
    const matches = products.filter(
      (product) =>
        (filters.category === null || product.category === filters.category) &&
        (filters.brand === null || product.brand === filters.brand) &&
        (filters.gender === null || product.gender === filters.gender) &&
        (filters.presentation === null || product.presentation === filters.presentation) &&
        (filters.usage === null || product.recommendedUsage.includes(filters.usage)) &&
        matchesQuery(product, filters.query),
    );
    switch (filters.sort) {
      case "priceAsc":
        return matches.sort((a, b) => a.priceARS - b.priceARS);
      case "priceDesc":
        return matches.sort((a, b) => b.priceARS - a.priceARS);
      case "name":
        return matches.sort((a, b) => byName.compare(`${a.brand} ${a.name}`, `${b.brand} ${b.name}`));
      case "bestSeller":
        return matches.sort(
          (a, b) => BADGE_RANK[a.badge] - BADGE_RANK[b.badge] || CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category],
        );
      default:
        return matches.sort(
          (a, b) => CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] || BADGE_RANK[a.badge] - BADGE_RANK[b.badge],
        );
    }
  }, [products, filters]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageProducts = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilters = (patch: Partial<CatalogFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  // Al cambiar de página se vuelve al principio del catálogo, sin animar todo el recorrido.
  const goToPage = (next: number) => {
    setPage(next);
    catalogRef.current?.scrollIntoView({ block: "start" });
  };

  const focusSearch = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    searchRef.current?.focus({ preventScroll: true });
  };

  // La barra de direcciones refleja el perfume abierto para que el link se pueda copiar y compartir.
  const openProduct = useCallback((product: ProductView) => {
    setAdvisorOpen(false);
    setSelected(product);
    window.history.replaceState(null, "", productPath(product.slug));
  }, []);

  const closeProduct = useCallback(() => {
    setSelected(null);
    window.history.replaceState(null, "", "/");
  }, []);

  useScrollLock(selected !== null || advisorOpen);

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-40 border-b border-gold/10 bg-matte/95">
        <Header onSearch={focusSearch} onAdvisor={() => setAdvisorOpen(true)} />
      </div>
      <BenefitsTicker />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-8 lg:px-12">
        <section className="py-8 sm:py-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold sm:text-[11px]">Catálogo</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-ivory sm:text-5xl">
            Perfumería original, <span className="italic text-gold-gradient">de diseñador a nicho</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ivory/60 sm:text-base">
            Perfumes árabes, de nicho y de diseñador, con precios en pesos y dólares.
          </p>
        </section>

        <section ref={catalogRef} aria-label="Catálogo" className="scroll-mt-24">
          <CatalogToolbar
            ref={searchRef}
            filters={filters}
            onChange={updateFilters}
            onReset={() => updateFilters({ brand: null, gender: null, presentation: null, usage: null })}
            categories={categories}
            brands={brands}
          />

          {visible.length > 0 ? (
            <>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                {pageProducts.map((product) => (
                  <li key={product.id} className="catalog-item flex">
                    <ProductCard product={product} onOpen={openProduct} />
                  </li>
                ))}
              </ul>

              <Pagination page={currentPage} pageCount={pageCount} onChange={goToPage} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="font-display text-2xl text-champagne">Sin fragancias para esta búsqueda</p>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-gold px-5 py-2 text-sm text-champagne transition hover:bg-gold/10"
              >
                Ver todo el catálogo
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gold/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center sm:px-8 lg:px-12">
          <p className="font-display text-lg uppercase tracking-[0.2em] text-gold-gradient">Aura Luxury</p>
          <p className="text-xs text-ivory/50">
            Fragancias 100% originales con código Batch · Envíos a todo el país · Pedidos por WhatsApp
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {selected && (
          <ProductDialog
            key={selected.id}
            product={selected}
            products={products}
            whatsappPhone={whatsappPhone}
            onSelect={openProduct}
            onClose={closeProduct}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {advisorOpen && (
          <AdvisorDialog products={products} onSelect={openProduct} onClose={() => setAdvisorOpen(false)} />
        )}
      </AnimatePresence>

      <a
        href={buildGeneralWhatsAppUrl(whatsappPhone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.7)] transition hover:scale-105 sm:left-6"
      >
        <MessageCircle className="size-7" strokeWidth={1.75} aria-hidden />
      </a>

      <CartDrawer whatsappPhone={whatsappPhone} />
    </div>
  );
}
