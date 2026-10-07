import Papa from "papaparse";
import { TEMPLATE_EXAMPLE, TEMPLATE_HEADERS } from "@/lib/catalog-import";

export function GET() {
  // BOM para que Excel abra bien los acentos.
  const csv = "﻿" + Papa.unparse([TEMPLATE_HEADERS, TEMPLATE_EXAMPLE]);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="plantilla-perfum-luxury.csv"',
    },
  });
}
