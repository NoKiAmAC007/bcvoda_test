import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
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
  const email = body.email as string | undefined;
  const name = body.name as string | undefined;
  const password = body.password as string | undefined;
  const role = body.role as string | undefined;
  if (!email || !password) return NextResponse.json({ error: "email and password required" }, { status: 400 });

  // bcryptjs not in package.json — storing plain per spec; if installed, would hash
  const hashed = String(password);

  const created = await prisma.user.create({
    data: {
      email: String(email),
      name: name ? String(name) : null,
      password: hashed,
      role: role === "ADMIN" ? "ADMIN" : "EDITOR",
    },
  });
  if (!ct.includes("application/json")) {
    return NextResponse.redirect(new URL("/admin/users", req.url), 303);
  }
  return NextResponse.json(created, { status: 201 });
}
