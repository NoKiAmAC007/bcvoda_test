import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { mockReports } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Звіти" };

export default async function ZvitiPage() {
  let reports: any[] = [];
  try {
    reports = await prisma.report.findMany({ orderBy: { publishedAt: "desc" } });
  } catch {}
  if (!reports.length) {
    return (
      <PageLayout title="Звіти" breadcrumbs={[{ label: "Звіти" }]}>
        <p className="text-[13px] text-[#86868B] py-8 text-center">Немає звітів — додай в адмінці <a href="/admin/reports" className="text-[#0B57D0] underline">/admin/reports</a></p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Звіти" breadcrumbs={[{ label: "Звіти" }]}>
      <div className="not-prose grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {reports.map((r) => (
          <Link key={r.slug} href={`/reports/${r.slug}`} className="aspect-square rounded-xl border border-black/10 bg-white p-3 flex flex-col items-center justify-center text-center hover:shadow-sm hover:-translate-y-0.5 transition-all">
            <span className="font-semibold text-xs leading-tight line-clamp-3">{r.title}</span>
            <span className="mt-1.5 text-[11px] text-white bg-[#0B57D0] px-2.5 py-1 rounded-full">{formatDate(r.publishedAt)}</span>
          </Link>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4 text-center">Квадратики автоматично підлаштовуються під назву • керується в адмінці → Звіти</p>
    </PageLayout>
  );
}
