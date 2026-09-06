import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";
import { NewsEditForm } from "@/components/admin/forms/news-form";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати новину</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{news.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[13px] font-semibold text-[#1D1D1F] mb-4">Редагування — з фото та датою (реалістично)</h3>
        <NewsEditForm initial={{ id: news.id, title: news.title, slug: news.slug, excerpt: news.excerpt, content: news.content, image: news.image, publishedAt: news.publishedAt.toISOString() }} />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/news/${news.id}`} />
      </div>
    </div>
  );
}
