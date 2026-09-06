import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { Files } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const documents = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Документи</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{documents.length} записів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати документ</h3>
        <form action="/api/documents" method="post" className="space-y-4">
          <input name="title" placeholder="Назва документа" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="fileUrl" placeholder="URL файлу (напр. /uploads/doc.pdf)" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <select name="category" defaultValue="other" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] bg-white">
            <option value="tariff">Тариф</option>
            <option value="report">Звіт</option>
            <option value="contract">Договір</option>
            <option value="other">Інше</option>
          </select>
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі документи</h3>
        <div className="space-y-2">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                <Files className="h-4 w-4 text-[#6E6E73]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{d.title}</p>
                <p className="text-[11px] text-[#86868B] truncate">{d.fileUrl}</p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] font-medium">{d.category}</span>
              <Link href={`/admin/documents/${d.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
              <DeleteForm action={`/api/documents/${d.id}`} />
            </div>
          ))}
          {!documents.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
