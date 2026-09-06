import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { label, bg, title, body: chipBody, href, order } = body;
  const updated = await prisma.statusChip.update({
    where: { id },
    data: {
      ...(label !== undefined && { label: String(label) }),
      ...(bg !== undefined && { bg: String(bg) }),
      ...(title !== undefined && { title: String(title) }),
      ...(chipBody !== undefined && { body: String(chipBody) }),
      ...(href !== undefined && { href: href ? String(href) : null }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.statusChip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
