import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin · Aura Luxury", robots: { index: false } };

// El panel siempre lee datos actuales de la base.
export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/importar", label: "Importar" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-champagne/10 bg-matte/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-display text-xl text-gold-gradient">
            Aura Luxury · Admin
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-full px-3 py-1.5 text-ivory/70 transition hover:bg-champagne/10 hover:text-champagne">
                {label}
              </Link>
            ))}
            <Link href="/" className="rounded-full px-3 py-1.5 text-ivory/70 transition hover:text-champagne">
              Ver tienda
            </Link>
            <form action={logout}>
              <button type="submit" className="rounded-full px-3 py-1.5 text-ivory/50 transition hover:text-red-300">
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {process.env.DATABASE_URL ? (
          children
        ) : (
          <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            Falta configurar DATABASE_URL. El panel necesita la base de datos para guardar cambios.
          </p>
        )}
      </main>
    </div>
  );
}
