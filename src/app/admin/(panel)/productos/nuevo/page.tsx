import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl text-champagne">Nuevo perfume</h1>
      <ProductForm />
    </div>
  );
}
