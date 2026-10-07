import { Storefront } from "@/components/Storefront";
import { getProducts } from "@/lib/products";

// El catálogo se lee en cada request para reflejar cambios de precio y stock.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  return <Storefront products={products} />;
}
