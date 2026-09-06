import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { account, lastName, firstName, middleName, address, phone } = body;
  const data: any = {};
  if (account !== undefined) data.account = String(account).trim();
  if (lastName !== undefined) data.lastName = String(lastName).trim();
  if (firstName !== undefined) data.firstName = String(firstName).trim();
  if (middleName !== undefined) data.middleName = middleName ? String(middleName).trim() : null;
  if (address !== undefined) data.address = address ? String(address).trim() : null;
  if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
  if (lastName !== undefined || firstName !== undefined || middleName !== undefined) {
    const cur = await prisma.subscriber.findUnique({ where: { id } });
    const ln = lastName !== undefined ? String(lastName).trim() : cur?.lastName || "";
    const fn = firstName !== undefined ? String(firstName).trim() : cur?.firstName || "";
    const mn = middleName !== undefined ? (middleName ? String(middleName).trim() : "") : cur?.middleName || "";
    data.fio = [ln, fn, mn].filter(Boolean).join(" ").trim();
  }
  const updated = await prisma.subscriber.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
