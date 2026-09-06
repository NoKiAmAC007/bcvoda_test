import Link from "next/link";
import { Droplets } from "lucide-react";

export const metadata = { title: "Норми споживання води" };
export const dynamic = "force-dynamic";

const norms = [
  { category: "З ваннами та газовими нагрівачами", value: "5.4" },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Норми споживання води</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Норми споживання води</h1>
      <p className="mt-1 text-sm text-[#6E6E73]">Норми для споживачів без лічильника.</p>

      <div className="mt-6 m3-card p-6 lg:p-8">
        <h2 className="text-[15px] font-bold text-[#1D1D1F] flex items-center gap-2">
          <span className="h-9 w-9 rounded-2xl bg-[#E3F2FD] text-[#0B57D0] grid place-items-center shrink-0">
            <Droplets className="h-4 w-4" />
          </span>
          Нормативна таблиця
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F7]">
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#49454F]">Категорія</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#49454F] whitespace-nowrap">Норма, м³/міс</th>
              </tr>
            </thead>
            <tbody>
              {norms.map((n) => (
                <tr key={n.category} className="border-t border-black/[0.06] hover:bg-[#F8FAFF] transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[#1D1D1F]">{n.category}</td>
                  <td className="px-4 py-3.5 text-right text-[18px] font-bold text-[#0B57D0] whitespace-nowrap">{n.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-[#86868B]">На одну особу на місяць • за відсутності приладу обліку</p>
      </div>
    </div>
  );
}
