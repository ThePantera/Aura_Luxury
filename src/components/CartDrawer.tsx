"use client";

import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { PRESENTATION_LABELS, formatARS, formatUSD } from "@/lib/labels";
import { displayName, formatMl } from "@/lib/size";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cartTotals, useCart } from "@/store/cart";

export function CartDrawer({ whatsappPhone }: { whatsappPhone: string }) {
  const { items, isOpen, close, setQuantity, remove } = useCart();
  const totals = cartTotals(items);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-matte/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            onDragEnd={(_, { offset, velocity }) => {
              // Deslizar hacia la derecha cierra el carrito, como en una app.
              if (offset.x > 100 || velocity.x > 500) close();
            }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-champagne/15 bg-surface"
          >
            <header className="flex items-center justify-between border-b border-champagne/10 px-5 py-4">
              <h2 className="font-display text-2xl text-champagne">Tu pedido</h2>
              <button type="button" onClick={close} aria-label="Cerrar carrito" className="text-ivory/60 hover:text-ivory">
                <X className="size-5" aria-hidden />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="size-10 text-gold/60" aria-hidden />
                <p className="text-ivory/70">Todavía no agregaste perfumes.</p>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-gold px-5 py-2 text-sm text-champagne transition hover:bg-gold/10"
                >
                  Seguir explorando
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-champagne/10 overflow-y-auto px-5 no-scrollbar">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-3 py-4">
                      <div className="flex-1">
                        <p className="text-[11px] uppercase tracking-widest text-gold">{product.brand}</p>
                        <p className="font-display text-lg leading-tight text-ivory">{displayName(product)}</p>
                        <p className="text-xs text-ivory/50">
                          {product.sizeMl ? `${formatMl(product.sizeMl)} · ` : ""}
                          {PRESENTATION_LABELS[product.presentation]}
                        </p>
                        <p className="mt-1 text-sm text-champagne">
                          {formatARS(product.priceARS * quantity)}{" "}
                          <span className="text-xs text-ivory/50">{formatUSD(product.priceUSD * quantity)}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          aria-label={`Quitar ${product.name}`}
                          className="text-ivory/40 transition hover:text-red-400"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                        <div className="flex items-center gap-1 rounded-full border border-champagne/20">
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, quantity - 1)}
                            aria-label={`Restar una unidad de ${product.name}`}
                            className="flex size-8 items-center justify-center text-champagne"
                          >
                            <Minus className="size-3.5" aria-hidden />
                          </button>
                          <span className="w-5 text-center text-sm tabular-nums" aria-label="Cantidad">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            aria-label={`Sumar una unidad de ${product.name}`}
                            className="flex size-8 items-center justify-center text-champagne"
                          >
                            <Plus className="size-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-champagne/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ivory/70">Total estimado</span>
                    <span className="text-2xl font-semibold text-champagne">{formatARS(totals.ars)}</span>
                  </div>
                  <p className="text-right text-xs text-ivory/50">aprox. {formatUSD(totals.usd)}</p>
                  <a
                    href={buildWhatsAppUrl(items, whatsappPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-matte transition hover:brightness-110"
                  >
                    <MessageCircle className="size-5" aria-hidden />
                    Enviar pedido por WhatsApp
                  </a>
                  <p className="mt-2 text-center text-[11px] text-ivory/40">
                    Coordinamos stock, pago y envío por WhatsApp.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
