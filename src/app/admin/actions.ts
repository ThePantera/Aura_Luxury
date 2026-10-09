"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-session";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, credentialsMatch } from "@/lib/auth";
import { readCatalogFile, validateRows } from "@/lib/catalog-import";
import { prisma } from "@/lib/prisma";
import { formatIssues, placeholderImageUrl, productInputSchema, type ProductInput } from "@/lib/product-input";
import { getSettings } from "@/lib/settings";

export type FormState = { error?: string; message?: string };

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!(await credentialsMatch(user, password))) return { error: "Usuario o contraseña incorrectos." };

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

// Si no se carga el precio en USD, se calcula con la cotización vigente.
function toProductData(input: ProductInput, usdRate: number) {
  return {
    ...input,
    priceUSD: input.priceUSD ?? Math.round((input.priceARS / usdRate) * 100) / 100,
  };
}

function refreshStore() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = productInputSchema.safeParse({
    ...Object.fromEntries(formData),
    recommendedUsage: formData.getAll("recommendedUsage"),
  });
  if (!parsed.success) return { error: formatIssues(parsed.error) };

  const data = toProductData(parsed.data, (await getSettings()).usdRate);
  try {
    if (id) await prisma.product.update({ where: { id }, data });
    else await prisma.product.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: `Ya existe otro perfume con el identificador "${data.slug}". Cambiá el nombre o el slug.` };
    }
    throw error;
  }

  refreshStore();
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.product.delete({ where: { id } });
  refreshStore();
}

export type ImportState = {
  error?: string;
  created?: number;
  updated?: number;
  errors?: { row: number; message: string }[];
};

export async function importCatalog(_: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Elegí un archivo .xlsx o .csv." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "El archivo supera los 5 MB." };

  let rows;
  try {
    rows = await readCatalogFile(file);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo leer el archivo." };
  }

  const { valid, errors } = validateRows(rows);
  if (valid.length === 0 && errors.length === 0) return { error: "El archivo no tiene filas con datos." };

  // Se actualiza por slug (marca + nombre): lo existente se pisa y lo nuevo se crea.
  const existing = new Set(
    (
      await prisma.product.findMany({
        where: { slug: { in: valid.map(({ product }) => product.slug) } },
        select: { slug: true },
      })
    ).map(({ slug }) => slug),
  );

  const { usdRate } = await getSettings();
  await prisma.$transaction(
    valid.map(({ product }) => {
      const data = toProductData(product, usdRate);
      // Si la fila no trae imagen, el perfume existente conserva la foto que ya tenía.
      const { imageUrl, ...withoutImage } = data;
      const update = imageUrl === placeholderImageUrl(data.slug) ? withoutImage : data;
      return prisma.product.upsert({ where: { slug: data.slug }, update, create: data });
    }),
  );

  refreshStore();
  const updated = valid.filter(({ product }) => existing.has(product.slug)).length;
  return { created: valid.length - updated, updated, errors };
}

export async function saveSettings(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const usdRate = Number(String(formData.get("usdRate") ?? "").replace(",", "."));
  const whatsappPhone = String(formData.get("whatsappPhone") ?? "").replace(/\D/g, "");
  if (!Number.isFinite(usdRate) || usdRate <= 0) return { error: "La cotización debe ser un número mayor a 0." };
  if (whatsappPhone.length < 8 || whatsappPhone.length > 15) {
    return { error: "El teléfono debe tener entre 8 y 15 dígitos, con código de país (ej. 5491123884030)." };
  }

  await prisma.setting.upsert({
    where: { id: 1 },
    update: { usdRate, whatsappPhone },
    create: { id: 1, usdRate, whatsappPhone },
  });

  let message = "Ajustes guardados.";
  if (formData.get("recalculate") === "on") {
    const count = await prisma.$executeRaw`UPDATE "Product" SET "priceUSD" = ROUND("priceARS" / ${usdRate}, 2)`;
    message = `Ajustes guardados y precios en USD recalculados en ${count} perfumes.`;
  }

  refreshStore();
  return { message };
}
