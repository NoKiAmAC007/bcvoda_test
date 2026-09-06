import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.heroSlide.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, imageUrl, link, order } = body;
  const updated = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: String(title) }),
      ...(imageUrl !== undefined && { imageUrl: String(imageUrl) }),
      ...(link !== undefined && { link: link ? String(link) : null }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const form = await req.formData();
  const method = form.get("_method") as string | null;
  if (method === "DELETE") {
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/hero", req.url), 303);
  }
  const title = form.get("title") as string | null;
  const imageUrl = form.get("imageUrl") as string | null;
  const link = form.get("link") as string | null;
  const order = form.get("order") as string | null;
  await prisma.heroSlide.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(imageUrl && { imageUrl }),
      ...(link !== null && { link: link || null }),
      ...(order !== null && order !== "" && { order: Number(order) }),
    },
  });
  return NextResponse.redirect(new URL("/admin/hero", req.url), 303);
}
