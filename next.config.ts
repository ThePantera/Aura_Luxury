import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desde el panel se pueden cargar fotos alojadas en cualquier sitio https (Cloudinary, Drive, etc.).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // WebP se genera mucho más rápido que AVIF: la primera vez que se ve cada foto aparece antes.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // El importador de Excel/CSV acepta archivos de hasta 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
