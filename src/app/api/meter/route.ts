import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/meter — як на офіційному my.bcvoda.com.ua — активний лише 28—5 число
export async function POST(req: Request) {
  const day = new Date().getDate();
  const isActive = day >= 28 || day <= 5;
  if (!isActive) {
    return NextResponse.json({ error: "Прийом показників лише з 28 по 5 число (як на офіційному сайті). Сьогодні прийом закрито." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const account = String(body.account || "").trim();
  const prev = Number(body.prev);
  const curr = Number(body.curr);
  const fio = body.fio ? String(body.fio).trim() : null;
  const address = body.address ? String(body.address).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;

  // Валідація як на офіційному
  if (!/^\d{5,10}$/.test(account)) {
    return NextResponse.json({ error: "Особовий рахунок має містити 5–10 цифр" }, { status: 400 });
  }
  if (!Number.isFinite(curr) || curr < 0) {
    return NextResponse.json({ error: "Вкажіть коректне 'Стало'" }, { status: 400 });
  }
  if (Number.isFinite(prev) && prev > curr) {
    return NextResponse.json({ error: "'Стало' має бути ≥ 'Було'" }, { status: 400 });
  }
  const diff = Number.isFinite(prev) ? curr - prev : curr;
  if (diff > 100) {
    return NextResponse.json({ error: "Споживання >100 м³ — перевірте показники" }, { status: 400 });
  }

  // Період — наступний місяць як на офіційному (28-5 вікно)
  const now = new Date();
  const billing = new Date(now.getFullYear(), now.getMonth(), 1);
  if (now.getDate() >= 28) billing.setMonth(billing.getMonth() + 1);
  const period = `${billing.getFullYear()}-${String(billing.getMonth() + 1).padStart(2, "0")}`;
  const periodLabel = billing.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });

  // Спроба проксі на офіційний кабінет (якщо доступний) — не блокуємо успіх
  let forwarded = false;
  try {
    const r = await fetch("http://my.bcvoda.com.ua/api/meter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account, prev, curr }),
      signal: AbortSignal.timeout(2000),
    });
    forwarded = r.ok;
  } catch {}

  // Якщо ПІБ не передано — підтягуємо з окремої бази Абоненти по рахунку
  let fioToSave: string | null = fio;
  let addressToSave: string | null = address;
  let phoneToSave: string | null = phone;
  if (!fioToSave || !addressToSave) {
    const sub = await prisma.subscriber.findUnique({ where: { account } });
    if (sub) {
      if (!fioToSave) fioToSave = sub.fio;
      if (!addressToSave && sub.address) addressToSave = sub.address;
      if (!phoneToSave && sub.phone) phoneToSave = sub.phone;
    }
  }
  // Зберігаємо локально з періодом наступного місяця
  const saved = await prisma.meterReading.create({ data: { account, prev: Number.isFinite(prev) ? prev : 0, curr, diff, period, ...(fioToSave && { fio: fioToSave }), ...(addressToSave && { address: addressToSave }), ...(phoneToSave && { phone: phoneToSave }) } });

  return NextResponse.json({
    ok: true,
    id: saved.id,
    diff,
    period: periodLabel,
    periodRaw: period,
    fio: saved.fio,
    account: saved.account,
    message: forwarded ? `Показники прийнято на ${periodLabel} та передано в кабінет` : `Показники прийнято на ${periodLabel}`,
    forwarded,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const take = Number(searchParams.get("take") || 50);
  const limit = Math.min(take, 200);
  let list: any[];
  if (q) {
    // also search subscribers for fio match
    const subs = await prisma.subscriber.findMany({
      where: { OR: [{ account: { contains: q } }, { fio: { contains: q } }, { lastName: { contains: q } }] },
      select: { account: true },
      take: 20,
    });
    const subAccounts = subs.map(s => s.account);
    list = await prisma.meterReading.findMany({
      where: {
        OR: [
          { account: { contains: q } },
          { fio: { contains: q } },
          { address: { contains: q } },
          ...(subAccounts.length ? [{ account: { in: subAccounts } } as any] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } else {
    list = await prisma.meterReading.findMany({ orderBy: { createdAt: "desc" }, take: limit });
  }
  // enrich with subscriber fio if missing + add subscriberId for link to card
  const accounts = [...new Set(list.map((r: any) => r.account))];
  const subs = await prisma.subscriber.findMany({ where: { account: { in: accounts } } });
  const subMap = new Map(subs.map(s => [s.account, s]));
  const enriched = list.map((r: any) => {
    const sub: any = subMap.get(r.account);
    if (sub && !r.fio) return { ...r, fio: sub.fio, subscriberId: sub.id, subscriberAddress: sub.address, subscriberPhone: sub.phone };
    if (sub) return { ...r, subscriberId: sub.id, subscriberFio: sub.fio };
    return r;
  });
  return NextResponse.json(enriched);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.meterReading.deleteMany({});
  return NextResponse.json({ ok: true });
}
