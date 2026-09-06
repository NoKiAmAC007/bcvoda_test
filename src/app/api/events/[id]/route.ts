import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.event.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, slug, excerpt, content, image, publishedAt } = body;
  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(title && { title: String(title) }),
      ...(slug && { slug: slugify(String(slug)) }),
      excerpt: excerpt !== undefined ? (excerpt ? String(excerpt) : null) : undefined,
      content: content !== undefined ? String(content) : undefined,
      image: image !== undefined ? (image ? String(image) : null) : undefined,
      ...(publishedAt && { publishedAt: new Date(String(publishedAt)) }),
    },
  });
  return NextResponse.json(updated);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const form = await req.formData();
  const method = form.get("_method") as string | null;

  if (method === "DELETE") {
    await prisma.event.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/events", req.url), 303);
  }

  const title = form.get("title") as string | null;
  const slug = form.get("slug") as string | null;
  const excerpt = form.get("excerpt") as string | null;
  const content = form.get("content") as string | null;
  const image = form.get("image") as string | null;
  await prisma.event.update({ where: { id }, data: { ...(title && { title }), ...(slug && { slug: slugify(slug) }), excerpt: excerpt ?? undefined, content: content ?? undefined, image: image ?? undefined } });
  return NextResponse.redirect(new URL("/admin/events", req.url), 303);
}
