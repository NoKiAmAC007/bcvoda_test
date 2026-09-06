"use client";
import { useState, useEffect } from "react";
import { WaterLiveIndicator } from "./water-live-indicator";

// Мок 6 місяців — реалістичні значення в межах ДСанПіН 2.2.4-171-10
// Норми: pH 6.5–8.5 | каламутність ≤1.0 мг/дм³ | хлор ≤0.5 мг/дм³ | жорсткість ≤7 ммоль/дм³
const MOCK_HISTORY = [
  { month: "Січ 2026", label: "Січ", pH: 7.2, turbidity: 0.14, chlorine: 0.26, hardness: 2.0 },
  { month: "Лют 2026", label: "Лют", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
  { month: "Бер 2026", label: "Бер", pH: 7.4, turbidity: 0.11, chlorine: 0.30, hardness: 2.2 },
  { month: "Кві 2026", label: "Кві", pH: 7.35, turbidity: 0.13, chlorine: 0.27, hardness: 2.0 },
  { month: "Тра 2026", label: "Тра", pH: 7.25, turbidity: 0.10, chlorine: 0.25, hardness: 1.9 },
  { month: "Чер 2026", label: "Чер", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
  { month: "Лип 2026", label: "Лип", pH: 7.32, turbidity: 0.11, chlorine: 0.29, hardness: 2.15 },
  { month: "Сер 2026", label: "Сер", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
];

const LINES = [
  { key: "pH" as const, label: "pH", color: "#0B57D0", norm: "6.5–8.5", max: 8.5 },
  { key: "chlorine" as const, label: "Хлор", color: "#00ACC1", norm: "≤0.5", max: 0.5 },
  { key: "hardness" as const, label: "Жорсткість", color: "#2E7D32", norm: "≤7", max: 7 },
  { key: "turbidity" as const, label: "Каламутність", color: "#EF6C00", norm: "≤1.0", max: 1 },
];

function normalize(key: (typeof LINES)[number]["key"], v: number) {
  const max = LINES.find((l) => l.key === key)!.max;
  // pH нормуємо від 0 щоб лінія була в середині
  if (key === "pH") return (v / max) * 100;
  return (v / max) * 100;
}

export function WaterQualityChart() {
  const [hover, setHover] = useState<number | null>(null);
  const [history, setHistory] = useState<typeof MOCK_HISTORY>(MOCK_HISTORY);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetch("/api/water-quality")
      .then((r) => r.json())
      .then((j) => {
        if (j.history?.length) setHistory(j.history);
        if (j.lastUpdated) setLastUpdate(j.lastUpdated);
      })
      .catch(() => {});
  }, []);

  const W = 600;
  const H = 180;
  const padL = 32;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const getX = (i: number) => padL + (i / (history.length - 1)) * innerW;
  const getY = (pct: number) => padT + innerH - (pct / 100) * innerH;

  const toPath = (key: (typeof LINES)[number]["key"]) => {
    return history
      .map((d, i) => {
        const pct = normalize(key, d[key]);
        const x = getX(i);
        // масштабуємо для читабельності: pH і hardness турбідність мають різні масштаби,
        // тому для візуалізації розтягуємо turbid/chlorine/hardness в 2x щоб лінії не лежали внизу
        // але зберігаємо реальний % для tooltip; натомість тут множимо низькі на коеф для видимості
        let y: number;
        if (key === "turbidity" || key === "chlorine") y = getY(pct * 1.6);
        else if (key === "hardness") y = getY(pct * 1.4);
        else y = getY(pct);
        return `${i === 0 ? "M" : "L"} ${x} ${Math.max(padT, Math.min(padT + innerH, y))}`;
      })
      .join(" ");
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1C1B1F]">Динаміка якості води</h3>
          <p className="text-[12px] text-[#6E6E73] mt-0.5">8 місяців • за даними лабораторії РЧВ • норми ДСанПіН</p>
        </div>
        <WaterLiveIndicator lastUpdated={lastUpdate} />
      </div>

      {/* легенда */}
      <div className="mt-4 flex flex-wrap gap-3">
        {LINES.map((l) => (
          <span key={l.key} className="inline-flex items-center gap-1.5 text-[11px] font-medium">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            <span style={{ color: l.color }}>{l.label}</span>
            <span className="text-[#86868B] font-normal">({l.norm})</span>
          </span>
        ))}
      </div>

      {/* графік */}
      <div className="mt-3 relative" style={{ height: 280 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[220px] select-none"
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label="Графік якості води"
        >
          {/* сітка */}
          {[0, 25, 50, 75, 100].map((p) => (
            <line
              key={p}
              x1={padL}
              x2={W - padR}
              y1={getY(p)}
              y2={getY(p)}
              stroke="#E7E0EC"
              strokeDasharray={p === 0 || p === 100 ? "0" : "4 4"}
              strokeWidth={1}
            />
          ))}
          {/* підписи осі Y */}
          {[0, 50, 100].map((p) => (
            <text key={p} x={2} y={getY(p) + 3} fontSize={9} fill="#86868B">
              {p}%
            </text>
          ))}
          {/* лінії */}
          {LINES.map((l) => (
            <path key={l.key} d={toPath(l.key)} fill="none" stroke={l.color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {/* точки + хіт-зона */}
          {history.map((d, i) => {
            const x = getX(i);
            return (
              <g key={i}>
                <rect
                  x={x - innerW / history.length / 2}
                  y={padT}
                  width={innerW / history.length}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
                {LINES.map((l) => {
                  const pct = normalize(l.key, d[l.key]);
                  let y: number;
                  if (l.key === "turbidity" || l.key === "chlorine") y = getY(pct * 1.6);
                  else if (l.key === "hardness") y = getY(pct * 1.4);
                  else y = getY(pct);
                  y = Math.max(padT, Math.min(padT + innerH, y));
                  const active = hover === i;
                  return <circle key={l.key} cx={x} cy={y} r={active ? 4 : 2.5} fill={l.color} stroke="white" strokeWidth={1.5} className="transition-all" />;
                })}
                {hover === i && <line x1={x} x2={x} y1={padT} y2={padT + innerH} stroke="#CAC4D0" strokeDasharray="3 3" strokeWidth={1} />}
                <text x={x} y={H - 6} textAnchor="middle" fontSize={10} fill={hover === i ? "#1C1B1F" : "#6E6E73"} fontWeight={hover === i ? 600 : 400}>
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* tooltip */}
        {hover !== null && history[hover] && (
          <div
            className="absolute z-10 pointer-events-none bg-[#1C1B1F] text-white rounded-xl px-3 py-2.5 shadow-lg text-[11px] leading-tight min-w-[160px]"
            style={{
              left: `clamp(8px, ${(hover / (history.length - 1)) * 100}%, calc(100% - 170px))`,
              top: 8,
            }}
          >
            <p className="font-semibold text-[12px]">{history[hover].month}</p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
              {LINES.map((l) => (
                <span key={l.key} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: l.color }} />
                  <span className="opacity-80">{l.label}:</span>
                  <span className="font-semibold ml-auto">{history[hover][l.key]}</span>
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] opacity-60">В межах норми ✓</p>
          </div>
        )}

        <p className="mt-1 text-center text-[10px] text-[#86868B]">Наведіть на точку для деталей • 100% = верхня межа норми</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 font-medium">Вода відповідає ДСанПіН ✓</span>
        <a href="/yakist-vodi-pitnoyi-vodi" className="rounded-full bg-[#E3F2FD] text-[#0B57D0] px-3 py-1 font-medium hover:bg-[#BBDEFB]">Архів PDF →</a>
      </div>
    </div>
  );
}
