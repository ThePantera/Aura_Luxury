"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { page: number; pageCount: number; onChange: (page: number) => void };

// Siempre se ven la primera, la última y las vecinas de la actual; el resto se resume con "…".
export function pageItems(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  // Cerca de los extremos se muestran unas páginas más para que la fila no quede corta.
  if (page <= 3) [2, 3, 4].forEach((value) => pages.add(value));
  if (page >= pageCount - 2) [pageCount - 3, pageCount - 2, pageCount - 1].forEach((value) => pages.add(value));

  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  for (const value of sorted) {
    const previous = items.at(-1);
    if (typeof previous === "number" && value - previous > 1) items.push(value - previous === 2 ? previous + 1 : "gap");
    items.push(value);
  }
  return items;
}

const arrowClass =
  "flex size-8 items-center justify-center rounded-full border border-gold/25 text-champagne transition sm:size-10 hover:border-gold hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-30";

export function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Páginas del catálogo" className="mt-10 flex items-center justify-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className={arrowClass}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>

      {pageItems(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="w-4 text-center sm:w-5 text-sm text-ivory/40" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Página ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`flex size-8 items-center justify-center rounded-full text-sm tabular-nums sm:size-10 transition ${
              item === page
                ? "bg-gold-sheen font-semibold text-matte shadow-[0_8px_24px_-10px_rgba(212,175,55,0.8)]"
                : "border border-white/10 text-ivory/70 hover:border-gold/50 hover:text-ivory"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Página siguiente"
        className={arrowClass}
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
