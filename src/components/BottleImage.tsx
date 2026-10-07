"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Si la foto del frasco no existe o falla, se dibuja un frasco estilizado con las iniciales.
export function BottleImage({ src, name, brand }: { src: string; name: string; brand: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Si la imagen falló antes de que React hidratara, onError no llega a dispararse.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    const initials = brand
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 3);

    return (
      <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`${brand} ${name}`}>
        <div className="flex h-[80%] max-h-80 flex-col items-center">
          <div className="h-[14%] w-[34%] min-w-10 rounded-t-md bg-gradient-to-b from-champagne to-[#8a6d1f]" />
          <div className="h-[4%] w-[22%] min-w-6 bg-[#6b5418]" />
          <div className="flex aspect-[3/4] h-[82%] items-center justify-center rounded-3xl border border-champagne/40 bg-gradient-to-br from-champagne/25 via-gold/10 to-transparent shadow-[inset_0_0_40px_rgba(230,198,135,0.15)]">
            <span className="font-display text-2xl text-champagne sm:text-3xl">{initials}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      ref={imgRef}
      src={src}
      alt={`${brand} ${name}`}
      fill
      sizes="(min-width: 768px) 45vw, 80vw"
      className="object-contain"
      onError={() => setFailed(true)}
      priority
    />
  );
}
