import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.tariff.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, price, unit, category, validFrom } = body;
  const updated = await prisma.tariff.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: String(title) }),
      ...(price !== undefined && { price: String(price) }),
      ...(unit !== undefined && { unit: String(unit) }),
      ...(category !== undefined && { category: String(category) }),
      ...(validFrom !== undefined && { validFrom: new Date(String(validFrom)) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.tariff.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const form = await req.formData();
  const method = form.get("_method") as string | null;
  if (method === "DELETE") {
    await prisma.tariff.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/tariffs", req.url), 303);
  }
  const title = form.get("title") as string | null;
  const price = form.get("price") as string | null;
  const unit = form.get("unit") as string | null;
  const category = form.get("category") as string | null;
  const validFrom = form.get("validFrom") as string | null;
  await prisma.tariff.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(price && { price }),
      ...(unit && { unit }),
      ...(category && { category }),
      ...(validFrom && { validFrom: new Date(validFrom) }),
    },
  });
  return NextResponse.redirect(new URL("/admin/tariffs", req.url), 303);
}
