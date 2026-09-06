"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Newspaper, Calendar, FileText, Droplets, LogOut, Menu, X, Wallet, Files, ImageIcon, Images, Users, Gauge, ClipboardList, Settings, MapPin, FlaskConical, Tag, Contact } from "lucide-react";

const sidebarNav = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/news", label: "Новини", icon: Newspaper },
  { href: "/admin/events", label: "Події", icon: Calendar },
  { href: "/admin/reports", label: "Звіти", icon: FileText },
  { href: "/admin/outages", label: "Карта аварій", icon: MapPin },
  { href: "/admin/water-quality", label: "Якість води", icon: FlaskConical },
  { href: "/admin/status-chips", label: "Статус-чіпи", icon: Tag },
  { href: "/admin/tariffs", label: "Тарифи", icon: Wallet },
  { href: "/admin/documents", label: "Документи", icon: Files },
  { href: "/admin/pages", label: "Сторінки", icon: FileText },
  { href: "/admin/gallery", label: "Галерея", icon: ImageIcon },
  { href: "/admin/hero", label: "Слайдер", icon: Images },
  { href: "/admin/users", label: "Користувачі", icon: Users },
  { href: "/admin/meters", label: "Лічильники", icon: Gauge },
  { href: "/admin/subscribers", label: "Абоненти", icon: Contact },
  { href: "/admin/surveys", label: "Опитування", icon: ClipboardList },
  { href: "/admin/settings", label: "Налаштування", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F7]">
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />}

      <aside className={sidebarOpen ? "fixed inset-y-0 left-0 w-[260px] bg-[#1D1D1F] text-white z-50 flex flex-col translate-x-0" : "fixed lg:static inset-y-0 left-0 w-[260px] bg-[#1D1D1F] text-white z-50 flex flex-col -translate-x-full lg:translate-x-0"}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
          <Droplets className="h-6 w-6 text-[#0B57D0]" />
          <span className="font-bold text-[15px]">БілоцерківВода</span>
          <span className="ml-auto text-[10px] bg-[#0B57D0] px-2 py-0.5 rounded-full">CMS</span>
        </div>

        <nav className="flex-1 overflow-auto py-4 px-3 space-y-1">
          {sidebarNav.map((it) => {
            const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
            return (
              <Link key={it.href} href={it.href} onClick={() => setSidebarOpen(false)} className={active ? "flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-medium bg-[#0B57D0] text-white" : "flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white"}>
                <it.icon className="h-[18px] w-[18px]" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <Droplets className="h-[18px] w-[18px]" />
            Перейти на сайт
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 rounded-xl px-3 h-10 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-[18px] w-[18px]" />
            Вийти
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-black/[0.06] flex items-center px-4 lg:px-6 shrink-0 w-full">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center">
            <Menu className="h-4 w-4" />
          </button>
          <h2 className="text-[15px] font-semibold text-[#1D1D1F]">
            {sidebarNav.find(n => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "Адмінка"}
          </h2>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6 w-full min-w-0">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
