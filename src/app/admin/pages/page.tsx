import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Сторінки</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{pages.length} записів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати сторінку</h3>
        <form action="/api/pages" method="post" className="space-y-4">
          <input name="slug" placeholder="slug (напр. about)" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="title" placeholder="Заголовок" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <textarea name="content" placeholder="Текст" rows={10} className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі сторінки</h3>
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-[#6E6E73]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{p.title}</p>
                <p className="text-[11px] text-[#86868B]">/{p.slug}</p>
              </div>
              <Link href={`/admin/pages/${p.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
              <DeleteForm action={`/api/pages/${p.id}`} />
            </div>
          ))}
          {!pages.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
