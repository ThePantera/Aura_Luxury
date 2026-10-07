import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export const inputClass =
  "w-full rounded-xl border border-champagne/20 bg-matte/60 px-3 py-2 text-sm text-ivory outline-none transition placeholder:text-ivory/30 focus:border-gold";

export const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-6 font-semibold text-matte transition hover:brightness-110 disabled:opacity-50";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-ivory/80">{label}</span>
      {children}
      {hint && <span className="text-xs text-ivory/40">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

export function Select({ options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { options: Record<string, string> }) {
  return (
    <select {...props} className={inputClass}>
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export function Alert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${
        tone === "error" ? "border-red-400/40 bg-red-400/10 text-red-200" : "border-gold/40 bg-gold/10 text-champagne"
      }`}
    >
      {children}
    </p>
  );
}
