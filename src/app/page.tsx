import { Storefront } from "@/components/Storefront";
import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";

// El catálogo se lee en cada request para reflejar cambios de precio y stock.
// La tienda se sirve ya armada desde la caché y se regenera cada 5 minutos o al guardar en el panel.
export const revalidate = 300;

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <Storefront products={products} whatsappPhone={settings.whatsappPhone} />;
}
