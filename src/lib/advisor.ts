import type { Gender, Usage } from "@/generated/prisma/enums";
import type { ProductView } from "@/lib/products";

export type GenderPreference = Gender | "Any";

// Puntaje simple: género y ocasión pesan más; los destacados desempatan; sin stock queda al final.
export function recommend(products: ProductView[], gender: GenderPreference, usage: Usage, limit = 3) {
  const score = (product: ProductView) => {
    let points = 0;
    if (product.recommendedUsage.includes(usage)) points += 4;
    if (gender === "Any" || product.gender === gender) points += 3;
    else if (product.gender === "Unisex") points += 2;
    // Un perfume del género opuesto solo aparece si no hay suficientes opciones.
    else points -= 5;
    if (product.badge === "BestSeller" || product.badge === "Viral") points += 1;
    if (product.stock === 0) points -= 10;
    return points;
  };

  return products
    .map((product) => ({ product, points: score(product) }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map(({ product }) => product);
}
