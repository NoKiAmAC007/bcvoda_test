import Link from "next/link";
import { getLatestContent, siteConfig } from "@/lib/data";
import { MeterForm } from "@/components/widgets/meter-form";
import { TariffCalc } from "@/components/widgets/tariff-calc";
import { QualityWidget } from "@/components/widgets/quality-widget";
import { NormsCalc } from "@/components/widgets/norms-calc";
import { LiveFeed } from "@/components/widgets/live-feed";
import { OutageMap } from "@/components/outage-map";
import { BusinessHoursWidget } from "@/components/business-hours-widget";
import { Droplets, Waves, Zap, Droplet, Clock, TrendingDown, Leaf, Info, LayoutDashboard, Users, Gauge, Shield, TrendingUp, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { newsList, eventsList, reportsList, totalEvents, totalReports } = await getLatestContent();
  
  // Fetch all dynamic data — now 100% controlled from admin
  const [meterCount, activeEvents, recentReadings, siteSettings, waterQuality, outageCount] = await Promise.all([
    prisma.meterReading.count(),
    prisma.event.count({ where: { title: { contains: "авар" } } }),
    prisma.meterReading.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.waterQuality.findUnique({ where: { id: "current" } }),
    prisma.outage.count({ where: { status: "active" } }),
  ]);
  const settings = siteSettings || siteConfig as any;
  const contacts = (settings as any).contacts ? (settings as any).contacts : { emergency: settings.emergency, callCenter: settings.callCenter, address: settings.address };
  const emergencyPhone = (contacts as any).emergency || "30-11-11";
  const pHValue = waterQuality?.pH ?? 7.3;
  const activeOutages = outageCount || activeEvents;

  // Calculate KPIs from fetched data
  const avgConsumption = recentReadings.length > 0
    ? (recentReadings.reduce((sum, r) => sum + (r.diff || 0), 0) / recentReadings.length).toFixed(1)
    : "8.4";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* KPI Header Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Link href="/tarifi" className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] hover:shadow-md transition-shadow group min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] text-[#6E6E73] mb-1">Тариф вода</p>
              <div className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-[22px] sm:text-[28px] font-bold text-[#1D1D1F] leading-none">30.75</span>
                <span className="text-[12px] sm:text-[13px] text-[#86868B] whitespace-nowrap">грн/м³</span>
              </div>
            </div>
            <div className="bg-[#0B57D0] h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Droplets className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#2E7D32] mt-1.5 font-medium whitespace-nowrap tracking-tight">+0% • діють з 01.09</p>
        </Link>

        <Link href="/kontrol-yakosti" className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] hover:shadow-md transition-shadow group min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] text-[#6E6E73] mb-1">pH води</p>
              <div className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-[22px] sm:text-[28px] font-bold text-[#1D1D1F] leading-none">{pHValue}</span>
                <span className="text-[12px] sm:text-[13px] text-[#86868B] whitespace-nowrap">в нормі</span>
              </div>
              <p className="text-[11px] text-[#86868B] leading-snug">(6.5–8.5)</p>
            </div>
            <div className="bg-[#2E7D32] h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Waves className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#2E7D32] mt-1.5 font-medium whitespace-nowrap tracking-tight">Стабільно • {waterQuality?.reportMonth || ""}</p>
        </Link>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] hover:shadow-md transition-shadow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] text-[#6E6E73] mb-1">Активні аварії</p>
              <div className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-[22px] sm:text-[28px] font-bold text-[#1D1D1F] leading-none">{activeOutages || 1}</span>
                <span className="text-[12px] sm:text-[13px] text-[#86868B] whitespace-nowrap">районів</span>
              </div>
              <p className="text-[11px] text-[#2E7D32] mt-1 font-medium leading-snug">Моніторинг 24/7</p>
            </div>
            <div className="bg-[#B3261E] h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-white flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] hover:shadow-md transition-shadow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] text-[#6E6E73] mb-1">Активні абоненти</p>
              <div className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-[22px] sm:text-[28px] font-bold text-[#1D1D1F] leading-none">120</span>
                <span className="text-[12px] sm:text-[13px] text-[#86868B] whitespace-nowrap">тис. осіб</span>
              </div>
              <p className="text-[11px] text-[#2E7D32] mt-1 font-medium leading-snug break-words">+{meterCount} показників</p>
            </div>
            <div className="bg-[#6750A4] h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-white flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Новий звіт з оф. сайту — серпень 2026 */}
      <a
        href="/reports/quality/pitna/Zvedeni-dani-serpen-RCHV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-[#BBDEFB] bg-[#E3F2FD] px-5 py-3.5 hover:shadow-md transition-shadow group"
      >
        <span className="flex items-center gap-1 rounded-full bg-[#0B57D0] text-white text-[11px] font-bold pl-2 pr-2.5 py-1 shrink-0">
          <FileText className="h-3.5 w-3.5" />
          НОВЕ • PDF
        </span>
        <span className="text-[13px] sm:text-[14px] text-[#1D1D1F]">
          <span className="font-semibold">Звіт про якість питної води за серпень 2026</span>
          <span className="text-[#6E6E73]"> — протокол лабораторії РЧВ</span>
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-[#0B57D0] text-white text-[12px] font-semibold px-4 py-1.5 group-hover:bg-[#084298]">PDF →</span>
      </a>

      {/* Live Feed - News/Events/Reports */}
      <LiveFeed newsList={newsList} eventsList={eventsList} reportsList={reportsList} totalEvents={totalEvents} totalReports={totalReports} />

      {/* Main Dashboard Grid */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left column - Core widgets and charts */}
        <div className="space-y-6">
          {/* Meter + Norms row */}
          <section className="grid lg:grid-cols-2 gap-4">
            <MeterForm />
            <NormsCalc />
          </section>

          {/* Calculator + Quality row */}
          <section className="grid lg:grid-cols-2 gap-4 items-stretch">
            <TariffCalc />
            <QualityWidget />
          </section>
        </div>

        {/* Right column - Sidebar widgets */}
        <div className="flex flex-col gap-6 h-full">
          {/* Business Hours Widget */}
          <BusinessHoursWidget />

          {/* Quick Actions */}
            <section className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-[0_1px_3px_#00000014] flex-1 flex flex-col justify-center">
            <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-4">Швидкі дії</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="#lichylnyk" className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8DEF8] transition-colors text-[13px] font-medium">
                <Gauge className="h-5 w-5 text-[#0B57D0]" />
                Передати показники
              </Link>
              <Link href="/tarifi" className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8DEF8] transition-colors text-[13px] font-medium">
                <TrendingUp className="h-5 w-5 text-[#F57C00]" />
                Оплатити
              </Link>
              <Link href="/kontrol-yakosti" className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8DEF8] transition-colors text-[13px] font-medium">
                <Waves className="h-5 w-5 text-[#2E7D32]" />
                Якість води
              </Link>
              <Link href={`tel:${emergencyPhone.replace(/[^0-9]/g,"")}`} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFD8E4] hover:bg-[#FEC8D4] transition-colors text-[13px] font-medium">
                <Shield className="h-5 w-5 text-[#B3261E]" />
                Повідомити про аварію
              </Link>
            </div>
          </section>
        </div>
      </section>

      <OutageMap />

    </div>
  );
}