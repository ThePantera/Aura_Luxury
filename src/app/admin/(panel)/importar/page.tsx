import { ImportForm } from "@/components/admin/ImportForm";

export default function ImportPage() {
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl text-champagne">Importación masiva</h1>
      <ImportForm />
    </div>
  );
}
