"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProduct, type FormState } from "@/app/admin/actions";
import { submitWithoutReset } from "@/components/admin/useFormSubmit";
import { Alert, Field, Select, TextInput, primaryButtonClass } from "@/components/admin/fields";
import type { Usage } from "@/generated/prisma/enums";
import { CATEGORY_LABELS, GENDER_LABELS, PRESENTATION_LABELS, USAGE_OPTIONS } from "@/lib/labels";
import type { ProductView } from "@/lib/products";

const BADGE_OPTIONS = { None: "Sin badge", BestSeller: "Best Seller", Viral: "Viral Árabe", Offer: "Oferta" };

export function ProductForm({ product }: { product?: ProductView }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});

  return (
    <form onSubmit={submitWithoutReset(action)} className="glass grid gap-5 rounded-2xl p-5 sm:p-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Marca">
          <TextInput name="brand" defaultValue={product?.brand} required />
        </Field>
        <Field label="Nombre">
          <TextInput name="name" defaultValue={product?.name} required />
        </Field>
        <Field label="Categoría">
          <Select name="category" defaultValue={product?.category ?? "Designer"} options={CATEGORY_LABELS} />
        </Field>
        <Field label="Género">
          <Select name="gender" defaultValue={product?.gender ?? "Unisex"} options={GENDER_LABELS} />
        </Field>
        <Field label="Presentación">
          <Select name="presentation" defaultValue={product?.presentation ?? "Cerrado"} options={PRESENTATION_LABELS} />
        </Field>
        <Field label="Badge">
          <Select name="badge" defaultValue={product?.badge ?? "None"} options={BADGE_OPTIONS} />
        </Field>
        <Field label="Precio ARS" hint="Ej. 56187,50">
          <TextInput name="priceARS" inputMode="decimal" defaultValue={product?.priceARS.toString().replace(".", ",")} required />
        </Field>
        <Field label="Precio USD" hint="Si lo dejás vacío se calcula con la cotización de Ajustes.">
          <TextInput name="priceUSD" inputMode="decimal" defaultValue={product?.priceUSD.toString().replace(".", ",")} />
        </Field>
        <Field label="Duración en piel (horas)">
          <TextInput name="durationHours" type="number" min={1} max={48} defaultValue={product?.durationHours ?? 8} required />
        </Field>
        <Field label="Stock">
          <TextInput name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Notas de salida" hint="Separadas por coma">
          <TextInput name="topNotes" defaultValue={product?.topNotes.join(", ")} />
        </Field>
        <Field label="Notas de corazón" hint="Separadas por coma">
          <TextInput name="heartNotes" defaultValue={product?.heartNotes.join(", ")} />
        </Field>
        <Field label="Notas de fondo" hint="Separadas por coma">
          <TextInput name="baseNotes" defaultValue={product?.baseNotes.join(", ")} />
        </Field>
      </div>

      <fieldset className="grid gap-2 text-sm">
        <legend className="mb-1 text-ivory/80">Uso recomendado</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(USAGE_OPTIONS) as [Usage, (typeof USAGE_OPTIONS)[Usage]][]).map(([value, { label }]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-champagne/20 px-3 py-1.5 has-[:checked]:border-gold has-[:checked]:bg-gold/15"
            >
              <input
                type="checkbox"
                name="recommendedUsage"
                value={value}
                defaultChecked={product?.recommendedUsage.includes(value)}
                className="accent-[#d4af37]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Imagen (URL o ruta)" hint="Ej. /products/lattafa-khamrah.webp. Si queda vacío se usa esa ruta por defecto.">
          <TextInput name="imageUrl" defaultValue={product?.imageUrl} />
        </Field>
        <Field label="Slug (opcional)" hint="Identificador único. Si queda vacío se arma con marca y nombre.">
          <TextInput name="slug" defaultValue={product?.slug} />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Guardando…" : product ? "Guardar cambios" : "Crear perfume"}
        </button>
        <Link href="/admin" className="text-sm text-ivory/60 hover:text-ivory">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
