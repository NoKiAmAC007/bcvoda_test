#!/usr/bin/env tsx
/**
 * Щоденна перевірка звітів якості води (запуск о 10:00 за Києвом).
 *   npx tsx scripts/quality-daily.ts            — оновлює сайт лише якщо є новий звіт
 *   npx tsx scripts/quality-daily.ts --force    — примусово перезаписати все
 * На Vercel запускається через cron /api/cron/quality-daily (та сама логіка).
 */
import { PrismaClient } from "@prisma/client";
import { runQualityCheck } from "../src/lib/quality-check";
import { applyQualityCheck } from "../src/lib/quality-sync";

const prisma = new PrismaClient();

async function main() {
  console.log(`[quality-daily] ${new Date().toISOString()} — перевірка звітів з bcvoda.com.ua`);
  const check = await runQualityCheck();
  console.log(`  архіви: питна ${check.pitna.length}, КОС ${check.kos.length}, Рось ${check.richka.length}`);
  console.log(`  останній: ${check.pitna[0]?.title} — ${check.pitna[0]?.url}`);
  console.log(
    `  цифри з PDF: pH ${check.numbers.pH} | Cl ${check.numbers.chlorine} | жорстк ${check.numbers.hardness} | каламут ${check.numbers.turbidity}`
  );

  const res = await applyQualityCheck(prisma as any, check, { force: process.argv.includes("--force") });
  for (const w of res.warnings) console.warn("  !", w);
  console.log(res.isNew ? `[quality-daily] НОВИЙ ЗВІТ: ${res.title} — сайт оновлено.` : "[quality-daily] нового звіту немає — сайт без змін.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("[quality-daily] FAIL:", e);
  process.exit(1);
});
