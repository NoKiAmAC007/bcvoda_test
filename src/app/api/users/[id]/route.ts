import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.user.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { email, name, password, role } = body;
  let data: Record<string, unknown> = {};
  if (email !== undefined) data.email = String(email);
  if (name !== undefined) data.name = name ? String(name) : null;
  if (role !== undefined) data.role = role === "ADMIN" ? "ADMIN" : "EDITOR";
  if (password) {
    // bcryptjs not in dependencies — store plain
    data.password = String(password);
  }
  const updated = await prisma.user.update({ where: { id }, data: data as never });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const form = await req.formData();
  const method = form.get("_method") as string | null;
  if (method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/users", req.url), 303);
  }
  const email = form.get("email") as string | null;
  const name = form.get("name") as string | null;
  const password = form.get("password") as string | null;
  const role = form.get("role") as string | null;
  const data: Record<string, unknown> = {};
  if (email) data.email = email;
  if (name !== null) data.name = name || null;
  if (role) data.role = role === "ADMIN" ? "ADMIN" : "EDITOR";
  if (password) {
    data.password = password;
  }
  await prisma.user.update({ where: { id }, data: data as never });
  return NextResponse.redirect(new URL("/admin/users", req.url), 303);
}
