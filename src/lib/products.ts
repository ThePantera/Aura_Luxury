import { cache } from "react";
import { catalog, toUSD } from "@/data/catalog";
import type { Badge, Category, Gender, Presentation, Usage } from "@/generated/prisma/enums";

// Forma serializable del producto que reciben los componentes de cliente.
export type ProductView = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  gender: Gender;
  presentation: Presentation;
  sizeMl: number | null;
  priceARS: number;
  priceUSD: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  recommendedUsage: Usage[];
  durationHours: number;
  badge: Badge;
  imageUrl: string;
  stock: number;
};

// Cacheado por request: la página de un perfume lo usa para la vista previa y para la tienda.
export const getProducts = cache(async (): Promise<ProductView[]> => {
  // Sin base configurada (preview o desarrollo rápido) se muestra el catálogo de ejemplo.
  if (!process.env.DATABASE_URL) {
    return catalog.map((product) => ({
      ...product,
      id: product.slug,
      priceUSD: product.priceUSD ?? toUSD(product.priceARS),
    }));
  }

  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.product.findMany({
    omit: { createdAt: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    ...row,
    priceARS: Number(row.priceARS),
    priceUSD: Number(row.priceUSD),
  }));
});
