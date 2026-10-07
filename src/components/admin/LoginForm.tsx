"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";
import { submitWithoutReset } from "@/components/admin/useFormSubmit";
import { Alert, Field, TextInput, primaryButtonClass } from "@/components/admin/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});

  return (
    <form onSubmit={submitWithoutReset(action)} className="glass grid w-full max-w-sm gap-4 rounded-3xl p-6">
      <h1 className="font-display text-3xl text-gold-gradient">Aura Luxury</h1>
      <p className="-mt-2 text-sm text-ivory/60">Panel de administración</p>
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Field label="Usuario">
        <TextInput name="user" autoComplete="username" required />
      </Field>
      <Field label="Contraseña">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
