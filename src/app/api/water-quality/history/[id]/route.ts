import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { month, label, pH, turbidity, chlorine, hardness, order } = body;
  const updated = await prisma.waterQualityHistory.update({
    where: { id },
    data: {
      ...(month !== undefined && { month: String(month) }),
      ...(label !== undefined && { label: String(label) }),
      ...(pH !== undefined && { pH: Number(pH) }),
      ...(turbidity !== undefined && { turbidity: Number(turbidity) }),
      ...(chlorine !== undefined && { chlorine: Number(chlorine) }),
      ...(hardness !== undefined && { hardness: Number(hardness) }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.waterQualityHistory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
