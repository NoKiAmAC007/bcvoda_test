import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { reportPublicUrl } from "@/lib/report-url";

export const metadata = { title: "Якість питної води" };
export const dynamic = "force-dynamic";

const tabs = [
  { href: "/kontrol-yakosti", label: "Контроль якості" },
  { href: "/yakist-vodi-pitnoyi-vodi", label: "Питної води", active: true },
  { href: "/yakist-stichnih-vod", label: "Стічних вод" },
  { href: "/yakist-vodi", label: "р. Рось" },
  { href: "/kontrol-yakosti/dinamika-yakosti-vodi", label: "Динаміка якості води" },
];
// Фолбек — файли в папці сайту (качає quality-daily щодня о 10:00)
const FALLBACK = [
  { title: "Звіт за серпень 2026 — РЧВ", url: "/reports/quality/pitna/Zvedeni-dani-serpen-RCHV.pdf" },
  { title: "Звіт за липень 2026 — РЧВ", url: "/reports/quality/pitna/Zvit-misyats-RCHV.pdf" },
  { title: "Звіт за червень 2026 — РЧВ", url: "/reports/quality/pitna/Zvedeni-misyats-RCHV.pdf" },
  { title: "Звіт за травень 2026 — РЧВ", url: "/reports/quality/pitna/Zvedeni-RCHV-01.05-31.05.26.pdf" },
  { title: "Звіт за квітень 2026 — РЧВ", url: "/reports/quality/pitna/Zvedeni-dani-RCHV-mis..pdf" },
];

export default async function Page() {
  let files = FALLBACK;
  try {
    const rows = await prisma.qualityReport.findMany({ where: { category: "pitna" }, orderBy: { order: "asc" }, take: 8 });
    if (rows.length) {
      files = rows.map((r) => ({ title: `Звіт за ${r.title.charAt(0).toLowerCase() + r.title.slice(1)} — РЧВ`, url: reportPublicUrl(r) }));
    }
  } catch {}
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <Link href="/kontrol-yakosti" className="hover:text-[#0B57D0]">Контроль якості</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Питної води</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Якість питної води</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${t.active ? "bg-[#0B57D0] text-white" : "bg-white border border-black/10 hover:bg-black/5"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Питної води</h2>
        <p className="mt-1 text-sm text-[#6E6E73]">Щомісячні звіти РЧВ та ПВВ — перевірено лабораторією. Переходи як на головній, інформація під низом.</p>
        <div className="mt-4 grid gap-3">
          {files.map((f) => (
            <a key={f.url} href={f.url} target="_blank" className="m3-card p-4 flex justify-between items-center hover:shadow-md">
              <span className="font-medium text-sm">{f.title}</span><span className="text-xs bg-[#0B57D0] text-white px-3 py-1 rounded-full">PDF →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
