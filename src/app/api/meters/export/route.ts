import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toCsvValue(v: unknown): string {
  const s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes(";")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const rows = await prisma.meterReading.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["id", "account", "prev", "curr", "diff", "period", "createdAt"];
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        toCsvValue(r.id),
        toCsvValue(r.account),
        toCsvValue(r.prev),
        toCsvValue(r.curr),
        toCsvValue(r.diff),
        toCsvValue(r.period ?? ""),
        toCsvValue(r.createdAt.toISOString()),
      ].join(",")
    );
  }

  const csv = "\uFEFF" + lines.join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="meters-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
