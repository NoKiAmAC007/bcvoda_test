import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { satisfaction, taste, tasteOther, smell, smellOther, turbidity, pressure, pressureOther, remarks, street, building, apartment, lastName, firstName, middleName, phone, email } = body;

  if (!satisfaction) return NextResponse.json({ error: "Вкажіть задоволеність" }, { status: 400 });

  const saved = await prisma.qualitySurvey.create({
    data: {
      satisfaction, taste, tasteOther, smell, smellOther, turbidity, pressure, pressureOther, remarks, street, building, apartment, lastName, firstName, middleName, phone, email,
    },
  });

  // Лог для адмінки — в проді тут відправка на office@bcvoda.com.ua
  console.log("[quality-survey]", saved.id, street, building, satisfaction);

  return NextResponse.json({ ok: true, id: saved.id });
}

export async function GET() {
  const list = await prisma.qualitySurvey.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json(list);
}
