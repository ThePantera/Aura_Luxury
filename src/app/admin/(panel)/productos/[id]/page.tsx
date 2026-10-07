import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    omit: { createdAt: true, updatedAt: true },
  });
  if (!product) notFound();

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl text-champagne">
        {product.brand} {product.name}
      </h1>
      <ProductForm product={{ ...product, priceARS: Number(product.priceARS), priceUSD: Number(product.priceUSD) }} />
    </div>
  );
}
