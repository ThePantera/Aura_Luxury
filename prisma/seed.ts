import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Cotización implícita en los ejemplos de referencia (56.187,50 ARS = 36,25 USD).
// En la Fase 4 pasa a ser editable desde el panel de ajustes.
const USD_RATE = 1550;

const toUSD = (ars: number) => Math.round((ars / USD_RATE) * 100) / 100;

type SeedProduct = Omit<Prisma.ProductCreateInput, "priceUSD"> & {
  priceARS: number;
  priceUSD?: number;
};

const products: SeedProduct[] = [
  {
    slug: "dior-sauvage-elixir",
    name: "Sauvage Elixir",
    brand: "Dior",
    category: "Designer",
    presentation: "Cerrado",
    priceARS: 518700,
    topNotes: ["Nuez moscada", "Canela", "Cardamomo", "Pomelo"],
    heartNotes: ["Lavanda"],
    baseNotes: ["Regaliz", "Sándalo", "Ámbar", "Pachulí", "Vetiver"],
    recommendedUsage: ["Night", "Winter"],
    durationHours: 12,
    badge: "BestSeller",
    imageUrl: "/products/dior-sauvage-elixir.webp",
    stock: 5,
  },
  {
    slug: "lattafa-khamrah",
    name: "Khamrah",
    brand: "Lattafa",
    category: "Arabian",
    presentation: "Cerrado",
    priceARS: 56187.5,
    priceUSD: 36.25,
    topNotes: ["Canela", "Nuez moscada", "Bergamota"],
    heartNotes: ["Dátiles", "Praliné", "Nardo", "Mahonial"],
    baseNotes: ["Vainilla", "Haba tonka", "Amberwood", "Mirra", "Benjuí"],
    recommendedUsage: ["Night", "Winter"],
    durationHours: 10,
    badge: "Viral",
    imageUrl: "/products/lattafa-khamrah.webp",
    stock: 10,
  },
  {
    slug: "antonio-banderas-blue-seduction",
    name: "Blue Seduction",
    brand: "Antonio Banderas",
    category: "Designer",
    presentation: "Cerrado",
    priceARS: 31785,
    topNotes: ["Melón", "Bergamota", "Menta"],
    heartNotes: ["Notas marinas", "Cardamomo"],
    baseNotes: ["Maderas", "Almizcle", "Ámbar"],
    recommendedUsage: ["Gym", "Office", "Summer"],
    durationHours: 5,
    badge: "Offer",
    imageUrl: "/products/antonio-banderas-blue-seduction.webp",
    stock: 10,
  },
  {
    slug: "jpg-le-male-elixir",
    name: "Le Male Elixir",
    brand: "Jean Paul Gaultier",
    category: "Designer",
    presentation: "Cerrado",
    priceARS: 296595,
    topNotes: ["Lavanda", "Menta"],
    heartNotes: ["Vainilla", "Benjuí"],
    baseNotes: ["Miel", "Haba tonka", "Tabaco"],
    recommendedUsage: ["Night", "Winter"],
    durationHours: 12,
    badge: "None",
    imageUrl: "/products/jpg-le-male-elixir.webp",
    stock: 5,
  },
  {
    slug: "lattafa-yara-rosa",
    name: "Yara Rosa",
    brand: "Lattafa",
    category: "Arabian",
    presentation: "Cerrado",
    priceARS: 67812.5,
    priceUSD: 43.75,
    topNotes: ["Orquídea", "Heliotropo", "Mandarina"],
    heartNotes: ["Acorde gourmand", "Frutas tropicales"],
    baseNotes: ["Vainilla", "Almizcle", "Sándalo"],
    recommendedUsage: ["Office", "Summer"],
    durationHours: 8,
    badge: "Viral",
    imageUrl: "/products/lattafa-yara-rosa.webp",
    stock: 10,
  },
];

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
