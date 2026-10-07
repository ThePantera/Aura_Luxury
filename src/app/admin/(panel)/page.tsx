import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { primaryButtonClass } from "@/components/admin/fields";
import { BADGES, CATEGORY_LABELS, formatARS, formatUSD } from "@/lib/labels";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: [{ brand: "asc" }, { name: "asc" }] });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-champagne">Productos</h1>
          <p className="text-sm text-ivory/50">{products.length} perfumes en el catálogo</p>
        </div>
        <Link href="/admin/productos/nuevo" className={primaryButtonClass}>
          <Plus className="size-4" aria-hidden />
          Nuevo perfume
        </Link>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-ivory/40">
            <tr>
              <th className="px-4 py-3 font-medium">Perfume</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/10">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <span className="block text-[11px] uppercase tracking-widest text-gold">{product.brand}</span>
                  <span className="text-ivory">{product.name}</span>
                  {product.badge !== "None" && (
                    <span className="ml-2 rounded-full border border-champagne/20 px-2 py-0.5 text-[10px] text-champagne">
                      {BADGES[product.badge]?.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ivory/70">{CATEGORY_LABELS[product.category]}</td>
                <td className="px-4 py-3">
                  <span className="block text-champagne">{formatARS(Number(product.priceARS))}</span>
                  <span className="text-xs text-ivory/50">{formatUSD(Number(product.priceUSD))}</span>
                </td>
                <td className={`px-4 py-3 tabular-nums ${product.stock === 0 ? "text-red-300" : "text-ivory/80"}`}>
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      aria-label={`Editar ${product.name}`}
                      className="p-2 text-ivory/60 transition hover:text-champagne"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ivory/50">
            Todavía no hay perfumes. Creá uno o importá un Excel.
          </p>
        )}
      </div>
    </div>
  );
}
