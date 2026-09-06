"use client";
import Link from "next/link";
import { Search, Droplets } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function AndroidTopBar() {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFBFE] border-b border-[#CAC4D0]">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <div className="flex-1 max-w-[560px] hidden lg:flex">
          <div className="flex-1 flex items-center gap-3 rounded-full bg-[#F3EDF7] px-4 h-12">
            <Search className="h-5 w-5 text-[#49454F]" />
            <input placeholder="Пошук по тарифах, якості, звітах" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#49454F]" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" className="lg:hidden h-10 w-10 rounded-full bg-[#F3EDF7] flex items-center justify-center">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="#lichylnyk" className="hidden lg:inline-flex m3-fab px-6 h-10 items-center text-sm">Передати</Link>
          <Link href={siteConfig.cabinets.personal} target="_blank" className="hidden lg:inline-flex rounded-full border border-[#CAC4D0] px-6 h-10 items-center text-sm font-medium">Кабінет</Link>
        </div>
      </div>
    </header>
  );
}
