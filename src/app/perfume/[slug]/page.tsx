import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/Storefront";
import { PRESENTATION_LABELS, formatARS } from "@/lib/labels";
import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { displayName, formatMl } from "@/lib/size";
import { productPath } from "@/lib/site";

// Cada ficha se arma la primera vez que alguien la abre y queda en caché como la portada.
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  const products = await getProducts();
  return { products, product: products.find((item) => item.slug === slug) };
}

// Vista previa al compartir el link por WhatsApp o Instagram, y resultado en Google.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await findProduct((await params).slug);
  if (!product) return { title: "Perfume no encontrado · Aura Luxury" };

  const size = product.sizeMl ? ` ${formatMl(product.sizeMl)}` : "";
  const title = `${product.brand} ${displayName(product)}${size} · Aura Luxury`;
  const notes = [...product.topNotes, ...product.heartNotes, ...product.baseNotes].slice(0, 5).join(", ");
  const description = [
    `${PRESENTATION_LABELS[product.presentation]} a ${formatARS(product.priceARS)}.`,
    notes && `Notas: ${notes}.`,
    "Original con código Batch. Pedido por WhatsApp.",
  ]
    .filter(Boolean)
    .join(" ");
  const images = [{ url: product.imageUrl, alt: title }];

  return {
    title,
    description,
    alternates: { canonical: productPath(product.slug) },
    openGraph: { title, description, type: "website", url: productPath(product.slug), images },
    twitter: { card: "summary_large_image", title, description, images: images.map((image) => image.url) },
  };
}

// El link de un perfume abre la tienda con su ficha ya desplegada.
export default async function ProductPage({ params }: Props) {
  const { products, product } = await findProduct((await params).slug);
  if (!product) notFound();
  const settings = await getSettings();
  return <Storefront products={products} whatsappPhone={settings.whatsappPhone} initialSlug={product.slug} />;
}
