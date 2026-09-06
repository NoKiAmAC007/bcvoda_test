import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncContent } from "@/lib/content-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

/**
 * Щоденний крон контенту — Vercel викликає о 07:00 та 08:00 UTC (= 10:00 Київ).
 * Докладає нові новини/події з bcvoda.com.ua в БД. Ідемпотентний.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth && auth !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await syncContent(prisma as any);
    return NextResponse.json({ ok: true, ...res, checkedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
