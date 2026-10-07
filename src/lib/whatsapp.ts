import { DEFAULT_WHATSAPP_PHONE } from "@/lib/defaults";
import { PRESENTATION_LABELS } from "@/lib/labels";
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
    return `• ${quantity}x ${product.brand} ${product.name} (${PRESENTATION_LABELS[product.presentation]}) - $${amount(ars)} ($${amount(usd)} USD)`;
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
