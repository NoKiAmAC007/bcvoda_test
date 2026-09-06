import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OutageCreateForm, OutageRow } from "@/components/admin/forms/outage-form";

export const dynamic = "force-dynamic";

export default async function OutagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const outages = await prisma.outage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Карта аварій</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{outages.length} маркерів • керує головною &quot;Карта аварій та робіт&quot; (повна ширина) • зміна статусу завершено/активна тут</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати аварію / роботу</h3>
        <OutageCreateForm />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі маркери ({outages.length})</h3>
        <div className="space-y-2">
          {outages.map(o => <OutageRow key={o.id} o={o as any} />)}
          {!outages.length && <p className="text-[13px] text-[#86868B]">Немає маркерів — додай перший</p>}
        </div>
        <p className="text-[11px] text-[#86868B] mt-4">Підказка: якщо робота завершена — зміни статус на &quot;Завершено&quot; (сірий) або видали маркер. Карта на головній оновлюється миттєво.</p>
      </div>
    </div>
  );
}
