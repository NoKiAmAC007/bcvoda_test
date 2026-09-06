"use client";
import { useState, useEffect } from "react";
export function TariffCalc() {
  const [m3, setM3] = useState(4);
  const [incl, setIncl] = useState(true);
  const [tariff, setTariff] = useState({ water: 30.75, sewage: 48.5, validFrom: "2026-09-01", verified: true });

  useEffect(() => {
    fetch("/data/daily.json")
      .then((r) => r.json())
      .then((j) => {
        if (j.data?.tariff) setTariff({ water: j.data.tariff.water, sewage: j.data.tariff.sewage, validFrom: j.data.tariff.validFrom, verified: true });
      })
      .catch(() => {});
  }, []);

  const total = m3 * tariff.water + (incl ? m3 * tariff.sewage : 0);
  return (
    <div className="m3-card p-6 h-full">
      <h3 className="text-[19px] font-semibold">Калькулятор</h3>
      <p className="text-[13px] text-[#6E6E73]">Тариф з {new Date(tariff.validFrom).toLocaleDateString("uk-UA")}</p>
      <div className="mt-4">
        <div className="flex justify-between text-[12px] text-[#6E6E73]"><span>м³</span><span className="font-semibold text-[#1D1D1F]">{m3}</span></div>
        <input type="range" min={0} max={30} value={m3} onChange={(e) => setM3(Number(e.target.value))} className="w-full accent-[#0B57D0] mt-1" />
      </div>
      <label className="mt-3 flex items-center gap-2 text-[13px]"><input type="checkbox" checked={incl} onChange={(e) => setIncl(e.target.checked)} className="accent-[#0B57D0]" /> + водовідведення</label>
      <div className="mt-4 rounded-2xl bg-[#1C1B1F] text-white p-4">
        <div className="flex justify-between text-[12px] text-white/60"><span>Вода {tariff.water}</span><span>{(m3 * tariff.water).toFixed(2)} грн</span></div>
        {incl && <div className="flex justify-between text-[12px] text-white/60"><span>Стічна {tariff.sewage}</span><span>{(m3 * tariff.sewage).toFixed(2)} грн</span></div>}
        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between font-semibold"><span>Разом</span><span className="text-[#0B57D0]">{total.toFixed(2)} грн</span></div>
      </div>
    </div>
  );
}
