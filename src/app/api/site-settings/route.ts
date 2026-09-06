import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "main" } });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const {
    emergency, general, callCenter, address, director, email,
    youtube, facebook, cabinetPersonal, cabinetLegal, cabinetMap
  } = body;
  const data: any = {};
  if (emergency !== undefined) data.emergency = String(emergency);
  if (general !== undefined) data.general = String(general);
  if (callCenter !== undefined) data.callCenter = String(callCenter);
  if (address !== undefined) data.address = String(address);
  if (director !== undefined) data.director = String(director);
  if (email !== undefined) data.email = String(email);
  if (youtube !== undefined) data.youtube = youtube ? String(youtube) : null;
  if (facebook !== undefined) data.facebook = facebook ? String(facebook) : null;
  if (cabinetPersonal !== undefined) data.cabinetPersonal = cabinetPersonal ? String(cabinetPersonal) : null;
  if (cabinetLegal !== undefined) data.cabinetLegal = cabinetLegal ? String(cabinetLegal) : null;
  if (cabinetMap !== undefined) data.cabinetMap = cabinetMap ? String(cabinetMap) : null;

  const updated = await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data,
  });
  return NextResponse.json(updated);
}
