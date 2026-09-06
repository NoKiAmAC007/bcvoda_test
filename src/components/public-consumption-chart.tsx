"use client";
import { useState } from "react";
import { Droplets } from "lucide-react";

const MONTHS = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер"];
const DATA = [42000, 38000, 51000, 48000, 62000, 59000];

export function PublicConsumptionChart() {
  const [hover, setHover] = useState<number | null>(null);

  const W = 520;
  const H = 200;
  const pad = { l: 40, r: 16, t: 16, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = Math.max(...DATA) * 1.18;
  const min = 0;

  const points = DATA.map((v, i) => {
    const x = pad.l + (i / Math.max(1, DATA.length - 1)) * innerW;
    const y = pad.t + innerH - ((v - min) / (max - min)) * innerH;
    return { x, y, v, label: MONTHS[i] };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${points.map((p) => `${p.x},${p.y}`).join(" ")} ${points[points.length - 1].x},${pad.t + innerH} ${points[0].x},${pad.t + innerH}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-[#E8F0FE] flex items-center justify-center">
            <Droplets className="h-4 w-4 text-[#0B57D0]" />
          </span>
          Споживання міста
        </h3>
        <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73]">тис м³ / місяць</span>
      </div>
      <p className="text-[11px] text-[#86868B] mb-4">Загальне водоспоживання • 6 місяців • м³</p>

      <div className="w-full overflow-x-auto" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px] select-none" role="img" aria-label="Споживання міста по місяцях">
          <defs>
            <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#0B57D0" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* grid */}
          {[0, 1, 2, 3].map((i) => {
            const y = pad.t + (innerH / 3) * i;
            return <line key={i} x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#F2F2F7" strokeWidth={1} />;
          })}
          {/* y labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const val = Math.round(max - (max / 4) * i);
            const y = pad.t + (innerH / 4) * i + 3;
            return (
              <text key={i} x={pad.l - 6} y={y} textAnchor="end" fontSize={10} fill="#86868B">
                {(val / 1000).toFixed(0)}к
              </text>
            );
          })}
          <polygon points={area} fill="url(#pubGrad)" />
          <polyline points={polyline} fill="none" stroke="#0B57D0" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={hover === i ? 5.5 : 4}
                fill="#0B57D0"
                stroke="white"
                strokeWidth={2}
                className="drop-shadow-sm transition-all"
              />
              {hover === i && <line x1={p.x} x2={p.x} y1={pad.t} y2={pad.t + innerH} stroke="#CAC4D0" strokeDasharray="3 3" strokeWidth={1} />}
              <text
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                fontSize={10}
                fill={hover === i ? "#1D1D1F" : "#6E6E73"}
                fontWeight={hover === i ? 700 : 500}
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* tooltip */}
      {hover !== null && (
        <div className="mt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] text-white px-3 py-1.5 text-[11px] font-medium shadow">
            <span>{MONTHS[hover]}:</span>
            <span className="font-bold">{DATA[hover].toLocaleString("uk-UA")} м³</span>
            <span className="opacity-60">• {((DATA[hover] / 1000).toFixed(0))} тис м³</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-[11px] text-[#86868B]">Пік: {Math.max(...DATA).toLocaleString("uk-UA")} м³ • Тра 2026</p>
        <p className="text-[11px] font-medium text-[#0B57D0]">▲ +12% до зими</p>
      </div>
    </div>
  );
}
