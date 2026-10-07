"use client";

import { Download, Upload } from "lucide-react";
import { useActionState } from "react";
import { importCatalog, type ImportState } from "@/app/admin/actions";
import { Alert, inputClass, primaryButtonClass } from "@/components/admin/fields";

export function ImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(importCatalog, {});
  const done = state.created !== undefined;

  return (
    <div className="grid gap-5">
      <form action={action} className="glass grid gap-4 rounded-2xl p-5 sm:p-6">
        <p className="text-sm text-ivory/70">
          Subí un Excel (.xlsx) o CSV con una fila por perfume. Los perfumes que ya existen (misma marca y nombre)
          se actualizan y los nuevos se crean. Las filas con errores se saltean y se listan abajo.
        </p>
        <a href="/admin/importar/plantilla" className="inline-flex w-fit items-center gap-2 text-sm text-champagne hover:text-gold">
          <Download className="size-4" aria-hidden />
          Descargar plantilla CSV
        </a>
        <input name="file" type="file" accept=".xlsx,.csv" required className={inputClass} />
        <button type="submit" disabled={pending} className={`${primaryButtonClass} w-fit`}>
          <Upload className="size-4" aria-hidden />
          {pending ? "Importando…" : "Importar catálogo"}
        </button>
      </form>

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {done && (
        <Alert tone="success">
          Importación lista: {state.created} perfumes nuevos y {state.updated} actualizados
          {state.errors?.length ? `, ${state.errors.length} filas con errores.` : "."}
        </Alert>
      )}
      {state.errors && state.errors.length > 0 && (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-ivory/40">
              <tr>
                <th className="px-4 py-3 font-medium">Fila</th>
                <th className="px-4 py-3 font-medium">Problema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/10">
              {state.errors.map(({ row, message }) => (
                <tr key={`${row}-${message}`}>
                  <td className="px-4 py-2 tabular-nums text-ivory/60">{row || "—"}</td>
                  <td className="px-4 py-2 text-red-200">{message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
