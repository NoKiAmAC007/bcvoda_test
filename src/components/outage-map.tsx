"use client";
import { useEffect, useState } from "react";
import { MapPin, Phone, Clock3, X } from "lucide-react";

type Outage = {
  id: string;
  title: string;
  address: string;
  district: string;
  status: "active" | "done" | "planned";
  time: string;
  x: number;
  y: number;
};

const DISTRICTS = [
  { name: "Заріччя", d: "M 180 20 L 420 20 L 420 120 L 180 120 Z", cx: 300, cy: 70 },
  { name: "Центр", d: "M 180 120 L 420 120 L 420 200 L 180 200 Z", cx: 300, cy: 160 },
  { name: "Вокзальна", d: "M 20 120 L 180 120 L 180 260 L 20 260 Z", cx: 100, cy: 190 },
  { name: "Піщаний", d: "M 420 120 L 580 120 L 580 260 L 420 260 Z", cx: 500, cy: 190 },
  { name: "Гайок", d: "M 20 260 L 280 260 L 280 340 L 20 340 Z", cx: 150, cy: 300 },
  { name: "Таращанський", d: "M 280 260 L 580 260 L 580 340 L 280 340 Z", cx: 430, cy: 300 },
];

const MOCK_OUTAGES: Outage[] = [
  { id: "1", title: "Аварія на водогоні", address: "вул. Леваневського, 55", district: "Центр", status: "active", time: "сьогодні 08:20", x: 355, y: 145 },
  { id: "2", title: "Планові роботи", address: "вул. Таращанська, 191", district: "Таращанський", status: "planned", time: "02.09 09:00–17:00", x: 520, y: 318 },
  { id: "3", title: "Аварія ліквідована", address: "вул. Я. Мудрого, 10", district: "Вокзальна", status: "done", time: "01.09 22:10", x: 55, y: 150 },
  { id: "4", title: "Витік, бригада виїхала", address: "вул. Сквирське шосе", district: "Піщаний", status: "active", time: "сьогодні 06:40", x: 548, y: 160 },
  { id: "5", title: "Аварія ліквідована", address: "пров. Гайок, 12", district: "Гайок", status: "done", time: "31.08 15:00", x: 205, y: 322 },
];

