"use client";

import { ArrowLeft, Lightbulb, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Usage } from "@/generated/prisma/enums";
import { recommend, type GenderPreference } from "@/lib/advisor";
import { USAGE_OPTIONS, formatARS } from "@/lib/labels";
import type { ProductView } from "@/lib/products";
import { displayName, formatMl } from "@/lib/size";
import { useCart } from "@/store/cart";

const GENDERS: { value: GenderPreference; label: string }[] = [
  { value: "Masculino", label: "Para él" },
  { value: "Femenino", label: "Para ella" },
  { value: "Any", label: "Unisex / me da igual" },
];

type Props = {
  products: ProductView[];
  onSelect: (product: ProductView) => void;
  onClose: () => void;
};

export function AdvisorDialog({ products, onSelect, onClose }: Props) {
  const add = useCart((state) => state.add);
  const [gender, setGender] = useState<GenderPreference | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const step = gender === null ? 1 : usage === null ? 2 : 3;
  const results = gender !== null && usage !== null ? recommend(products, gender, usage) : [];

  const optionClass =
    "flex items-center justify-center gap-2 rounded-2xl border border-champagne/20 px-4 py-4 text-sm text-ivory transition hover:border-gold hover:bg-gold/10";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-matte/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, scale: 0.98 }}
        role="dialog"
        aria-modal="true"
        aria-label="Asesor olfativo"
        onClick={(event) => event.stopPropagation()}
        className="glass max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl p-5 no-scrollbar sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => (step === 3 ? setUsage(null) : setGender(null))}
                aria-label="Volver"
                className="text-ivory/60 hover:text-ivory"
              >
                <ArrowLeft className="size-5" aria-hidden />
              </button>
            )}
            <Lightbulb className="size-5 text-gold" aria-hidden />
            <h2 className="font-display text-xl text-champagne">Asesor olfativo</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar asesor" className="text-ivory/60 hover:text-ivory">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {step === 1 && (
          <>
            <p className="mb-1 text-xs uppercase tracking-widest text-ivory/50">Paso 1 de 2</p>
            <p className="mb-4 text-lg text-ivory">¿Para quién es el perfume?</p>
            <div className="grid gap-2">
              {GENDERS.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setGender(value)} className={optionClass}>
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-1 text-xs uppercase tracking-widest text-ivory/50">Paso 2 de 2</p>
            <p className="mb-4 text-lg text-ivory">¿Para qué ocasión?</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(USAGE_OPTIONS) as [Usage, (typeof USAGE_OPTIONS)[Usage]][]).map(
                ([value, { label, icon: Icon }]) => (
                  <button key={value} type="button" onClick={() => setUsage(value)} className={optionClass}>
                    <Icon className="size-4 text-gold" aria-hidden />
                    {label}
                  </button>
                ),
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="mb-4 text-lg text-ivory">Te recomendamos</p>
            <ul className="grid gap-2">
              {results.map((product) => (
                <li key={product.id} className="flex items-center gap-3 rounded-2xl border border-champagne/15 p-3">
                  <button type="button" onClick={() => onSelect(product)} className="flex-1 text-left">
                    <span className="block text-[11px] uppercase tracking-widest text-gold">{product.brand}</span>
                    <span className="block font-display text-lg leading-tight text-ivory">{displayName(product)}</span>
                    <span className="text-sm text-champagne">
                      {product.sizeMl ? `${formatMl(product.sizeMl)} · ` : ""}
                      {formatARS(product.priceARS)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => add(product)}
                    aria-label={`Agregar ${product.name} al carrito`}
                    className="flex size-10 items-center justify-center rounded-full bg-gold text-matte transition hover:brightness-110"
                  >
                    <ShoppingBag className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setGender(null);
                setUsage(null);
              }}
              className="mt-4 w-full text-center text-sm text-champagne/80 hover:text-champagne"
            >
              Volver a empezar
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
