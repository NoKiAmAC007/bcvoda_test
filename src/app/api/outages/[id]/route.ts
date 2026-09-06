import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, address, district, status, time, x, y, order } = body;
  const updated = await prisma.outage.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: String(title) }),
      ...(address !== undefined && { address: String(address) }),
      ...(district !== undefined && { district: String(district) }),
      ...(status !== undefined && { status: String(status) }),
      ...(time !== undefined && { time: String(time) }),
      ...(x !== undefined && { x: Number(x) }),
      ...(y !== undefined && { y: Number(y) }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.outage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
