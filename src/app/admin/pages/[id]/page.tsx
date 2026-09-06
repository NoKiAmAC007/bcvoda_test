import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати сторінку</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{page.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <form action={`/api/pages/${page.id}`} method="post" className="space-y-4">
          <input name="slug" defaultValue={page.slug} placeholder="slug" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="title" defaultValue={page.title} placeholder="Заголовок" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <textarea name="content" defaultValue={page.content} placeholder="Текст" rows={10} className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Зберегти</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/pages/${page.id}`} />
      </div>
    </div>
  );
}
