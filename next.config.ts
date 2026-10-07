import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desde el panel se pueden cargar fotos alojadas en cualquier sitio https (Cloudinary, Drive, etc.).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // El importador de Excel/CSV acepta archivos de hasta 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
