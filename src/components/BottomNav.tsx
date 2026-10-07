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
    <nav className="glass flex flex-col gap-2 rounded-t-3xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8" aria-label="Filtros">
      <div className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Categorías">
        {TABS.map(({ value, label }) => {
          const active = category === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategory(value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                active ? "bg-gold font-semibold text-matte" : "text-ivory/70 hover:text-champagne"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar" aria-label="Ocasión de uso">
        {(Object.entries(USAGE_OPTIONS) as [Usage, (typeof USAGE_OPTIONS)[Usage]][]).map(
          ([value, { label, icon: Icon }]) => {
            const active = usage === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onUsage(active ? null : value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-gold bg-gold/15 text-champagne"
                    : "border-champagne/15 text-ivory/70 hover:border-champagne/40"
                }`}
              >
                <Icon className="size-3.5 text-gold" aria-hidden />
                {label}
              </button>
            );
          },
        )}
      </div>
    </nav>
  );
}
