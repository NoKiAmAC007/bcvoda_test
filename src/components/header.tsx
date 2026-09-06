"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Droplets, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/data";

const nav = [
  { href: "/aktualna-informatsiya", label: "Новини" },
  { label: "Послуги", children: [
    { href: "/tarifi", label: "Тарифи" },
    { href: "/povirka-lichilnikiv", label: "Лічильники" },
    { href: "/otrimannya-tehnichnih-umov", label: "Техумови" },
    { href: "/normi-spozhivannya-vodi", label: "Норми" },
  ]},
  { href: "/kontrol-yakosti", label: "Якість" },
  { href: "/pro-nas", label: "Компанія" },
  { href: "/zviti", label: "Звіти" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  return (
    <header className="sticky top-0 z-50 apple-glass">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="flex h-11 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-[#007AFF] flex items-center justify-center text-white">
              <Droplets className="h-4 w-4" />
            </span>
            <span className="text-[19px] font-semibold tracking-tight text-[#1D1D1F]">БілоцерківВода</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((item: any) =>
              item.children ? (
                <div key={item.label} className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                  <button className="text-[12px] font-normal tracking-[-0.01em] text-[#1D1D1F]/80 hover:text-[#007AFF] flex items-center gap-1">
                    {item.label} <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                  {drop && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-7 w-[420px] apple-glass rounded-2xl p-2 shadow-[0_8px_40px_rgba(0,0,0,0.12)] grid grid-cols-2 gap-1">
                      {item.children.map((c: any) => (
                        <Link key={c.href} href={c.href} className="rounded-xl px-3 py-2.5 hover:bg-black/[0.04]">
                          <span className="block text-[13px] font-medium">{c.label}</span>
                          <span className="block text-[11px] text-black/40">Відкрити</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="text-[12px] font-normal tracking-[-0.01em] text-[#1D1D1F]/80 hover:text-[#007AFF]">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="#lichylnyk" className="btn-apple px-4 py-1.5 text-xs">Передати</Link>
            <Link href={siteConfig.cabinets.personal} target="_blank" className="text-[12px] text-[#007AFF] hover:underline">Кабінет</Link>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden h-8 w-8 flex items-center justify-center">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/10 bg-white">
          <div className="px-6 py-4 space-y-1">
            {nav.flatMap((n: any) => n.children ? n.children : [n]).map((l: any) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2.5 text-[17px] font-normal border-b border-black/5 last:border-0">
                {l.label}
              </Link>
            ))}
            <Link href="#lichylnyk" className="mt-3 block text-center btn-apple py-3">Передати показники</Link>
          </div>
        </div>
      )}
    </header>
  );
}
