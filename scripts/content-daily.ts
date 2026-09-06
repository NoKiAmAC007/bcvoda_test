#!/usr/bin/env tsx
/**
 * Щоденна синхронізація новин і подій з bcvoda.com.ua (запуск о 10:00 за Києвом).
 *   npx tsx scripts/content-daily.ts
 * Нові статті докладаються в БД (існуючі не чіпаємо). На Vercel — через /api/cron/content-daily.
 */
import { PrismaClient } from "@prisma/client";
import { syncContent } from "../src/lib/content-sync";

const prisma = new PrismaClient();

async function main() {
  console.log(`[content-daily] ${new Date().toISOString()} — синхронізація новин/подій`);
  const res = await syncContent(prisma as any);
  console.log(`[content-daily] готово: +новин ${res.news}, +подій ${res.events}, пропущено ${res.skipped}.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("[content-daily] FAIL:", e);
  process.exit(1);
});
