import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const data = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ct = req.headers.get("content-type") || "";
  let body: Record<string, unknown> = {};
  if (ct.includes("application/json")) {
    body = await req.json();
  } else {
    const form = await req.formData();
    body = Object.fromEntries(form.entries()) as Record<string, unknown>;
  }
  const slug = body.slug as string | undefined;
  const title = body.title as string | undefined;
  const content = body.content as string | undefined;
  if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  const created = await prisma.page.create({
    data: {
      slug: slugify(String(slug)),
      title: String(title),
      content: content ? String(content) : "",
    },
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin/pages", req.url), 303);
  }
  return NextResponse.json(created, { status: 201 });
}
