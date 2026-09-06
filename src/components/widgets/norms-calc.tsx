"use client";
import { useState } from "react";
const NORMS: Record<string, number> = { "без ванн": 3.0, "з ванною": 5.4, "з гарячою": 6.8 };
export function NormsCalc() {
  const [p, setP] = useState(2);
  const [t, setT] = useState<keyof typeof NORMS>("з ванною");
  const total = (NORMS[t] * p).toFixed(1);
  return (
    <div className="m3-card p-6">
      <h3 className="text-[19px] font-semibold">Норма</h3>
      <p className="text-[12px] text-[#6E6E73]">Без лічильника</p>
      <div className="mt-4 flex gap-3">
        <div className="flex items-center gap-2 rounded-full bg-[#F5F5F7] p-1">
          <button onClick={() => setP(Math.max(1, p - 1))} className="h-7 w-7 rounded-full bg-white shadow text-sm">−</button>
          <span className="w-6 text-center text-sm font-semibold">{p}</span>
          <button onClick={() => setP(p + 1)} className="h-7 w-7 rounded-full bg-white shadow text-sm">+</button>
        </div>
        <select value={t} onChange={(e) => setT(e.target.value as any)} className="flex-1 rounded-full bg-[#F5F5F7] px-3 text-sm">
          {Object.keys(NORMS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div className="mt-4 rounded-xl bg-[#1D1D1F] text-white p-4 flex justify-between items-center">
        <span className="text-sm">Всього</span><span className="text-xl font-semibold">{total} м³/міс</span>
      </div>
    </div>
  );
}
