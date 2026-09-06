import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { mockNews, mockEvents, services } from "@/lib/data";

export const metadata = { title: "Пошук" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").toLowerCase();
  const results = query
    ? [
        ...mockNews.filter((n) => n.title.toLowerCase().includes(query)).map((n) => ({ href: `/news/${n.slug}`, title: n.title, type: "Новина" })),
        ...mockEvents.filter((n) => n.title.toLowerCase().includes(query)).map((n) => ({ href: `/events/${n.slug}`, title: n.title, type: "Подія" })),
        ...services.filter((s) => s.title.toLowerCase().includes(query)).map((s) => ({ href: `/${s.slug}`, title: s.title, type: "Послуга" })),
      ]
    : [];

  return (
    <PageLayout title="Пошук по сайту" breadcrumbs={[{ label: "Пошук" }]}>
      <form className="not-prose flex gap-2">
        <input name="q" defaultValue={q} placeholder="Наприклад, тарифи, повірка..." className="flex-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="rounded-full bg-cyan-700 text-white px-6 py-2.5 text-sm font-semibold">Шукати</button>
      </form>

      {query && (
        <div className="not-prose mt-6">
          <p className="text-sm text-slate-500">Знайдено: {results.length} — запит «{q}»</p>
          <div className="mt-3 grid gap-2">
            {results.length ? results.map((r) => (
              <Link key={r.href} href={r.href} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 flex justify-between">
                <span className="font-medium text-sm">{r.title}</span>
                <span className="text-xs text-slate-500">{r.type}</span>
              </Link>
            )) : <p className="text-sm text-slate-500">Нічого не знайдено. Спробуйте інший запит.</p>}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
