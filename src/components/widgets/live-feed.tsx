"use client";
import { useId } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type FeedItem = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: string | Date;
  _type: "Подія" | "Новина" | "Звіт";
  href: string;
  ts: number;
};

function toItems(list: any[], type: FeedItem["_type"], hrefPrefix: string): FeedItem[] {
  return (list || []).map((it) => ({
    slug: it.slug,
    title: it.title,
    excerpt: it.excerpt,
    publishedAt: it.publishedAt,
    _type: type,
    href: `${hrefPrefix}/${it.slug}`,
    ts: new Date(it.publishedAt).getTime() || 0,
  }));
}

function Cards({ items, empty }: { items: FeedItem[]; empty: string }) {
  if (!items.length) {
    return <p className="text-[13px] text-[#86868B] py-4 text-center">{empty}</p>;
  }
  return (
    <>
      {items.map((it) => (
        <Link key={`${it._type}-${it.slug}`} href={it.href} className="block rounded-xl bg-[#F5F5F7] border border-[#e7e0ec] shadow-[0_1px_3px_#00000014] p-4 hover:shadow-md transition-shadow">
          <p className="text-[11px] font-semibold tracking-wide uppercase text-[#86868B]">{it._type} • {formatDate(it.publishedAt)}</p>
          <p className="mt-1 text-[15px] font-semibold leading-tight">{it.title}</p>
          {it.excerpt && <p className="mt-1 text-[13px] text-[#6E6E73] break-words whitespace-normal [overflow-wrap:anywhere]">{it.excerpt}</p>}
        </Link>
      ))}
    </>
  );
}

export function LiveFeed({
  newsList = [],
  eventsList = [],
  reportsList = [],
  totalEvents,
  totalReports,
}: {
  newsList?: any[];
  eventsList?: any[];
  reportsList?: any[];
  totalEvents?: number;
  totalReports?: number;
}) {
  // useId без двокрапок — id використовуються в CSS-селекторах
  const uid = useId().replace(/:/g, "");
  const idAll = `feed-${uid}-all`;
  const idEvents = `feed-${uid}-events`;
  const idReports = `feed-${uid}-reports`;
  const name = `feed-${uid}-tab`;

  const events = toItems(eventsList, "Подія", "/events");
  const reports = toItems(reportsList, "Звіт", "/reports");

  // Списки цілком (скрол), лічильники — точні з БД
  const all = [...events, ...reports].sort((a, b) => b.ts - a.ts);
  const nEvents = totalEvents ?? events.length;
  const nReports = totalReports ?? reports.length;
  // У віджеті — по 2 найсвіжіші, решта за кнопками «Показати всі»
  const showAll = all.slice(0, 2);
  const showEvents = events.slice(0, 2);
  const showReports = reports.slice(0, 2);

  return (
    <div className="m3-card p-6">
      <style>{`
        .feed-panel { display: none; }
        #${idAll}:checked ~ .feed-panels .feed-panel-all,
        #${idEvents}:checked ~ .feed-panels .feed-panel-events,
        #${idReports}:checked ~ .feed-panels .feed-panel-reports { display: block; }
        .feed-tabs label { color: #6E6E73; }
        #${idAll}:checked ~ .feed-head label[for="${idAll}"],
        #${idEvents}:checked ~ .feed-head label[for="${idEvents}"],
        #${idReports}:checked ~ .feed-head label[for="${idReports}"] {
          background: #fff; color: #007AFF;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* нативні радіо — перемикання працює навіть без JS */}
      <input type="radio" name={name} id={idAll} defaultChecked className="hidden" />
      <input type="radio" name={name} id={idEvents} className="hidden" />
      <input type="radio" name={name} id={idReports} className="hidden" />

      <div className="feed-head flex justify-between items-center">
        <h3 className="text-[19px] font-semibold">Новини</h3>
        <div className="feed-tabs flex gap-1 bg-[#F5F5F7] rounded-full p-1">
          <label htmlFor={idAll} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer select-none">Все ({nEvents + nReports})</label>
          <label htmlFor={idEvents} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer select-none">Події ({nEvents})</label>
          <label htmlFor={idReports} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer select-none">Звіти ({nReports})</label>
        </div>
      </div>

      <div className="feed-panels mt-4 max-h-[420px] overflow-y-auto pr-1 space-y-3">
        <div className="feed-panel feed-panel-all space-y-3">
          <Cards items={showAll} empty="Немає записів — додай в адмінці /admin/events" />
          {!!all.length && (
            <div className="flex justify-end gap-2 pt-1">
              <Link href="/events" className="inline-flex items-center gap-1 rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-bold hover:bg-[#0842A0] transition-colors">
                Всі події →
              </Link>
              <Link href="/reports" className="inline-flex items-center gap-1 rounded-full border border-[#0B57D0]/25 bg-[#E3F2FD] text-[#0B57D0] px-4 py-1.5 text-[12px] font-bold hover:bg-[#BBDEFB] transition-colors">
                Всі звіти →
              </Link>
            </div>
          )}
        </div>
        <div className="feed-panel feed-panel-events space-y-3">
          <Cards items={showEvents} empty="Немає подій — додай в адмінці /admin/events" />
          {!!events.length && (
            <div className="flex justify-end pt-1">
              <Link href="/events" className="inline-flex items-center gap-1 rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-bold hover:bg-[#0842A0] transition-colors">
                Показати всі події →
              </Link>
            </div>
          )}
        </div>
        <div className="feed-panel feed-panel-reports space-y-3">
          <Cards items={showReports} empty="Немає звітів — додай в адмінці /admin/reports" />
          {!!reports.length && (
            <div className="flex justify-end pt-1">
              <Link href="/reports" className="inline-flex items-center gap-1 rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-bold hover:bg-[#0842A0] transition-colors">
                Показати всі звіти →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
