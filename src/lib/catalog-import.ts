import "server-only";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import { normalizeText, productInputSchema, formatIssues, type ProductInput } from "@/lib/product-input";

// Encabezados aceptados (en español o en inglés) para cada campo del producto.
const HEADER_ALIASES: Record<string, keyof ProductInput> = {
  nombre: "name",
  name: "name",
  perfume: "name",
  marca: "brand",
  brand: "brand",
  slug: "slug",
  categoria: "category",
  category: "category",
  genero: "gender",
  gender: "gender",
  presentacion: "presentation",
  presentation: "presentation",
  ml: "sizeMl",
  mililitros: "sizeMl",
  tamano: "sizeMl",
  tamanoml: "sizeMl",
  contenido: "sizeMl",
  sizeml: "sizeMl",
  precioars: "priceARS",
  pricears: "priceARS",
  precio: "priceARS",
  preciousd: "priceUSD",
  priceusd: "priceUSD",
  notassalida: "topNotes",
  salida: "topNotes",
  topnotes: "topNotes",
  notascorazon: "heartNotes",
  corazon: "heartNotes",
  heartnotes: "heartNotes",
  notasfondo: "baseNotes",
  fondo: "baseNotes",
  basenotes: "baseNotes",
  uso: "recommendedUsage",
  usos: "recommendedUsage",
  ocasion: "recommendedUsage",
  usorecomendado: "recommendedUsage",
  recommendedusage: "recommendedUsage",
  duracion: "durationHours",
  duracionhoras: "durationHours",
  horas: "durationHours",
  durationhours: "durationHours",
  badge: "badge",
  etiqueta: "badge",
  imagen: "imageUrl",
  imagenurl: "imageUrl",
  imageurl: "imageUrl",
  stock: "stock",
};

const MAX_ROWS = 2000;

export type ImportRow = { row: number; values: Record<string, unknown> };

function mapHeader(header: string) {
  return HEADER_ALIASES[normalizeText(header).replace(/[^a-z0-9]/g, "")];
}

function cellValue(cell: ExcelJS.Cell): unknown {
  const value = cell.value;
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && "result" in value) return value.result ?? "";
  return cell.text;
}

async function readExcel(buffer: ArrayBuffer): Promise<ImportRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const headers: (keyof ProductInput | undefined)[] = [];
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, column) => {
    headers[column] = mapHeader(cell.text);
  });

  const rows: ImportRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values: Record<string, unknown> = {};
    row.eachCell({ includeEmpty: true }, (cell, column) => {
      const field = headers[column];
      if (field) values[field] = cellValue(cell);
    });
    rows.push({ row: rowNumber, values });
  });
  return rows;
}

function readCsv(text: string): ImportRow[] {
  const parsed = Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => mapHeader(header) ?? `__ignorar_${header}`,
  });
  return parsed.data.map((values, index) => ({ row: index + 2, values }));
}

export async function readCatalogFile(file: File): Promise<ImportRow[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) return readExcel(await file.arrayBuffer());
  if (name.endsWith(".csv")) return readCsv(await file.text());
  throw new Error("El archivo debe ser .xlsx o .csv");
}

export type ImportResult = {
  valid: { row: number; product: ProductInput }[];
  errors: { row: number; message: string }[];
};

export function validateRows(rows: ImportRow[]): ImportResult {
  const result: ImportResult = { valid: [], errors: [] };
  const nonEmpty = rows.filter(({ values }) => Object.values(values).some((value) => String(value ?? "").trim() !== ""));

  if (nonEmpty.length > MAX_ROWS) {
    result.errors.push({ row: 0, message: `El archivo tiene más de ${MAX_ROWS} filas` });
    return result;
  }

  const seen = new Map<string, number>();
  for (const { row, values } of nonEmpty) {
    const parsed = productInputSchema.safeParse(values);
    if (!parsed.success) {
      result.errors.push({ row, message: formatIssues(parsed.error) });
      continue;
    }
    const firstRow = seen.get(parsed.data.slug);
    if (firstRow !== undefined) {
      result.errors.push({ row, message: `Repite el perfume de la fila ${firstRow} (${parsed.data.slug})` });
      continue;
    }
    seen.set(parsed.data.slug, row);
    result.valid.push({ row, product: parsed.data });
  }
  return result;
}

export const TEMPLATE_HEADERS = [
  "Nombre",
  "Marca",
  "Categoria",
  "Genero",
  "Presentacion",
  "Precio ARS",
  "Precio USD",
  "Notas salida",
  "Notas corazon",
  "Notas fondo",
  "Usos",
  "Duracion horas",
  "Badge",
  "Imagen",
  "Stock",
];

export const TEMPLATE_EXAMPLE = [
  "Khamrah",
  "Lattafa",
  "Árabes",
  "Unisex",
  "Cerrado",
  "56187,50",
  "36,25",
  "Canela, Nuez moscada, Bergamota",
  "Dátiles, Praliné, Nardo",
  "Vainilla, Haba tonka, Mirra",
  "Noche, Invierno",
  "10",
  "Viral",
  "",
  "10",
];
