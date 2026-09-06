import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });
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
  const fileUrl = body.fileUrl as string | undefined;
  const category = body.category as string | undefined;
  if (!title || !fileUrl) return NextResponse.json({ error: "title and fileUrl required" }, { status: 400 });
  const created = await prisma.document.create({
    data: {
      title: String(title),
      fileUrl: String(fileUrl),
      category: category ? String(category) : "other",
    },
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin/documents", req.url), 303);
  }
  return NextResponse.json(created, { status: 201 });
}
