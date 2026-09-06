import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { FileText, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";

export const metadata = { title: "Звіти" };
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
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

  const [latest, ...rest] = reports;
  const years = [...new Set(rest.map((r) => new Date(r.publishedAt).getFullYear()))].sort((a, b) => b - a);

  return (
    <PageLayout title="Звіти" breadcrumbs={[{ label: "Звіти" }]}>
      <div className="not-prose">
        {/* Найсвіжіший звіт — hero */}
        <Link
          href={`/reports/${latest.slug}`}
          className="group relative block overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B57D0] to-[#084298] text-white p-6 sm:p-8 shadow-[0_1px_3px_#00000014] hover:shadow-lg transition-shadow"
        >
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-4 -bottom-16 h-32 w-32 rounded-full bg-white/5 blur-xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide uppercase">
                <FileText className="h-3 w-3" /> Найсвіжіший звіт
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-white/80">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(latest.publishedAt)}
              </span>
            </div>
            <h2 className="mt-3 text-[20px] sm:text-[26px] font-bold leading-tight tracking-tight max-w-[640px]">
              {latest.title}
            </h2>
            {latest.excerpt && (
              <p className="mt-2 text-[13px] sm:text-[14px] text-white/80 leading-relaxed max-w-[560px] line-clamp-2">
                {latest.excerpt}
              </p>
            )}
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-[#0B57D0] px-5 py-2.5 text-[13px] font-bold group-hover:gap-3 transition-all">
              Читати звіт <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Решта — групами за роками */}
        {years.map((y) => (
          <div key={y} className="mt-8">
            <div className="flex items-center gap-3">
              <h3 className="text-[15px] font-bold text-[#1D1D1F]">{y}</h3>
              <span className="text-[11px] font-semibold text-[#86868B] bg-black/[0.05] px-2 py-0.5 rounded-full">
                {rest.filter((r) => new Date(r.publishedAt).getFullYear() === y).length}
              </span>
              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>
            <div className="mt-3 grid gap-2.5">
              {rest
                .filter((r) => new Date(r.publishedAt).getFullYear() === y)
                .map((r) => (
                  <Link
                    key={r.slug}
                    href={`/reports/${r.slug}`}
                    className="group m3-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <span className="h-11 w-11 rounded-2xl bg-[#E3F2FD] text-[#0B57D0] grid place-items-center shrink-0 group-hover:bg-[#0B57D0] group-hover:text-white transition-colors">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-semibold text-[#1D1D1F] leading-snug line-clamp-2 group-hover:text-[#0B57D0] transition-colors">
                        {r.title}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[#86868B]">{formatDate(r.publishedAt)}</span>
                    </span>
                    <span className="h-9 w-9 rounded-full border border-black/10 grid place-items-center shrink-0 text-[#6E6E73] group-hover:bg-[#0B57D0] group-hover:border-[#0B57D0] group-hover:text-white transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
