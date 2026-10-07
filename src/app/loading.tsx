// Esqueleto de la tienda mientras llega el catálogo.
export default function Loading() {
  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-4 p-4" aria-busy="true" aria-label="Cargando catálogo">
      <div className="h-10 w-40 animate-pulse rounded-full bg-surface" />
      <div className="grid gap-4 md:grid-cols-2 md:px-8">
        <div className="animate-pulse rounded-3xl bg-surface/60" />
        <div className="hidden animate-pulse rounded-3xl bg-surface/80 md:block" />
      </div>
      <div className="h-24 animate-pulse rounded-t-3xl bg-surface" />
    </div>
  );
}
