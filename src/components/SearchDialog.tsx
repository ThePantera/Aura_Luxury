"use client";

import { Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { formatARS } from "@/lib/labels";
import type { ProductView } from "@/lib/products";

type Props = {
  products: ProductView[];
  onSelect: (product: ProductView) => void;
  onClose: () => void;
};

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function SearchDialog({ products, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return products.slice(0, 6);
    return products
      .filter((product) =>
        normalize(
          [product.name, product.brand, ...product.topNotes, ...product.heartNotes, ...product.baseNotes].join(" "),
        ).includes(term),
      )
      .slice(0, 6);
  }, [products, query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-matte/70 px-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -16, scale: 0.98 }}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar perfume"
        onClick={(event) => event.stopPropagation()}
        className="glass w-full max-w-lg rounded-3xl p-3"
      >
        <div className="flex items-center gap-2 border-b border-champagne/10 px-2 pb-3">
          <Search className="size-4 text-gold" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Marca, perfume o nota (ej. vainilla)"
            className="flex-1 bg-transparent text-base text-ivory outline-none placeholder:text-ivory/40"
          />
          <button type="button" onClick={onClose} aria-label="Cerrar búsqueda" className="text-ivory/60 hover:text-ivory">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ivory/60">No encontramos perfumes para “{query}”.</p>
        ) : (
          <ul className="mt-2 max-h-[50dvh] overflow-y-auto no-scrollbar">
            {results.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => onSelect(product)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-champagne/10"
                >
                  <span>
                    <span className="block text-[11px] uppercase tracking-widest text-gold">{product.brand}</span>
                    <span className="font-display text-lg text-ivory">{product.name}</span>
                  </span>
                  <span className="text-sm text-champagne">{formatARS(product.priceARS)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}