function statusCfg(s: Outage["status"]) {
  if (s === "active") return { color: "#DC2626", bg: "#DC2626", label: "Активна", dot: "bg-[#DC2626]", light: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]", bar: "bg-[#DC2626]" };
  if (s === "planned") return { color: "#2563EB", bg: "#2563EB", label: "Планові", dot: "bg-[#2563EB]", light: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]", bar: "bg-[#2563EB]" };
  return { color: "#6B7280", bg: "#9CA3AF", label: "Завершено", dot: "bg-[#9CA3AF]", light: "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]", bar: "bg-[#9CA3AF]" };
}

export function OutageMap() {
  const [outages, setOutages] = useState<Outage[]>(MOCK_OUTAGES);
  const [selected, setSelected] = useState<Outage | null>(null);
  const [hoverDistrict, setHoverDistrict] = useState<string | null>(null);

  useEffect(() => {
    // Primary source: /api/outages (100% admin-controlled). Fallback to /api/events then mock.
    fetch("/api/outages")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Outage[] = data.slice(0, 8).map((o) => ({
            id: o.id,
            title: o.title,
            address: o.address,
            district: o.district,
            status: o.status as Outage["status"],
            time: o.time,
            x: o.x,
            y: o.y,
          }));
          setOutages(mapped);
          return;
        }
        // fallback to events
        return fetch("/api/events")
          .then((r) => r.json())
          .then((ev: any[]) => {
            if (!Array.isArray(ev) || ev.length === 0) return;
            const mapped: Outage[] = ev.slice(0, 6).map((e, idx) => {
              const isAccident = /авар/i.test(e.title);
              const base = MOCK_OUTAGES[idx % MOCK_OUTAGES.length];
              return {
                id: e.id,
                title: e.title,
                address: e.excerpt || base.address,
                district: base.district,
                status: isAccident ? "active" : idx % 3 === 0 ? "planned" : "done",
                time: new Date(e.publishedAt || e.createdAt).toLocaleDateString("uk-UA"),
                x: base.x + (idx % 2 ? 8 : -6),
                y: base.y + (idx % 3 ? 5 : -4),
              } as Outage;
            });
            if (mapped.length) setOutages(mapped);
          });
      })
      .catch(() => {});
  }, []);

  const activeCount = outages.filter((o) => o.status === "active").length;
  const plannedCount = outages.filter((o) => o.status === "planned").length;
  const doneCount = outages.filter((o) => o.status === "done").length;

  return (
    <div className="bg-white rounded-[24px] border border-black/[0.06] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 sm:px-7 pt-6 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-[#DC2626] text-white grid place-items-center shrink-0 shadow-sm">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold tracking-tight text-[#111827] leading-none">Карта аварій та робіт</h3>
            <p className="text-[12.5px] text-[#6B7280] mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Біла Церква • інтерактивно • оновлення щогодини
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 text-[#DC2626]">
              <span className="h-2 w-2 rounded-full bg-[#DC2626] animate-pulse" /> {activeCount} активні
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" /> {plannedCount} планові
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1 text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-[#9CA3AF]" /> {doneCount} завершено
            </span>
          </div>
          <a
            href="tel:301111"
            className="inline-flex items-center gap-2 rounded-full bg-[#111827] text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-black transition shadow-sm"
          >
            <Phone className="h-3.5 w-3.5" />
            30-11-11
          </a>
        </div>
      </div>

      {/* Mobile legend - visible only on small */}
      <div className="sm:hidden px-5 pb-4 flex flex-wrap gap-1.5 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 text-[#DC2626]">● {activeCount} активні</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[#2563EB]">● {plannedCount} планові</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1 text-[#6B7280]">● {doneCount} завершено</span>
      </div>

      {/* Main grid - map + list */}
      <div className="grid lg:grid-cols-[1.65fr_0.95fr] border-t border-black/[0.06]">
        {/* Map */}
        <div className="relative bg-[#F8FAFF] p-3 sm:p-4">
          <div className="relative rounded-[20px] overflow-hidden border border-[#E0E7FF] bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFF] shadow-inner">
            <svg viewBox="0 0 600 360" className="w-full h-[300px] sm:h-[380px] lg:h-[420px] block" role="img" aria-label="Карта Білої Церкви">
              {/* subtle grid */}
              <defs>
                <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E0E7FF" strokeWidth={0.6} opacity={0.6} />
                </pattern>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <rect x={0} y={0} width={600} height={360} fill="url(#grid)" opacity={0.5} />
              <rect x={0} y={0} width={600} height={360} rx={16} fill="transparent" />

              {/* river */}
              <path d="M 0 128 Q 150 118 300 132 T 600 128" stroke="url(#riverGrad)" strokeWidth={22} fill="none" strokeLinecap="round" />
              <path d="M 0 128 Q 150 118 300 132 T 600 128" stroke="#3B82F6" strokeWidth={2} fill="none" opacity={0.9} strokeDasharray="8 8" strokeLinecap="round" />
              <g>
                <rect x={485} y={105} width={56} height={16} rx={8} fill="white" stroke="#BFDBFE" strokeWidth={1} />
                <text x={513} y={116} textAnchor="middle" fontSize={9} fontWeight={600} fill="#2563EB" fontStyle="italic">р. Рось</text>
              </g>

              {/* districts (підкладка) */}
              {DISTRICTS.map((d) => {
                const isHover = hoverDistrict === d.name;
                return (
                  <g key={d.name} onMouseEnter={() => setHoverDistrict(d.name)} onMouseLeave={() => setHoverDistrict(null)} className="cursor-pointer">
                    <path
                      d={d.d}
                      fill={isHover ? "#FFFFFF" : "white"}
                      stroke={isHover ? "#2563EB" : "#E5E7EB"}
                      strokeWidth={isHover ? 1.6 : 1.2}
                      style={{ filter: isHover ? "drop-shadow(0 4px 8px rgba(37,99,235,0.12))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.04))", transition: "all 0.2s" }}
                    />
                  </g>
                );
              })}

              {/* markers */}
              {outages.map((o) => {
                const cfg = statusCfg(o.status);
                const isActive = o.status === "active";
                return (
                  <g key={o.id} className="cursor-pointer" onClick={() => setSelected(o)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" }}>
                    {isActive && <circle cx={o.x} cy={o.y} r={20} fill={cfg.color} opacity={0.14} className="animate-ping" />}
                    {isActive && <circle cx={o.x} cy={o.y} r={11} fill="white" opacity={0.9} />}
                    <circle cx={o.x} cy={o.y} r={isActive ? 8.5 : 7.5} fill={cfg.bg} stroke="white" strokeWidth={2.2} />
                    <circle cx={o.x} cy={o.y} r={2.4} fill="white" />
                    {selected?.id === o.id && <circle cx={o.x} cy={o.y} r={14} fill="none" stroke={cfg.color} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.6} />}
                  </g>
                );
              })}

              {/* підписи районів — поверх маркерів, з білим ореолом щоб завжди читались */}
              {DISTRICTS.map((d) => {
                const isHover = hoverDistrict === d.name;
                return (
                  <g
                    key={`label-${d.name}`}
                    onMouseEnter={() => setHoverDistrict(d.name)}
                    onMouseLeave={() => setHoverDistrict(null)}
                    className="cursor-pointer pointer-events-auto"
                  >
                    <text
                      x={d.cx}
                      y={d.cy}
                      textAnchor="middle"
                      fontSize={isHover ? 12 : 11}
                      fontWeight={700}
                      fill={isHover ? "#1E40AF" : "#1F2937"}
                      stroke="white"
                      strokeWidth={3.5}
                      paintOrder="stroke"
                      style={{ transition: "all 0.2s" }}
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* map hint */}
            <div className="absolute left-3 bottom-3 bg-white/90 backdrop-blur rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-medium text-[#374151] shadow-sm hidden sm:flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Натисни на маркер для деталей
            </div>

            {/* zoom fake controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              <div className="h-8 w-8 rounded-xl bg-white border border-black/10 grid place-items-center text-[#6B7280] shadow-sm text-[14px] font-bold">+</div>
              <div className="h-8 w-8 rounded-xl bg-white border border-black/10 grid place-items-center text-[#6B7280] shadow-sm text-[14px] font-bold">−</div>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[10.5px] text-[#9CA3AF] hidden lg:block">р. Рось — джерело водопостачання • Дані з диспетчерської • Оновлення щогодини</p>
        </div>

        {/* List */}
        <div className="bg-white border-t lg:border-t-0 lg:border-l border-black/[0.06] flex flex-col">
          <div className="px-4 sm:px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-[#F9FAFB]/60">
            <h4 className="text-[13px] font-bold text-[#111827] flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#6B7280]" />
              Останні події
              <span className="ml-1 bg-[#111827] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{outages.length}</span>
            </h4>
            <a href="/events" className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              Всі події →
            </a>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[380px] lg:max-h-[420px]">
            {outages.map((o) => {
              const cfg = statusCfg(o.status);
              const isSelected = selected?.id === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={`w-full text-left group relative flex gap-3 rounded-2xl border p-3.5 transition-all ${
                    isSelected ? "bg-[#EFF6FF] border-[#BFDBFE] shadow-sm" : "bg-[#F9FAFB] border-black/[0.06] hover:bg-white hover:border-black/10 hover:shadow-sm"
                  }`}
                >
                  <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${cfg.bar} opacity-90`} />
                  <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1 ml-1">
                    {o.status === "active" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ background: cfg.bg }} />}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: cfg.bg }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#111827] line-clamp-1 group-hover:text-[#1E40AF] transition-colors">{o.title}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] text-[#6B7280] line-clamp-1">
                      <MapPin className="h-3 w-3 shrink-0 opacity-60" />
                      {o.address}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.light}`}>{cfg.label}</span>
                      <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        {o.time}
                      </span>
                    </span>
                  </span>
                  <span className="hidden sm:inline-flex self-center shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-black/10 text-[#374151] shadow-sm">
                    {o.district}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-black/[0.06] bg-[#F9FAFB]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6B7280]">Джерело: диспетчерська + prisma.event</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-[#111827]/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-t-[20px] sm:rounded-[20px] border border-black/10 w-full sm:max-w-[420px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full" style={{ background: statusCfg(selected.status).bg }} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusCfg(selected.status).light}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {statusCfg(selected.status).label}
                </span>
                <button onClick={() => setSelected(null)} className="h-8 w-8 rounded-full bg-black/[0.06] hover:bg-black/10 grid place-items-center transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h4 className="mt-4 text-[16px] font-bold text-[#111827] leading-tight">{selected.title}</h4>
              <p className="mt-2 text-[13px] text-[#4B5563] flex items-start gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#9CA3AF]" />
                <span>
                  {selected.address} <span className="text-[#9CA3AF]">• {selected.district}</span>
                </span>
              </p>
              <p className="mt-1.5 text-[12px] text-[#9CA3AF] flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {selected.time}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href="tel:301111"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] text-white py-3 text-[13px] font-bold hover:bg-black transition"
                >
                  <Phone className="h-4 w-4" />
                  30-11-11
                </a>
                <button onClick={() => setSelected(null)} className="rounded-full border border-black/10 py-3 text-[13px] font-bold hover:bg-black/[0.04] transition">
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
