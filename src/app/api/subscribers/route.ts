import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const where = q
    ? {
        OR: [
          { account: { contains: q } },
          { fio: { contains: q } },
          { lastName: { contains: q } },
          { firstName: { contains: q } },
        ],
      }
    : undefined;
  const data = await prisma.subscriber.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { account, lastName, firstName, middleName, address, phone } = body;
  if (!account || !lastName || !firstName) return NextResponse.json({ error: "account, lastName, firstName required" }, { status: 400 });
  const fio = [lastName, firstName, middleName].filter(Boolean).join(" ").trim();
  const created = await prisma.subscriber.create({
    data: {
      account: String(account).trim(),
      lastName: String(lastName).trim(),
      firstName: String(firstName).trim(),
      middleName: middleName ? String(middleName).trim() : null,
      fio,
      address: address ? String(address).trim() : null,
      phone: phone ? String(phone).trim() : null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
