import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MetersClient } from "@/components/admin/meters-client";

export const dynamic = "force-dynamic";

export default async function MetersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const metersRaw = await prisma.meterReading.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  // Enrich with Subscriber ПІБ (окрема база) — якщо в reading fio==null, підтягуємо з subscribers + додаємо subscriberId для лінку на картку
  const accounts = [...new Set(metersRaw.map((m) => m.account))];
  const subs = accounts.length ? await prisma.subscriber.findMany({ where: { account: { in: accounts } } }) : [];
  const subMap = new Map(subs.map((s) => [s.account, s]));
  const meters = metersRaw.map((m: any) => {
    const sub: any = subMap.get(m.account);
    if (sub && !m.fio) return { ...m, fio: sub.fio, subscriberId: sub.id, address: m.address || sub.address, phone: m.phone || sub.phone };
    if (sub) return { ...m, subscriberId: sub.id };
    return m;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Показання лічильників</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{meters.length} записів • пошук по рахунку / ПІБ / адресі — показує ПІБ з бази Абоненти</p>
      </div>

      <MetersClient initial={meters as any} />
    </div>
  );
}
