import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusChipCreateForm, StatusChipRow } from "@/components/admin/forms/status-chip-form";

export const dynamic = "force-dynamic";

export default async function StatusChipsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const chips = await prisma.statusChip.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Статус-чіпи</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{chips.length} чіпів • відображаються на головній під KPI (Тиск, Лабораторія, Аварія)</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold mb-4">Додати чіп</h3>
        <StatusChipCreateForm />
      </div>
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold mb-4">Всі чіпи</h3>
        <div className="space-y-2">
          {chips.map(c => <StatusChipRow key={c.id} c={c as any} />)}
          {!chips.length && <p className="text-[13px] text-[#86868B]">Немає чіпів — додай перший</p>}
        </div>
      </div>
    </div>
  );
}
