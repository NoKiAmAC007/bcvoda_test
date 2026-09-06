import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runQualityCheck } from "@/lib/quality-check";
import { applyQualityCheck } from "@/lib/quality-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Щоденний крон якості води — Vercel викликає о 07:00 та 08:00 UTC,
 * що дорівнює 10:00 за Києвом влітку (EEST, UTC+3) і взимку (EET, UTC+2).
 * Перевірка ідемпотентна: зайвий запуск — no-op.
 * Якщо є новий звіт — одразу оновлює сайт:
 * БД QualityReport (посилання) + WaterQuality (місяць і цифри pH/хлор/жорсткість/каламутність).
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth && auth !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const force = new URL(req.url).searchParams.get("force") === "1";
  try {
    const check = await runQualityCheck();
    const res = await applyQualityCheck(prisma as any, check, { force });
    return NextResponse.json({ ok: true, ...res, warnings: res.warnings, checkedAt: check.checkedAt });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
