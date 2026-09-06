"use client";
import { useState } from "react";
import { CreditCard, X, ExternalLink } from "lucide-react";

const WATER = 30.75;
const SEWAGE = 48.5;
const TOTAL_PER_M3 = WATER + SEWAGE;

export function PaymentWidget() {
  const [m3, setM3] = useState(5);
  const [open, setOpen] = useState(false);
  const total = m3 * TOTAL_PER_M3;
  const waterPart = m3 * WATER;
  const sewagePart = m3 * SEWAGE;

  return (
    <>
      <div className="rounded-2xl border border-black/[0.06] p-6 sm:p-8 text-white overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0B57D0 0%, #6750A4 45%, #1C1B1F 100%)" }}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard className="h-5 w-5" /></span>
            <h3 className="text-[18px] font-bold">Оплата онлайн</h3>
          </div>
          <p className="mt-2 text-[12px] text-white/70">Розрахуйте суму та сплатіть без комісії через кабінет</p>

          <div className="mt-6">
            <div className="flex justify-between text-[12px] text-white/70"><span>Споживання, м³</span><span className="font-bold text-white text-[16px]">{m3} м³</span></div>
            <input type="range" min={0} max={50} value={m3} onChange={(e) => setM3(Number(e.target.value))} className="w-full accent-white mt-2" />
            <div className="mt-1 flex justify-between text-[11px] text-white/50"><span>0</span><span>50 м³</span></div>
            <div className="mt-4 flex items-center gap-3">
              <input type="number" min={0} max={999} value={m3} onChange={(e) => setM3(Math.max(0, Number(e.target.value) || 0))} className="w-24 rounded-xl bg-white text-[#1D1D1F] px-4 py-2 text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-white/30" />
              <span className="text-[12px] text-white/60">м³ × {TOTAL_PER_M3.toFixed(2)} грн</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white text-[#1D1D1F] p-4">
            <div className="flex justify-between text-[11px] text-[#6E6E73]"><span>Вода {WATER.toFixed(2)} × {m3}</span><span>{waterPart.toFixed(2)} грн</span></div>
            <div className="flex justify-between text-[11px] text-[#6E6E73] mt-1"><span>Водовідведення {SEWAGE.toFixed(2)} × {m3}</span><span>{sewagePart.toFixed(2)} грн</span></div>
            <div className="mt-3 pt-3 border-t border-black/10 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-[#6E6E73]">До сплати</span>
              <span className="text-[28px] font-extrabold tracking-tight text-[#0B57D0]">{total.toFixed(2)} <span className="text-[14px] font-semibold">грн</span></span>
            </div>
          </div>

          <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-full bg-white text-[#0B57D0] py-3 text-[14px] font-bold hover:bg-white/90 transition flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" /> Оплатити {total.toFixed(2)} грн
          </button>
          <p className="mt-2 text-[11px] text-white/60 text-center">Без комісії • через кабінет або Portmone / LiqPay</p>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl border border-black/[0.06] p-6 w-full max-w-md shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10"><X className="h-4 w-4" /></button>
            <h3 className="text-[18px] font-bold text-[#1D1D1F] pr-8">Оберіть спосіб оплати</h3>
            <p className="text-[13px] text-[#6E6E73] mt-1">Сума до сплати: <span className="font-bold text-[#1D1D1F]">{total.toFixed(2)} грн</span> за {m3} м³</p>
            <div className="mt-5 space-y-3">
              <a href="http://my.bcvoda.com.ua/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-black/10 p-4 hover:bg-[#F5F5F7] transition">
                <div><p className="text-[14px] font-semibold">Через кабінет my.bcvoda.com.ua</p><p className="text-[11px] text-[#6E6E73]">Фіз. особи • рекомендовано</p></div><ExternalLink className="h-4 w-4 text-[#86868B]" />
              </a>
              <a href="https://www.portmone.com.ua/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-black/10 p-4 hover:bg-[#F5F5F7] transition">
                <div><p className="text-[14px] font-semibold">Portmone</p><p className="text-[11px] text-[#6E6E73]">Швидка оплата карткою</p></div><ExternalLink className="h-4 w-4 text-[#86868B]" />
              </a>
              <a href="https://www.liqpay.ua/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-black/10 p-4 hover:bg-[#F5F5F7] transition">
                <div><p className="text-[14px] font-semibold">LiqPay</p><p className="text-[11px] text-[#6E6E73]">ПриватБанк • Apple Pay / Google Pay</p></div><ExternalLink className="h-4 w-4 text-[#86868B]" />
              </a>
              <a href="http://cabinet.bcvoda.com.ua" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-black/10 p-4 hover:bg-[#F5F5F7] transition">
                <div><p className="text-[14px] font-semibold">Кабінет юр. осіб</p><p className="text-[11px] text-[#6E6E73]">cabinet.bcvoda.com.ua</p></div><ExternalLink className="h-4 w-4 text-[#86868B]" />
              </a>
            </div>
            <p className="mt-4 text-[11px] text-[#86868B] text-center">Оплата зараховується протягом 1 робочого дня. Комісія 0% через кабінет.</p>
          </div>
        </div>
      )}
    </>
  );
}
