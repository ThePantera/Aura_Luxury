"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(event) => {
        if (!confirm(`¿Eliminar ${name}? No se puede deshacer.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" aria-label={`Eliminar ${name}`} className="p-2 text-ivory/40 transition hover:text-red-300">
        <Trash2 className="size-4" aria-hidden />
      </button>
    </form>
  );
}
