import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { catalog as products, toUSD } from "../src/data/catalog";
import { DEFAULT_USD_RATE, DEFAULT_WHATSAPP_PHONE } from "../src/lib/defaults";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  for (const { priceUSD, ...product } of products) {
    const data = { ...product, priceUSD: priceUSD ?? toUSD(product.priceARS) };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }
  // Crea los ajustes por defecto solo si todavía no existen, para no pisar lo editado en /admin.
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, usdRate: DEFAULT_USD_RATE, whatsappPhone: DEFAULT_WHATSAPP_PHONE },
  });
  console.log(`Seed completo: ${products.length} perfumes cargados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
