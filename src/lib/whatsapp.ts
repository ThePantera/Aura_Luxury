import { DEFAULT_WHATSAPP_PHONE } from "@/lib/defaults";
import { PRESENTATION_LABELS } from "@/lib/labels";
import { displayName, formatMl } from "@/lib/size";
import type { ProductView } from "@/lib/products";
import { cartTotals, type CartItem } from "@/store/cart";


const amount = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const roundCents = (value: number) => Math.round(value * 100) / 100;

export function buildOrderMessage(items: CartItem[]) {
  const totals = cartTotals(items);
  const lines = items.map(({ product, quantity }) => {
    const ars = roundCents(product.priceARS * quantity);
    const usd = roundCents(product.priceUSD * quantity);
    const size = product.sizeMl ? ` ${formatMl(product.sizeMl)}` : "";
    return `• ${quantity}x ${product.brand} ${displayName(product)}${size} (${PRESENTATION_LABELS[product.presentation]}) - $${amount(ars)} ($${amount(usd)} USD)`;
  });

  return [
    "¡Hola Aura Luxury! 👋 Quiero realizar el siguiente pedido:",
    "",
    "🛒 Resumen del Pedido:",
    ...lines,
    "",
    `💳 Total estimado: $${amount(roundCents(totals.ars))} ARS (aprox. $${amount(roundCents(totals.usd))} USD)`,
    "",
    "¿Tienen stock disponible para coordinar pago y envío?",
  ].join("\n");
}

export function buildWhatsAppUrl(items: CartItem[], phone = DEFAULT_WHATSAPP_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildOrderMessage(items))}`;
}

const whatsAppLink = (phone: string, message: string) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export function buildGeneralWhatsAppUrl(phone = DEFAULT_WHATSAPP_PHONE) {
  return whatsAppLink(phone, "¡Hola Aura Luxury! 👋 Quiero hacer una consulta.");
}

// Consulta por un perfume puntual, con el link a su página para que el vendedor lo vea al instante.
export function buildProductWhatsAppUrl(product: ProductView, productUrl: string, phone = DEFAULT_WHATSAPP_PHONE) {
  const size = product.sizeMl ? ` ${formatMl(product.sizeMl)}` : "";
  return whatsAppLink(
    phone,
    [
      `¡Hola Aura Luxury! 👋 Quiero consultar por ${product.brand} ${displayName(product)}${size} (${PRESENTATION_LABELS[product.presentation]}), $${amount(product.priceARS)}.`,
      productUrl,
    ].join("\n"),
  );
}
