import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { mockEvents } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Події — аварійні роботи" };

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({ orderBy: { publishedAt: "desc" } });
  } catch {}
  if (!events.length) {
    return (
      <PageLayout title="Події та аварійні роботи" breadcrumbs={[{ label: "Події" }]}>
        <p className="text-[13px] text-[#86868B] py-8 text-center">Немає подій — додай в адмінці <a href="/admin/events" className="text-[#0B57D0] underline">/admin/events</a></p>
      </PageLayout>
    );
  }
  return (
    <PageLayout title="Події та аварійні роботи" breadcrumbs={[{ label: "Події" }]}>
      <div className="not-prose grid gap-4">
        {events.map((e) => (
          <Link key={e.slug} href={`/events/${e.slug}`} className="rounded-2xl border border-[#e7e0ec] shadow-[0_1px_3px_#00000014] bg-white p-4 flex gap-4 hover:shadow-md transition-shadow">
            {e.image ? <img src={e.image} alt="" className="h-20 w-20 rounded-xl object-cover shrink-0" /> : <div className="h-20 w-20 rounded-xl bg-amber-100 shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">{formatDate(e.publishedAt)}</p>
              <h3 className="font-bold break-words whitespace-normal">{e.title}</h3>
              <p className="text-sm text-slate-600 break-words whitespace-normal [overflow-wrap:anywhere]">{e.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
