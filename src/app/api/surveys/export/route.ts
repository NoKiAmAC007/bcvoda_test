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
  const rows = await prisma.qualitySurvey.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "id",
    "satisfaction",
    "taste",
    "tasteOther",
    "smell",
    "smellOther",
    "turbidity",
    "pressure",
    "pressureOther",
    "remarks",
    "street",
    "building",
    "apartment",
    "lastName",
    "firstName",
    "middleName",
    "phone",
    "email",
    "createdAt",
  ];
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        toCsvValue(r.id),
        toCsvValue(r.satisfaction),
        toCsvValue(r.taste),
        toCsvValue(r.tasteOther),
        toCsvValue(r.smell),
        toCsvValue(r.smellOther),
        toCsvValue(r.turbidity),
        toCsvValue(r.pressure),
        toCsvValue(r.pressureOther),
        toCsvValue(r.remarks),
        toCsvValue(r.street),
        toCsvValue(r.building),
        toCsvValue(r.apartment),
        toCsvValue(r.lastName),
        toCsvValue(r.firstName),
        toCsvValue(r.middleName),
        toCsvValue(r.phone),
        toCsvValue(r.email),
        toCsvValue(r.createdAt.toISOString()),
      ].join(",")
    );
  }

  const csv = "\uFEFF" + lines.join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="surveys-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
