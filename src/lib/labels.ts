import {
  Briefcase,
  Crown,
  Dumbbell,
  Flame,
  Moon,
  Package,
  Plane,
  Snowflake,
  Sun,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { Badge, Category, Gender, Presentation, Usage } from "@/generated/prisma/enums";

export const CATEGORY_LABELS: Record<Category, string> = {
  Designer: "Diseñador",
  Arabian: "Árabes",
  Niche: "Nicho & Lujo",
  Decant: "Decants & Travel",
};

export const GENDER_LABELS: Record<Gender, string> = {
  Masculino: "Masculino",
  Femenino: "Femenino",
  Unisex: "Unisex",
};

export const USAGE_OPTIONS: Record<Usage, { label: string; icon: LucideIcon }> = {
  Gym: { label: "Gym", icon: Dumbbell },
  Office: { label: "Oficina", icon: Briefcase },
  Night: { label: "Noche", icon: Moon },
  Summer: { label: "Verano", icon: Sun },
  Winter: { label: "Invierno", icon: Snowflake },
};

export const PRESENTATION_LABELS: Record<Presentation, string> = {
  Cerrado: "Frasco cerrado",
  Tester: "Tester",
  MiniTalla: "Decant / Mini talla",
};

export const BADGES: Partial<Record<Badge, { label: string; icon: LucideIcon }>> = {
  BestSeller: { label: "Best Seller", icon: Flame },
  Viral: { label: "Viral Árabe", icon: Crown },
  Offer: { label: "Oferta", icon: Tag },
};

export const PRESENTATION_BADGES: Partial<Record<Presentation, { label: string; icon: LucideIcon }>> = {
  Tester: { label: "Tester", icon: Package },
  MiniTalla: { label: "Decant", icon: Plane },
};

const arsWhole = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const arsCents = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

const usdFormat = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
});

export const formatARS = (value: number) =>
  (Number.isInteger(value) ? arsWhole : arsCents).format(value);
export const formatUSD = (value: number) => usdFormat.format(value);
