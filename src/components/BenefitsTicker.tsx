import { BadgeCheck, DollarSign, Truck } from "lucide-react";

const BENEFITS = [
  { icon: BadgeCheck, text: "100% Fragancias Originales con código Batch" },
  { icon: Truck, text: "Envíos a todo el país · Coordinación por WhatsApp" },
  { icon: DollarSign, text: "Precios en moneda dual ARS / USD" },
];

export function BenefitsTicker() {
  // La lista se duplica para que la animación sea un bucle continuo.
  const items = [...BENEFITS, ...BENEFITS];

  return (
    <div className="overflow-hidden border-y border-champagne/10 bg-surface/60 py-1.5">
      <ul className="flex w-max animate-marquee gap-10 pr-10 text-xs text-champagne/90">
        {items.map(({ icon: Icon, text }, i) => (
          <li key={i} aria-hidden={i >= BENEFITS.length} className="flex items-center gap-2 whitespace-nowrap">
            <Icon className="size-3.5 text-gold" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
