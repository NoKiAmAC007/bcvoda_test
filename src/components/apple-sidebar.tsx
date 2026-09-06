"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Droplets, Menu, X, Home, Newspaper, Calendar, Wallet, Gauge, Layers, FileText, FlaskConical, Building2, BarChart3, User } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

// Компактний редизайн — менший, легший
const nav = [
  { href: "/", label: "Головна", icon: Home },
  { href: "/events", label: "Події", icon: Calendar },
  { href: "/tarifi", label: "Тарифи", icon: Wallet },
  { href: "/kontrol-yakosti", label: "Якість", icon: FlaskConical },
  { href: "/pro-nas", label: "Про нас", icon: Building2 },
  { href: "/zviti", label: "Звіти", icon: BarChart3 },
];

const sub = [
  { href: "/povirka-lichilnikiv", label: "Лічильники", icon: Gauge },
  { href: "/otrimannya-tehnichnih-umov", label: "Техумови", icon: Layers },
  { href: "/normi-spozhivannya-vodi", label: "Норми", icon: FileText },
];

export function AppleSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-3 left-3 z-40 h-9 w-9 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-sm"
        aria-label="Меню"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setOpen(false)} />}

      <aside className={cn("fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-black/[0.06] z-40 flex flex-col transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="h-20 flex items-center px-2 border-b border-black/[0.06] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/bcvoda/logo.png" alt="БілоцерківВода" className="w-full h-auto max-h-16 object-contain object-left" />
        </div>

        <div className="flex-1 overflow-auto py-3 px-2">
          <nav className="space-y-0.5">
            {nav.map((it) => {
              const active = pathname === it.href;
              return (
                <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-2.5 rounded-xl px-3 h-9 text-[13px] font-semibold", active ? "bg-[#E8DEF8] text-[#1D192B]" : "text-[#1C1B1F] hover:bg-[#F3EDF7]")}>
                  <it.icon className="h-[18px] w-[18px] opacity-80" /> {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5">
            <p className="px-3 text-[11px] font-semibold tracking-widest uppercase text-[#86868B]">Послуги</p>
            <div className="mt-1.5 space-y-0.5">
              {sub.map((it) => (
                <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-2.5 rounded-xl px-3 h-8 text-[13px] font-semibold", pathname === it.href ? "bg-[#E8DEF8]" : "hover:bg-[#F3EDF7] text-[#1C1B1F]")}>
                  <it.icon className="h-[18px] w-[18px] opacity-70" /> {it.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-black/[0.06] space-y-3">
          {/* Кабінети */}
          <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #0B57D0 0%, #6750A4 100%)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center"><User className="h-4 w-4 text-white" /></span>
              <p className="text-[13px] font-bold tracking-tight">Особистий кабінет</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href="http://my.bcvoda.com.ua/" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white text-[#0B57D0] text-center py-2 text-[12px] font-semibold hover:bg-white/90 transition">Фіз. особи</a>
              <a href="http://cabinet.bcvoda.com.ua" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/20 text-white border border-white/20 text-center py-2 text-[12px] font-semibold hover:bg-white/30 transition">Юр. особи</a>
            </div>
            <p className="mt-2 text-[10px] text-white/70 text-center">my.bcvoda.com.ua • cabinet.bcvoda.com.ua</p>
          </div>

          <div className="rounded-2xl bg-[#F5F5F7] p-3">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-[#49454F]">Аварійна служба</p>
            <p className="text-[20px] font-bold tracking-tight mt-1">{siteConfig.contacts.emergency}</p>
            <p className="text-[11px] text-[#6E6E73]">{siteConfig.contacts.callCenter} • цілодобово</p>
            <Link href="tel:301111" className="mt-2.5 block text-center bg-[#0B57D0] text-white rounded-full py-2 text-[13px] font-semibold hover:bg-[#0842A0]">Зателефонувати</Link>
          </div>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-black/10 flex items-center justify-around px-1 z-40">
        {nav.slice(0, 4).map((it) => {
          const active = pathname === it.href;
          return (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className={cn("flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl", active ? "text-[#0B57D0]" : "text-[#49454F]")}>
              <span className={cn("h-7 w-12 flex items-center justify-center rounded-full", active ? "bg-[#E8DEF8]" : "")}><it.icon className="h-[18px] w-[18px]" /></span>
              <span className="text-[11px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
