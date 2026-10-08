import { z } from "zod";
import { Badge, Category, Gender, Presentation, Usage } from "@/generated/prisma/enums";
import { parseSizeMl } from "@/lib/size";

// Validación compartida por el formulario del panel y el importador de Excel/CSV.

export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export const slugify = (text: string) =>
  normalizeText(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Acepta los valores internos y sus nombres en español, sin importar mayúsculas ni acentos.
function enumField<T extends string>(values: Record<string, T>, aliases: Record<string, T>, label: string) {
  const lookup = new Map<string, T>();
  for (const value of Object.values(values)) lookup.set(normalizeText(value), value);
  for (const [alias, value] of Object.entries(aliases)) lookup.set(normalizeText(alias), value);
  return z.string({ error: `Falta ${label.toLowerCase()}` }).transform((raw, ctx) => {
    const match = lookup.get(normalizeText(raw));
    if (!match) {
      ctx.addIssue({ code: "custom", message: `${label}: "${raw}" no es un valor válido` });
      return z.NEVER;
    }
    return match;
  });
}

export const categoryField = enumField(Category, {
  arabe: "Arabian",
  arabes: "Arabian",
  "perfumeria arabe": "Arabian",
  disenador: "Designer",
  diseñador: "Designer",
  nicho: "Niche",
  "nicho & lujo": "Niche",
  decants: "Decant",
  "decants & travel": "Decant",
}, "Categoría");

export const genderField = enumField(Gender, {
  hombre: "Masculino",
  "para el": "Masculino",
  male: "Masculino",
  mujer: "Femenino",
  "para ella": "Femenino",
  female: "Femenino",
}, "Género");

export const presentationField = enumField(Presentation, {
  "mini talla": "MiniTalla",
  mini: "MiniTalla",
  decant: "MiniTalla",
  "frasco cerrado": "Cerrado",
}, "Presentación");

export const usageField = enumField(Usage, {
  oficina: "Office",
  noche: "Night",
  verano: "Summer",
  invierno: "Winter",
  entrenamiento: "Gym",
}, "Uso");

export const badgeField = enumField(Badge, {
  "best seller": "BestSeller",
  "viral arabe": "Viral",
  oferta: "Offer",
  ninguno: "None",
}, "Badge");

// Entiende "56.187,50", "56187,5", "56187.5" y números que ya vienen de Excel.
export function parseNumber(raw: unknown): number {
  if (typeof raw === "number") return raw;
  const text = String(raw ?? "").replace(/[$\s]|ARS|USD/gi, "");
  if (text === "") return Number.NaN;
  if (text.includes(",") && text.includes(".")) return Number(text.replace(/\./g, "").replace(",", "."));
  if (text.includes(",")) return Number(text.replace(",", "."));
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, ""));
  return Number(text);
}

// Listas separadas por coma, punto y coma o barra.
export const splitList = (raw: unknown) =>
  String(raw ?? "")
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);

const numberField = (label: string) =>
  z.unknown().optional().transform((raw, ctx) => {
    const value = parseNumber(raw);
    if (!Number.isFinite(value)) {
      ctx.addIssue({ code: "custom", message: `${label} no es un número válido` });
      return z.NEVER;
    }
    return value;
  });

const optionalNumberField = (label: string) =>
  z.unknown().optional().transform((raw, ctx) => {
    if (raw === undefined || raw === null || String(raw).trim() === "") return undefined;
    const value = parseNumber(raw);
    if (!Number.isFinite(value)) {
      ctx.addIssue({ code: "custom", message: `${label} no es un número válido` });
      return z.NEVER;
    }
    return value;
  });

// Celdas o campos vacíos cuentan como "no informado" para que apliquen los valores por defecto.
const blankToUndefined = (raw: unknown) =>
  raw === null || raw === undefined || String(raw).trim() === "" ? undefined : raw;

const withDefault = <T extends z.ZodType>(field: T, fallback: z.output<T>) =>
  z.preprocess(blankToUndefined, field.optional()).transform((value) => value ?? fallback);

export const productInputSchema = z
  .object({
    name: z.string({ error: "Falta el nombre" }).trim().min(1, "Falta el nombre"),
    brand: z.string({ error: "Falta la marca" }).trim().min(1, "Falta la marca"),
    slug: z.preprocess(blankToUndefined, z.string().trim().optional()),
    category: categoryField,
    gender: withDefault(genderField, "Unisex"),
    presentation: withDefault(presentationField, "Cerrado"),
    sizeMl: optionalNumberField("Mililitros").pipe(z.number().positive("Los ml deben ser mayores a 0").optional()),
    priceARS: numberField("Precio ARS").pipe(z.number().positive("El precio ARS debe ser mayor a 0")),
    priceUSD: optionalNumberField("Precio USD").pipe(z.number().nonnegative("El precio USD no puede ser negativo").optional()),
    topNotes: z.unknown().optional().transform(splitList),
    heartNotes: z.unknown().optional().transform(splitList),
    baseNotes: z.unknown().optional().transform(splitList),
    recommendedUsage: z
      .unknown()
      .optional()
      .transform((raw) => (Array.isArray(raw) ? raw.map(String) : splitList(raw)))
      .pipe(z.array(usageField)),
    durationHours: numberField("Duración").pipe(
      z
        .number()
        .int("La duración debe ser un número entero de horas")
        .min(1, "La duración mínima es 1 hora")
        .max(48, "La duración máxima es 48 horas"),
    ),
    badge: withDefault(badgeField, "None"),
    imageUrl: z.preprocess(blankToUndefined, z.string().trim().optional()),
    stock: numberField("Stock").pipe(z.number().int("El stock debe ser un número entero").min(0, "El stock no puede ser negativo")),
  })
  .transform((input) => {
    const slug = input.slug ? slugify(input.slug) : slugify(`${input.brand} ${input.name}`);
    return {
      ...input,
      slug,
      // Si no se cargan los ml, se toman del nombre ("Sauvage Elixir 100 ml").
      sizeMl: input.sizeMl ?? parseSizeMl(input.name) ?? null,
      recommendedUsage: [...new Set(input.recommendedUsage)],
      imageUrl: input.imageUrl || `/products/${slug}.webp`,
    };
  });

export type ProductInput = z.infer<typeof productInputSchema>;

export function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(". ");
}
