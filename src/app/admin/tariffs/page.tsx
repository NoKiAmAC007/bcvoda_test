import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TariffsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const tariffs = await prisma.tariff.findMany({ orderBy: { validFrom: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Тарифи</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{tariffs.length} записів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати тариф</h3>
        <form action="/api/tariffs" method="post" className="space-y-4">
          <input name="title" placeholder="Назва тарифу" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" placeholder="Ціна (напр. 25.50)" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
            <input name="unit" placeholder="Одиниця (грн/м³)" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="category" defaultValue="water" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] bg-white">
              <option value="water">Водопостачання</option>
              <option value="sewage">Водовідведення</option>
            </select>
            <input name="validFrom" type="date" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          </div>
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі тарифи</h3>
        <div className="space-y-2">
          {tariffs.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                <Wallet className="h-4 w-4 text-[#6E6E73]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{t.title}</p>
                <p className="text-[11px] text-[#86868B]">{t.price} {t.unit} · {t.validFrom.toLocaleDateString("uk-UA")}</p>
              </div>
              <span className={t.category === "water" ? "text-[11px] px-2 py-1 rounded-full bg-[#E8F0FE] text-[#0B57D0] font-medium" : "text-[11px] px-2 py-1 rounded-full bg-[#FFF8E1] text-[#8D6E00] font-medium"}>
                {t.category === "water" ? "Вода" : "Стоки"}
              </span>
              <Link href={`/admin/tariffs/${t.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
              <DeleteForm action={`/api/tariffs/${t.id}`} />
            </div>
          ))}
          {!tariffs.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
