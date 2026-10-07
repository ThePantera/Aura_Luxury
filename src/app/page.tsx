import { Sparkles } from "lucide-react";

// Pantalla provisoria hasta la Fase 2 (escaparate 100vh).
export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4 overflow-hidden px-4 text-center">
      <Sparkles className="size-8 text-gold" aria-hidden />
      <h1 className="font-display text-4xl text-champagne sm:text-6xl">
        Perfum Luxury
      </h1>
      <p className="max-w-md text-sm text-ivory/70">
        Perfumería de diseñador, árabe y de nicho. Muy pronto.
      </p>
    </main>
  );
}
