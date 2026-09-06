import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportPublicUrl } from "@/lib/report-url";

export const dynamic = "force-dynamic";

/**
 * Посилання на PDF-звіти для сторінок сайту. Групи: pitna | kos | richka.
 * url — пряме посилання з папки сайту (/reports/quality/...), з фолбеком на оригінал.
 */
export async function GET() {
  try {
    const rows = await prisma.qualityReport.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
    const grouped: Record<string, { title: string; url: string; sourceUrl: string }[]> = { pitna: [], kos: [], richka: [] };
    for (const r of rows) {
      if (grouped[r.category]) grouped[r.category].push({ title: r.title, url: reportPublicUrl(r), sourceUrl: r.sourceUrl });
    }
    return NextResponse.json({ ok: true, ...grouped }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
