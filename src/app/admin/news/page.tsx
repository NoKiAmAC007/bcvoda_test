import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { BulkDeleteButton } from "@/components/admin/bulk-delete-btn";
import { NewsCreateForm } from "@/components/admin/forms/news-form";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Новини</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{news.length} записів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати новину</h3>
        <p className="text-[12px] text-[#6E6E73] mb-4">Реалістичне створення: заголовок + slug + дата + фото (upload) + превʼю як на сайті • SF Pro / Material 3</p>
        <NewsCreateForm />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Всі новини</h3>
          {news.length > 0 && <BulkDeleteButton endpoint="/api/news" label="новин" />}
        </div>
        <div className="space-y-2">
          {news.map(n => (
            <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              {n.image ? <img src={n.image} alt="" className="h-10 w-14 rounded-lg object-cover border border-black/10 shrink-0" /> : <div className="h-10 w-14 rounded-lg bg-[#F5F5F7] border border-black/10 shrink-0 grid place-items-center text-[10px] text-[#86868B]">no img</div>}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium break-words whitespace-normal [overflow-wrap:anywhere]">{n.title}</p>
                <p className="text-[11px] text-[#86868B] break-words whitespace-normal [overflow-wrap:anywhere]">{n.excerpt || "—"} • {n.publishedAt?.toLocaleDateString("uk-UA")}</p>
              </div>
              <Link href={`/admin/news/${n.id}`} title="Редагувати" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#E8F0FE] hover:border-[#BFDBFE] hover:text-[#0B57D0] text-[#6E6E73] grid place-items-center transition-colors shrink-0">
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteForm action={`/api/news/${n.id}`} iconOnly />
            </div>
          ))}
          {!news.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
