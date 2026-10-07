import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // El importador de Excel/CSV acepta archivos de hasta 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
