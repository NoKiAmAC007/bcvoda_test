import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.statusChip.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { label, bg, title, body: chipBody, href, order } = body;
  if (!label || !title || !chipBody) return NextResponse.json({ error: "label, title, body required" }, { status: 400 });
  const created = await prisma.statusChip.create({
    data: {
      label: String(label),
      bg: String(bg || "#E8DEF8"),
      title: String(title),
      body: String(chipBody),
      href: href ? String(href) : null,
      order: order !== undefined ? Number(order) : 0,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
