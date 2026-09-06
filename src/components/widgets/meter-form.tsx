"use client";
import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export function MeterForm() {
  const [acc, setAcc] = useState("");
  const [prev, setPrev] = useState("");
  const [curr, setCurr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ diff: number; id: string; period: string; fio: string | null; account: string } | null>(null);

  const today = new Date();
  const day = today.getDate();
  const isActive = day >= 28 || day <= 5;
  const nextOpen = (() => {
    if (isActive) return null;
    const d = new Date();
    d.setDate(28);
    if (d < today) d.setMonth(d.getMonth() + 1);
    return d;
  })();

  const diff = Math.max(0, Number(curr || 0) - Number(prev || 0));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!acc || !curr) {
      setError("Заповніть рахунок і 'Стало'");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: acc, prev: prev ? Number(prev) : 0, curr: Number(curr) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка");
      setSuccess({ diff: data.diff, id: data.id, period: data.period || periodLabel, fio: data.fio || null, account: data.account || acc });
      setCurr("");
    } catch (err: any) {
      setError(err.message || "Не вдалося надіслати. Спробуйте в кабінеті.");
    } finally {
      setLoading(false);
    }
  };

  // Період для відображення — наступний місяць як на офіційному
  const periodDate = (() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    if (today.getDate() >= 28) d.setMonth(d.getMonth() + 1);
    return d;
  })();
  const periodLabel = periodDate.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });

  return (
    <div id="lichylnyk" className="m3-card p-6 m3-card-hover scroll-mt-24" style={{ scrollMarginTop: "88px" }}>
      <h3 className="text-[19px] font-semibold tracking-tight">Передати показники</h3>
      <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
        {isActive ? "Прийом відкрито: 28 числа по 5 число включно" : `Прийом закрито — відкриється ${nextOpen?.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" })}`}
      </p>

      {success ? (
        <div className="mt-5 rounded-2xl bg-green-50 border border-green-200 px-4 py-3.5 text-center leading-tight">
          <p className="flex items-center justify-center gap-2 text-green-700 font-semibold text-[15px]"><Check className="h-5 w-5" /> Прийнято!</p>
          <p className="mt-1.5 text-[13px] text-green-800">Рахунок <b>{success.account}</b> • Спожито <b>{success.diff} м³</b> • <span className="whitespace-nowrap"><b>{success.period}</b></span></p>
          <p className="mt-1 text-[12px] text-green-700">
            <span className="whitespace-nowrap">Зараховано на {success.period}</span>
            {success.fio ? <><br /><span className="font-medium">ПІБ: {success.fio}</span></> : <span> • Рахунок {success.account}</span>}
          </p>
          <button onClick={() => setSuccess(null)} className="mt-3 rounded-full bg-white border border-green-200 px-4 py-1.5 text-xs font-semibold">Передати ще</button>
        </div>
      ) : (
        <>
          {!isActive && (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 text-center">
              Доступ закрито до 28 числа — наступне вікно {nextOpen?.toLocaleDateString("uk-UA", { day: "2-digit", month: "long" })}
            </div>
          )}
          <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            value={acc}
            onChange={(e) => setAcc(e.target.value.replace(/\D/g, ""))}
            placeholder="Особовий рахунок • 5–10 цифр"
            pattern="\d*"
            inputMode="numeric"
            required
            disabled={!isActive}
            className={`w-full rounded-xl border border-black/10 px-4 py-3 text-[15px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 ${isActive ? "bg-white" : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`}
          />
          <div className="grid grid-cols-2 gap-3">
            <input value={prev} onChange={(e) => setPrev(e.target.value)} placeholder="Було • м³" type="number" min={0} disabled={!isActive} className={`rounded-xl border border-black/10 px-4 py-3 text-[15px] ${isActive ? "bg-white" : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`} />
            <input value={curr} onChange={(e) => setCurr(e.target.value)} placeholder="Стало • м³" type="number" min={0} required disabled={!isActive} className={`rounded-xl border px-4 py-3 text-[15px] focus:ring-2 outline-none ${isActive ? "bg-white border-[#0B57D0]/30 focus:ring-[#0B57D0]/20" : "bg-[#E5E7EB] border-black/10 text-[#9CA3AF] cursor-not-allowed"}`} />
          </div>
            {isActive && diff > 0 && !error && <p className="text-xs font-medium text-[#0B57D0]">Спожито: {diff} м³ — перевірте перед відправкою</p>}
            {error && <p className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"><AlertCircle className="h-4 w-4" /> {error}</p>}
          <button type="submit" disabled={loading || !isActive} className={`w-full py-3 text-[15px] flex items-center justify-center gap-2 rounded-full font-semibold transition ${isActive ? "m3-fab" : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed border border-black/10"}`}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Надсилання...</> : "Надіслати"}
          </button>
        </form>
        </>
      )}
    </div>
  );
}
