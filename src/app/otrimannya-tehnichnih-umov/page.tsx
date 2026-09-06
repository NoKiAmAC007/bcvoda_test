import Link from "next/link";
import { ServiceRequestForm } from "@/components/service-request-form";
import { FileCheck } from "lucide-react";

export const metadata = { title: "Отримання технічних умов" };
export const dynamic = "force-dynamic";

const docs = [
  "Заява",
  "Копія паспорта та ІПН",
  "Документи на ділянку",
  "Ситуаційний план",
];

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Отримання технічних умов</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Отримання технічних умов</h1>

      <div className="mt-6 m3-card p-6 lg:p-8">
        <h2 className="text-[15px] font-bold text-[#1D1D1F] flex items-center gap-2">
          <span className="h-9 w-9 rounded-2xl bg-[#E3F2FD] text-[#0B57D0] grid place-items-center shrink-0">
            <FileCheck className="h-4.5 w-4.5" />
          </span>
          Перелік документів
        </h2>
        <ol className="mt-4 grid gap-2.5">
          {docs.map((d, i) => (
            <li key={d} className="flex items-center gap-3 rounded-2xl bg-[#F5F5F7] px-4 py-3 shadow-[0_1px_3px_#00000014]">
              <span className="h-7 w-7 rounded-full bg-[#0B57D0] text-white text-[13px] font-bold grid place-items-center shrink-0">
                {i + 1}
              </span>
              <span className="text-[14px] font-medium text-[#1D1D1F]">{d}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        <ServiceRequestForm defaultType="tech" />
      </div>
    </div>
  );
}
