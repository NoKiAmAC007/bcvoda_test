import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const data = await prisma.event.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(data);
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ct = req.headers.get("content-type") || "";
  let body: any = {};
  if (ct.includes("application/json")) body = await req.json();
  else body = Object.fromEntries((await req.formData()).entries());
  const { title, slug, excerpt, content, image, publishedAt } = body;
  if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 });
  const created = await prisma.event.create({
    data: {
      title: String(title),
      slug: slugify(String(slug)),
      excerpt: excerpt ? String(excerpt) : null,
      content: content ? String(content) : String(excerpt || ""),
      image: image ? String(image) : null,
      ...(publishedAt && { publishedAt: new Date(String(publishedAt)) }),
    },
  });
  if (!ct.includes("application/json")) return NextResponse.redirect(new URL("/admin", req.url), 303);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.event.deleteMany({});
  return NextResponse.json({ ok: true });
}
