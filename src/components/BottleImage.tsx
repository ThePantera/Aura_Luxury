"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Status = "loading" | "loaded" | "failed";

// Frasco dorado con las iniciales de la marca: se ve mientras carga la foto y queda si la foto falla.
function BottleSilhouette({ brand, shimmer }: { brand: string; shimmer: boolean }) {
  const initials = brand
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`flex h-[80%] max-h-80 flex-col items-center ${shimmer ? "animate-pulse" : ""}`}>
        <div className="h-[14%] w-[34%] min-w-10 rounded-t-md bg-gradient-to-b from-champagne to-[#8a6d1f]" />
        <div className="h-[4%] w-[22%] min-w-6 bg-[#6b5418]" />
        <div className="flex aspect-[3/4] h-[82%] items-center justify-center rounded-3xl border border-champagne/40 bg-gradient-to-br from-champagne/25 via-gold/10 to-transparent shadow-[inset_0_0_40px_rgba(230,198,135,0.15)]">
          <span className="font-display text-2xl text-champagne sm:text-3xl">{initials}</span>
        </div>
      </div>
    </div>
  );
}

type Props = {
  src: string;
  name: string;
  brand: string;
  sizes?: string;
  // Solo la imagen visible al abrir la página debe cargarse con prioridad.
  priority?: boolean;
};

export function BottleImage({ src, name, brand, sizes = "(min-width: 768px) 45vw, 80vw", priority = false }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  // La imagen puede terminar (bien o mal) antes de que React hidrate y nunca disparar sus eventos.
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    setStatus(img.naturalWidth === 0 ? "failed" : "loaded");
  }, []);

  return (
    <div className="relative h-full w-full" role="img" aria-label={`${brand} ${name}`}>
      {status !== "loaded" && (
        <div className="absolute inset-0">
          <BottleSilhouette brand={brand} shimmer={status === "loading"} />
        </div>
      )}
      {status !== "failed" && (
        <Image
          ref={imgRef}
          src={src}
          alt=""
          fill
          sizes={sizes}
          // Las fotos de catálogo suelen venir con fondo blanco: se muestran como una lámina clara con bordes redondeados.
          className={`rounded-2xl bg-white object-contain p-[6%] transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
          priority={priority}
        />
      )}
    </div>
  );
}
