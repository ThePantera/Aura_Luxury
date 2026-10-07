import { Storefront } from "@/components/Storefront";
import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";

// El catálogo se lee en cada request para reflejar cambios de precio y stock.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <Storefront products={products} whatsappPhone={settings.whatsappPhone} />;
}
