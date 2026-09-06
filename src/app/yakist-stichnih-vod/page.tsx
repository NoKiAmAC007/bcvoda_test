import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { reportPublicUrl } from "@/lib/report-url";

export const metadata = { title: "Якість стічних вод" };
export const dynamic = "force-dynamic";

const tabs = [
  { href: "/kontrol-yakosti", label: "Контроль якості" },
  { href: "/yakist-vodi-pitnoyi-vodi", label: "Питної води" },
  { href: "/yakist-stichnih-vod", label: "Стічних вод", active: true },
  { href: "/yakist-vodi", label: "р. Рось" },
  { href: "/kontrol-yakosti/dinamika-yakosti-vodi", label: "Динаміка якості води" },
];

// Фолбек — файли в папці сайту (качає quality-daily щодня о 10:00)
const FALLBACK = [
  { title: "Звіт по КОС за серпень 2026", url: "/reports/quality/kos/Zvit-po-KOS-za-serpen-2026.pdf" },
  { title: "Звіт по КОС за липень 2026", url: "/reports/quality/kos/Zvit-po-KOS-za-lipen-2026.pdf" },
  { title: "Звіт по КОС за червень 2026", url: "/reports/quality/kos/Zvit-po-KOS-za-cherven-2026.pdf" },
];

export default async function Page() {
  let files = FALLBACK;
  try {
    const rows = await prisma.qualityReport.findMany({ where: { category: "kos" }, orderBy: { order: "asc" }, take: 8 });
    if (rows.length) {
      files = rows.map((r) => ({ title: `Звіт по КОС за ${r.title.charAt(0).toLowerCase() + r.title.slice(1)}`, url: reportPublicUrl(r) }));
    }
  } catch {}
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5"><Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <Link href="/kontrol-yakosti" className="hover:text-[#0B57D0]">Контроль якості</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Стічних вод</span></nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Якість стічних вод</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${t.active ? "bg-[#0B57D0] text-white" : "bg-white border border-black/10 hover:bg-black/5"}`}>{t.label}</Link>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Стічних вод</h2>
        <p className="mt-1 text-sm text-[#6E6E73]">Контроль на випуску в р. Рось по КОС.</p>
        <div className="mt-4 grid gap-3">
          {files.map((f) => (
            <a key={f.url} href={f.url} target="_blank" className="m3-card p-4 flex justify-between items-center"><span className="font-medium text-sm">{f.title}</span><span className="text-xs bg-[#0B57D0] text-white px-3 py-1 rounded-full">PDF →</span></a>
          ))}
        </div>
      </div>
    </div>
  );
}
