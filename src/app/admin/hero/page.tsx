import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Слайдер</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{slides.length} слайдів · сортування за полем order</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати слайд</h3>
        <form action="/api/hero" method="post" className="space-y-4">
          <input name="title" placeholder="Заголовок" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="imageUrl" placeholder="URL зображення" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="link" placeholder="Посилання (необов'язково)" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="order" type="number" placeholder="Порядок (0, 1, 2…)" defaultValue={slides.length} className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі слайди</h3>
        <div className="space-y-2">
          {slides.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="h-12 w-20 rounded-xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="h-7 w-7 rounded-full bg-[#E8F0FE] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-[#0B57D0]">{s.order}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{s.title}</p>
                <p className="text-[11px] text-[#86868B] truncate">{s.link || s.imageUrl}</p>
              </div>
              <Link href={`/admin/hero/${s.id}`} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</Link>
              <DeleteForm action={`/api/hero/${s.id}`} />
            </div>
          ))}
          {!slides.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
