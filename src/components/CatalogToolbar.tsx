"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useState } from "react";
import type { Category, Gender, Presentation, Usage } from "@/generated/prisma/enums";
import { CATEGORY_LABELS, GENDER_LABELS, PRESENTATION_LABELS, USAGE_OPTIONS } from "@/lib/labels";

export type SortOrder = "featured" | "bestSeller" | "priceAsc" | "priceDesc" | "name";

export type CatalogFilters = {
  category: Category | null;
  query: string;
  brand: string | null;
  gender: Gender | null;
  presentation: Presentation | null;
  usage: Usage | null;
  sort: SortOrder;
};

export const EMPTY_FILTERS: CatalogFilters = {
  category: null,
  query: "",
  brand: null,
  gender: null,
  presentation: null,
  usage: null,
  sort: "featured",
};

const SORT_LABELS: Record<SortOrder, string> = {
  featured: "Destacados",
  bestSeller: "Más vendidos",
  priceAsc: "Precio: menor a mayor",
  priceDesc: "Precio: mayor a menor",
  name: "Nombre (A–Z)",
};

type Props = {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
  categories: Category[];
  brands: string[];
};

const entries = <K extends string, V>(record: Record<K, V>) => Object.entries(record) as [K, V][];

const chipClass = (active: boolean) =>
  `flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs transition duration-300 sm:text-sm ${
    active
      ? "border-gold bg-gold/20 text-ivory shadow-[0_0_20px_-6px_rgba(212,175,55,0.6)]"
      : "border-white/10 text-ivory/70 hover:border-gold/50 hover:text-ivory"
  }`;

const selectClass =
  "h-11 w-full appearance-none rounded-full border border-gold/25 bg-white/[0.03] pl-4 pr-10 text-sm text-ivory outline-none transition hover:border-gold/50 focus:border-gold [&>option]:bg-surface";

export const CatalogToolbar = forwardRef<HTMLInputElement, Props>(function CatalogToolbar(
  { filters, onChange, onReset, categories, brands },
  searchRef,
) {
  const [panelOpen, setPanelOpen] = useState(false);
  const activeFilters = [filters.brand, filters.gender, filters.presentation, filters.usage].filter(
    (value) => value !== null,
  ).length;

  const tabs: { value: Category | null; label: string }[] = [
    { value: null, label: "Todos" },
    ...entries(CATEGORY_LABELS)
      .filter(([value]) => categories.includes(value))
      .map(([value, label]) => ({ value, label })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 no-scrollbar sm:mx-0 sm:px-0" role="tablist" aria-label="Colecciones">
        {tabs.map(({ value, label }) => {
          const active = filters.category === value;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange({ category: value })}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm tracking-wide transition duration-300 sm:h-11 sm:px-5 ${
                active
                  ? "bg-gold-sheen border-gold font-semibold text-matte shadow-[0_8px_24px_-10px_rgba(212,175,55,0.8)]"
                  : "border-gold/25 bg-white/[0.02] text-ivory/80 hover:border-gold/60 hover:text-champagne"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2.5 sm:flex-nowrap sm:gap-3">
        <label className="relative flex h-11 min-w-0 flex-1 basis-full items-center sm:basis-auto">
          <Search className="pointer-events-none absolute left-4 size-4 text-gold" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder="Buscar marca, perfume o nota (ej. vainilla)"
            aria-label="Buscar perfume"
            className="h-full w-full rounded-full border border-gold/25 bg-white/[0.03] pl-11 pr-10 text-sm text-ivory outline-none transition placeholder:text-ivory/40 hover:border-gold/50 focus:border-gold [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ query: "" })}
              aria-label="Borrar búsqueda"
              className="absolute right-3 text-ivory/50 hover:text-ivory"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>

        <button
          type="button"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-controls="catalog-filters"
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-5 text-sm transition sm:flex-none ${
            panelOpen || activeFilters > 0
              ? "border-gold bg-gold/10 text-ivory"
              : "border-gold/25 text-ivory/80 hover:border-gold/50"
          }`}
        >
          <SlidersHorizontal className="size-4 text-gold" aria-hidden />
          Filtros
          {activeFilters > 0 && (
            <span className="bg-gold-sheen flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-matte">
              {activeFilters}
            </span>
          )}
        </button>

        <div className="relative flex-1 sm:w-56 sm:flex-none">
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortOrder })}
            aria-label="Ordenar"
            className={selectClass}
          >
            {entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gold" aria-hidden />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            id="catalog-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 rounded-2xl border border-gold/10 bg-black/25 p-4 sm:p-5 md:grid-cols-2">
              <FilterGroup label="Ordenar por" className="md:col-span-2">
                {entries(SORT_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filters.sort === value}
                    onClick={() => onChange({ sort: value })}
                    className={chipClass(filters.sort === value)}
                  >
                    {label}
                  </button>
                ))}
              </FilterGroup>

              <FilterGroup label="Marca">
                <div className="relative w-full sm:max-w-xs">
                  <select
                    value={filters.brand ?? ""}
                    onChange={(event) => onChange({ brand: event.target.value || null })}
                    aria-label="Marca"
                    className={selectClass}
                  >
                    <option value="">Todas las marcas</option>
                    {brands.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gold" aria-hidden />
                </div>
              </FilterGroup>

              <FilterGroup label="Género">
                {entries(GENDER_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filters.gender === value}
                    onClick={() => onChange({ gender: filters.gender === value ? null : value })}
                    className={chipClass(filters.gender === value)}
                  >
                    {label}
                  </button>
                ))}
              </FilterGroup>

              <FilterGroup label="Presentación">
                {entries(PRESENTATION_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filters.presentation === value}
                    onClick={() => onChange({ presentation: filters.presentation === value ? null : value })}
                    className={chipClass(filters.presentation === value)}
                  >
                    {label}
                  </button>
                ))}
              </FilterGroup>

              <FilterGroup label="Ocasión">
                {entries(USAGE_OPTIONS).map(([value, { label, icon: Icon }]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filters.usage === value}
                    onClick={() => onChange({ usage: filters.usage === value ? null : value })}
                    className={chipClass(filters.usage === value)}
                  >
                    <Icon className="size-3.5 text-gold/80" aria-hidden />
                    {label}
                  </button>
                ))}
              </FilterGroup>

              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="justify-self-start text-sm text-champagne underline-offset-4 hover:underline md:col-span-2"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function FilterGroup({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={`flex min-w-0 flex-col gap-2.5 ${className}`}>
      <legend className="mb-2.5 text-[10px] uppercase tracking-[0.3em] text-gold/80">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
