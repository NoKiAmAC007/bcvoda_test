import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Галерея</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{items.length} зображень</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати зображення</h3>
        <form action="/api/gallery" method="post" className="space-y-4">
          <input name="title" placeholder="Назва (необов'язково)" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="imageUrl" placeholder="URL зображення (напр. /uploads/bcvoda/image.jpg)" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <p className="text-[11px] text-[#86868B]">Або завантажте файл через <code className="bg-[#F5F5F7] px-1 py-0.5 rounded">POST /api/upload</code> з полем <code className="bg-[#F5F5F7] px-1 py-0.5 rounded">file</code> та <code className="bg-[#F5F5F7] px-1 py-0.5 rounded">folder=bcvoda</code>, потім вставте отриманий url.</p>
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі зображення</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border border-black/[0.06] overflow-hidden bg-[#F5F5F7]">
              <div className="aspect-[16/10] bg-white flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.imageUrl} alt={it.title || ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-[13px] font-medium truncate">{it.title || "Без назви"}</p>
                <p className="text-[11px] text-[#86868B] truncate">{it.imageUrl}</p>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/gallery/${it.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
                  <DeleteForm action={`/api/gallery/${it.id}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {!items.length && <p className="text-[13px] text-[#86868B] mt-4">Немає записів</p>}
        {items.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-[13px] font-semibold text-[#1D1D1F]">Список (швидке видалення)</h4>
            {items.map((it) => (
              <div key={`list-${it.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
                <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0 overflow-hidden border border-black/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate">{it.title || "Без назви"}</p>
                  <p className="text-[11px] text-[#86868B] truncate">{it.imageUrl}</p>
                </div>
                <Link href={`/admin/gallery/${it.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
                <DeleteForm action={`/api/gallery/${it.id}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
