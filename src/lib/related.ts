import type { ProductView } from "@/lib/products";
import { displayName } from "@/lib/size";

const notesOf = (product: ProductView) =>
  new Set([...product.topNotes, ...product.heartNotes, ...product.baseNotes].map((note) => note.toLowerCase()));

// Misma fragancia en otra presentación (tester, cofre, otro tamaño): comparte la foto o el nombre.
const sameFragrance = (a: ProductView, b: ProductView) =>
  a.imageUrl === b.imageUrl || (a.brand === b.brand && displayName(a) === displayName(b));

// Sugerencias para la ficha: perfumes con notas, ocasiones y precio parecidos, priorizando los que hay en stock.
export function relatedProducts(product: ProductView, products: ProductView[], limit = 4) {
  const notes = notesOf(product);
  const scored = products
    .filter((candidate) => !sameFragrance(candidate, product) && candidate.stock > 0)
    .map((candidate) => {
      let score = 0;
      for (const note of notesOf(candidate)) if (notes.has(note)) score += 2;
      for (const usage of candidate.recommendedUsage) if (product.recommendedUsage.includes(usage)) score += 1;
      if (candidate.category === product.category) score += 1;
      if (candidate.gender === product.gender) score += 1;
      const priceRatio = candidate.priceARS / product.priceARS;
      if (priceRatio > 0.7 && priceRatio < 1.3) score += 2;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  const picked: ProductView[] = [];
  for (const { candidate } of scored) {
    if (picked.some((item) => sameFragrance(item, candidate))) continue;
    picked.push(candidate);
    if (picked.length === limit) break;
  }
  return picked;
}
