import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.waterQualityHistory.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { month, label, pH, turbidity, chlorine, hardness, order } = body;
  if (!month || !label) return NextResponse.json({ error: "month and label required" }, { status: 400 });
  const created = await prisma.waterQualityHistory.create({
    data: {
      month: String(month),
      label: String(label),
      pH: Number(pH) || 7.3,
      turbidity: Number(turbidity) || 0.12,
      chlorine: Number(chlorine) || 0.28,
      hardness: Number(hardness) || 2.1,
      order: order !== undefined ? Number(order) : 0,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
