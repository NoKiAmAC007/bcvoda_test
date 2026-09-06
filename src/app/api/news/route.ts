import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const data = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const contentType = req.headers.get("content-type") || "";
  let body: any = {};
  if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    const form = await req.formData();
    body = Object.fromEntries(form.entries());
  }
  const { title, slug, excerpt, content, image, publishedAt } = body;
  if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 });

  const created = await prisma.news.create({
    data: {
      title: String(title),
      slug: slugify(String(slug)),
      excerpt: excerpt ? String(excerpt) : null,
      content: content ? String(content) : String(excerpt || ""),
      image: image ? String(image) : null,
      ...(publishedAt && { publishedAt: new Date(String(publishedAt)) }),
    },
  });

  // if form submit, redirect to admin
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin", req.url), 303);
  }
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.news.deleteMany({});
  return NextResponse.json({ ok: true });
}
