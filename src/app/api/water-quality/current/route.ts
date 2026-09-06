import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let q = await prisma.waterQuality.findUnique({ where: { id: "current" } });
  if (!q) q = await prisma.waterQuality.create({ data: { id: "current" } });
  return NextResponse.json(q);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { pH, chlorine, hardness, turbidity, pressure, reportMonth } = body;
  const data: any = {};
  if (pH !== undefined) data.pH = Number(pH);
  if (chlorine !== undefined) data.chlorine = Number(chlorine);
  if (hardness !== undefined) data.hardness = Number(hardness);
  if (turbidity !== undefined) data.turbidity = Number(turbidity);
  if (pressure !== undefined) data.pressure = Number(pressure);
  if (reportMonth !== undefined) data.reportMonth = String(reportMonth);
  const updated = await prisma.waterQuality.upsert({
    where: { id: "current" },
    create: { id: "current", ...data },
    update: data,
  });
  return NextResponse.json(updated);
}
