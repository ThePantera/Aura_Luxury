import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Ingresar · Perfum Luxury", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex h-dvh items-center justify-center overflow-y-auto px-4">
      <LoginForm />
    </main>
  );
}
