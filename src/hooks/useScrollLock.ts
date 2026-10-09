import { useEffect } from "react";

// Mientras hay un panel abierto la página de fondo no se desplaza.
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}
