import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, MapPin, Phone, Calendar, Gauge } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscriberDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const sub = await prisma.subscriber.findUnique({ where: { id } });
  if (!sub) notFound();

  const readings = await prisma.meterReading.findMany({ where: { account: sub.account }, orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/subscribers" className="h-9 w-9 rounded-full bg-white border border-black/10 grid place-items-center hover:bg-black/5">
          ←
        </Link>
        <div>
          <h1 className="text-[24px] font-bold text-[#1D1D1F]">Картка абонента</h1>
          <p className="text-[13px] text-[#6E6E73] mt-0.5">Рахунок {sub.account} • {sub.fio}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#0B57D0] text-white grid place-items-center font-bold text-[16px] shrink-0">
            {sub.account.slice(0,2)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-bold text-[#1D1D1F] flex items-center gap-2">
              <User className="h-5 w-5 text-[#0B57D0]" />
              {sub.fio}
            </h3>
            <p className="text-[13px] text-[#6E6E73] mt-1 break-words">
              {sub.lastName} • {sub.firstName} {sub.middleName || ""} • Рахунок: <span className="font-mono font-semibold text-[#1D1D1F]">{sub.account}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
              {sub.address && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F7] border border-black/10 px-3 py-1"><MapPin className="h-4 w-4" />{sub.address}</span>}
              {sub.phone && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F7] border border-black/10 px-3 py-1"><Phone className="h-4 w-4" />{sub.phone}</span>}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0FE] border border-[#BFDBFE] px-3 py-1 text-[#0B57D0]"><Calendar className="h-4 w-4" />{new Date(sub.createdAt).toLocaleDateString("uk-UA")}</span>
            </div>
          </div>
          <Link href="/admin/subscribers" className="hidden sm:inline-flex rounded-full border border-black/10 px-5 py-2 text-[13px] font-semibold hover:bg-black/5">
            До списку
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] flex items-center gap-2">
          <Gauge className="h-5 w-5 text-[#0B57D0]" />
          Показання по рахунку {sub.account} — {readings.length}
        </h3>
        <div className="mt-4 space-y-2">
          {readings.length ? readings.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] border border-black/5">
              <span className="text-[13px] font-mono">{r.prev} → {r.curr} <span className="font-bold">+{r.diff} м³</span></span>
              <span className="text-[11px] text-[#86868B]">{r.period || "—"} • {new Date(r.createdAt).toLocaleDateString("uk-UA")} {new Date(r.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</span>
              <span className="ml-auto text-[11px] font-mono text-[#6E6E73]">{r.id.slice(0,8)}</span>
            </div>
          )) : <p className="text-[13px] text-[#86868B] py-4 text-center">Немає показників для цього рахунку</p>}
        </div>
      </div>
    </div>
  );
}
