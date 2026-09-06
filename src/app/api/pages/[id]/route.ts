import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.page.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { slug, title, content } = body;
  const updated = await prisma.page.update({
    where: { id },
    data: {
      ...(slug && { slug: slugify(String(slug)) }),
      ...(title !== undefined && { title: String(title) }),
      ...(content !== undefined && { content: String(content) }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.page.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const form = await req.formData();
  const method = form.get("_method") as string | null;
  if (method === "DELETE") {
    await prisma.page.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/pages", req.url), 303);
  }
  const slug = form.get("slug") as string | null;
  const title = form.get("title") as string | null;
  const content = form.get("content") as string | null;
  await prisma.page.update({
    where: { id },
    data: {
      ...(slug && { slug: slugify(slug) }),
      ...(title && { title }),
      ...(content !== null && { content: content || "" }),
    },
  });
  return NextResponse.redirect(new URL("/admin/pages", req.url), 303);
}
