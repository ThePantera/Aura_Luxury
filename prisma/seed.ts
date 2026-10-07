import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { catalog as products, toUSD } from "../src/data/catalog";

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
  console.log(`Seed completo: ${products.length} perfumes cargados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
