import { DEFAULT_USD_RATE, DEFAULT_WHATSAPP_PHONE } from "@/lib/defaults";

export type Settings = { usdRate: number; whatsappPhone: string };

export async function getSettings(): Promise<Settings> {
  const defaults = { usdRate: DEFAULT_USD_RATE, whatsappPhone: DEFAULT_WHATSAPP_PHONE };
  if (!process.env.DATABASE_URL) return defaults;

  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!row) return defaults;
  return { usdRate: Number(row.usdRate), whatsappPhone: row.whatsappPhone };
}
