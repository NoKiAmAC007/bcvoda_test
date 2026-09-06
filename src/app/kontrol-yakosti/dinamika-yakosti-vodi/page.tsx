import Link from "next/link";
import { WaterQualityChart } from "@/components/water-quality-chart";

export const metadata = { title: "Динаміка якості води" };
export const dynamic = "force-dynamic";

const tabs = [
  { href: "/kontrol-yakosti", label: "Контроль якості" },
  { href: "/yakist-vodi-pitnoyi-vodi", label: "Питної води" },
  { href: "/yakist-stichnih-vod", label: "Стічних вод" },
  { href: "/yakist-vodi", label: "р. Рось" },
  { href: "/kontrol-yakosti/dinamika-yakosti-vodi", label: "Динаміка якості води", active: true },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <Link href="/kontrol-yakosti" className="hover:text-[#0B57D0]">Контроль якості</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Динаміка якості води</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Динаміка якості води</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${t.active ? "bg-[#0B57D0] text-white" : "bg-white border border-black/10 hover:bg-black/5"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <WaterQualityChart />
      </div>
    </div>
  );
}
