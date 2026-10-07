"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/app/admin/actions";
import { submitWithoutReset } from "@/components/admin/useFormSubmit";
import { Alert, Field, TextInput, primaryButtonClass } from "@/components/admin/fields";
import type { Settings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, {});

  return (
    <form onSubmit={submitWithoutReset(action)} className="glass grid max-w-xl gap-5 rounded-2xl p-5 sm:p-6">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.message && <Alert tone="success">{state.message}</Alert>}

      <Field label="Cotización del dólar (ARS por 1 USD)" hint="Se usa para calcular el precio en USD cuando un perfume no lo tiene cargado.">
        <TextInput name="usdRate" inputMode="decimal" defaultValue={settings.usdRate.toString().replace(".", ",")} required />
      </Field>

      <label className="flex items-start gap-2 text-sm text-ivory/80">
        <input type="checkbox" name="recalculate" className="mt-0.5 accent-[#d4af37]" />
        <span>
          Recalcular el precio en USD de todo el catálogo con esta cotización
          <span className="block text-xs text-ivory/40">Reemplaza los precios en USD cargados a mano.</span>
        </span>
      </label>

      <Field label="WhatsApp para pedidos" hint="Con código de país y sin espacios ni símbolos. Ej. 5491123884030">
        <TextInput name="whatsappPhone" inputMode="tel" defaultValue={settings.whatsappPhone} required />
      </Field>

      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-fit`}>
        {pending ? "Guardando…" : "Guardar ajustes"}
      </button>
    </form>
  );
}
