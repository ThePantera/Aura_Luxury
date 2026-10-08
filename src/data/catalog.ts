import type { Badge, Category, Gender, Presentation, Usage } from "../generated/prisma/enums";
import { DEFAULT_USD_RATE } from "../lib/defaults";

export const toUSD = (ars: number, rate = DEFAULT_USD_RATE) => Math.round((ars / rate) * 100) / 100;

export type CatalogProduct = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  gender: Gender;
  presentation: Presentation;
  sizeMl: number;
  priceARS: number;
  // Si falta, se calcula con la cotización por defecto.
  priceUSD?: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  recommendedUsage: Usage[];
  durationHours: number;
  badge: Badge;
  imageUrl: string;
  stock: number;
};

export const catalog: CatalogProduct[] = [
  {
    slug: "dior-sauvage-elixir",
    name: "Sauvage Elixir",
    brand: "Dior",
    category: "Designer",
    gender: "Masculino",
    presentation: "Cerrado",
    sizeMl: 60,
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
    gender: "Unisex",
    presentation: "Cerrado",
    sizeMl: 100,
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
    gender: "Masculino",
    presentation: "Cerrado",
    sizeMl: 100,
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
    gender: "Masculino",
    presentation: "Cerrado",
    sizeMl: 125,
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
    gender: "Femenino",
    presentation: "Cerrado",
    sizeMl: 100,
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

