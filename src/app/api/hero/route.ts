import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
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
  const { title, imageUrl, link, order } = body as { title?: string; imageUrl?: string; link?: string; order?: string | number };
  if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
  const slide = await prisma.heroSlide.create({
    data: { title: title ? String(title) : "Слайд", imageUrl: String(imageUrl), link: link ? String(link) : null, order: order != null && order !== "" ? Number(order) : 0 },
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin/hero", req.url), 303);
  }
  return NextResponse.json(slide, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.heroSlide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
