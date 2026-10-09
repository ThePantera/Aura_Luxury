// Dirección pública de la tienda, para links compartidos, vista previa en redes y el sitemap de Google.
// En Vercel se toma sola del dominio de producción; NEXT_PUBLIC_SITE_URL permite fijar un dominio propio.
const productionHost = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = productionHost
  ? productionHost.startsWith("http")
    ? productionHost
    : `https://${productionHost}`
  : "http://localhost:3000";

export const productPath = (slug: string) => `/perfume/${slug}`;
