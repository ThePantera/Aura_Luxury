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
    <div className="overflow-hidden border-y border-gold/10 bg-black/30 py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul className="flex w-max animate-marquee gap-10 pr-10 text-[10px] uppercase tracking-[0.12em] sm:gap-14 sm:pr-14 sm:text-[11px] sm:tracking-[0.18em] text-champagne/85">
        {items.map(({ icon: Icon, text }, i) => (
          <li key={i} aria-hidden={i >= BENEFITS.length} className="flex items-center gap-2 whitespace-nowrap">
            <Icon className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
