"use client";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  value: string;
  label: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean | null;
  color?: string;
};

export function PublicKpi({ icon: Icon, value, label, sub, trend, trendUp, color = "bg-[#0B57D0]" }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/[0.06] flex flex-col gap-3 hover:shadow-md transition-shadow group cursor-default">
      <div className="flex items-center justify-between">
        <div className={`${color} h-9 w-9 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center text-[11px] font-semibold px-2 py-1 rounded-full ${
              trendUp === null ? "bg-[#F5F5F7] text-[#6E6E73]" : trendUp ? "bg-[#E6F4EA] text-[#137333]" : "bg-[#FCE8E6] text-[#B3261E]"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[22px] sm:text-[24px] font-bold leading-none text-[#1D1D1F] tracking-tight">{value}</p>
        <p className="text-[13px] text-[#1D1D1F] font-medium mt-1">{label}</p>
        {sub && <p className="text-[11px] text-[#86868B] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
