import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";

export const dynamic = "force-dynamic";

export default async function EditHeroPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати слайд</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{slide.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        {slide.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-black/[0.06] max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-auto object-cover" />
          </div>
        )}
        <form action={`/api/hero/${slide.id}`} method="post" className="space-y-4">
          <input name="title" defaultValue={slide.title} placeholder="Заголовок" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="imageUrl" defaultValue={slide.imageUrl} placeholder="URL зображення" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="link" defaultValue={slide.link || ""} placeholder="Посилання" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="order" type="number" defaultValue={slide.order} placeholder="Порядок" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Зберегти</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/hero/${slide.id}`} />
      </div>
    </div>
  );
}
