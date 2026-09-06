import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
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
  const title = body.title as string | undefined;
  const imageUrl = body.imageUrl as string | undefined;
  if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
  const created = await prisma.galleryItem.create({
    data: {
      title: title ? String(title) : null,
      imageUrl: String(imageUrl),
    },
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin/gallery", req.url), 303);
  }
  return NextResponse.json(created, { status: 201 });
}
