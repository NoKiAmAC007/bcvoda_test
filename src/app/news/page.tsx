import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { mockNews } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Новини" };

export default async function NewsPage() {
  let news: any[] = [];
  try {
    news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  } catch {}
  if (!news.length) {
    return (
      <PageLayout title="Новини" breadcrumbs={[{ label: "Новини" }]}>
        <p className="text-[13px] text-[#86868B] py-8 text-center">Немає новин — додай в адмінці <a href="/admin/news" className="text-[#0B57D0] underline">/admin/news</a></p>
      </PageLayout>
    );
  }
  return (
    <PageLayout title="Новини" breadcrumbs={[{ label: "Новини" }]}>
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {news.map((n) => (
          <Link key={n.slug} href={`/news/${n.slug}`} className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm bg-white">
            {n.image ? <img src={n.image} alt="" className="h-40 w-full object-cover" /> : <div className="h-40 bg-slate-100" />}
            <div className="p-4">
              <p className="text-xs text-slate-500">{formatDate(n.publishedAt)}</p>
              <h3 className="font-bold mt-1 break-words whitespace-normal">{n.title}</h3>
              {n.excerpt && <p className="text-sm text-slate-600 mt-1 break-words whitespace-normal [overflow-wrap:anywhere]">{n.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
