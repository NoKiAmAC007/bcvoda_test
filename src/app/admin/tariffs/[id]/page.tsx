import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";

export const dynamic = "force-dynamic";

export default async function EditTariffPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const tariff = await prisma.tariff.findUnique({ where: { id } });
  if (!tariff) notFound();

  const validFromValue = tariff.validFrom ? new Date(tariff.validFrom).toISOString().slice(0, 10) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати тариф</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{tariff.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <form action={`/api/tariffs/${tariff.id}`} method="post" className="space-y-4">
          <input name="title" defaultValue={tariff.title} placeholder="Назва тарифу" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" defaultValue={tariff.price} placeholder="Ціна" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
            <input name="unit" defaultValue={tariff.unit} placeholder="Одиниця" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="category" defaultValue={tariff.category} className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] bg-white">
              <option value="water">Водопостачання</option>
              <option value="sewage">Водовідведення</option>
            </select>
            <input name="validFrom" type="date" defaultValue={validFromValue} className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          </div>
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Зберегти</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/tariffs/${tariff.id}`} />
      </div>
    </div>
  );
}
