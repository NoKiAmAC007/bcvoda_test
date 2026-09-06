import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.outage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, address, district, status, time, x, y, order } = body;
  if (!title || !address || !district) return NextResponse.json({ error: "title, address, district required" }, { status: 400 });
  const created = await prisma.outage.create({
    data: {
      title: String(title),
      address: String(address),
      district: String(district),
      status: String(status || "active"),
      time: String(time || new Date().toLocaleDateString("uk-UA")),
      x: Number(x) || 300,
      y: Number(y) || 180,
      order: order !== undefined ? Number(order) : 0,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
