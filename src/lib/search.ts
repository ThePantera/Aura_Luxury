import type { ProductView } from "@/lib/products";

// Ignora mayúsculas y tildes: "cafe" encuentra "Café".
export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function matchesQuery(product: ProductView, query: string) {
  const term = normalize(query.trim());
  if (!term) return true;
  return normalize(
    [product.name, product.brand, ...product.topNotes, ...product.heartNotes, ...product.baseNotes].join(" "),
  ).includes(term);
}
