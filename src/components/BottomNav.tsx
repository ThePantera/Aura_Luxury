"use client";

import type { Category, Usage } from "@/generated/prisma/enums";
import { CATEGORY_LABELS, USAGE_OPTIONS } from "@/lib/labels";

export type CategoryFilter = Category | "All";

type Props = {
  category: CategoryFilter;
  usage: Usage | null;
  onCategory: (category: CategoryFilter) => void;
  onUsage: (usage: Usage | null) => void;
};

const TABS: { value: CategoryFilter; label: string }[] = [
  { value: "All", label: "Todos" },
  ...(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([value, label]) => ({ value, label })),
];

export function BottomNav({ category, usage, onCategory, onUsage }: Props) {
  return (
    <nav
      className="relative flex flex-col gap-2.5 border-t border-gold/20 bg-[linear-gradient(180deg,rgba(10,10,9,0.88),rgba(5,5,5,0.97))] px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-10 lg:px-16"
      aria-label="Filtros"
    >
      <div className="flex items-center gap-4">
        <span className="hidden w-20 shrink-0 text-[10px] uppercase tracking-[0.3em] text-gold/80 md:block">Colección</span>
        <div className="-my-1.5 flex min-w-0 gap-2 overflow-x-auto py-1.5 no-scrollbar" role="tablist" aria-label="Categorías">
          {TABS.map(({ value, label }) => {
            const active = category === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategory(value)}
                className={`h-10 shrink-0 rounded-full border px-4 text-sm tracking-wide transition duration-300 sm:h-11 sm:px-6 ${
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
      </div>

      <div className="hairline opacity-60" aria-hidden />

      <div className="flex items-center gap-4">
        <span className="hidden w-20 shrink-0 text-[10px] uppercase tracking-[0.3em] text-gold/80 md:block">Ocasión</span>
        <div className="-my-1.5 flex min-w-0 gap-2 overflow-x-auto py-1.5 no-scrollbar" aria-label="Ocasión de uso">
          {(Object.entries(USAGE_OPTIONS) as [Usage, (typeof USAGE_OPTIONS)[Usage]][]).map(
            ([value, { label, icon: Icon }]) => {
              const active = usage === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onUsage(active ? null : value)}
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs transition duration-300 sm:h-10 sm:px-4 sm:text-sm ${
                    active
                      ? "border-gold bg-gold/20 text-ivory shadow-[0_0_20px_-6px_rgba(212,175,55,0.6)]"
                      : "border-white/10 text-ivory/70 hover:border-gold/50 hover:text-ivory"
                  }`}
                >
                  <Icon className={`size-3.5 ${active ? "text-champagne" : "text-gold/80"}`} aria-hidden />
                  {label}
                </button>
              );
            },
          )}
        </div>
      </div>
    </nav>
  );
}
