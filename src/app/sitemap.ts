import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { SITE_URL, productPath } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...products.map((product) => ({
      url: `${SITE_URL}${productPath(product.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
