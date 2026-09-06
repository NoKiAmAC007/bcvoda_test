"use client";
import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

export function QualitySurveyForm() {
  const [form, setForm] = useState({
    satisfaction: "",
    taste: "", tasteOther: "",
    smell: "", smellOther: "",
    turbidity: "",
    pressure: "", pressureOther: "",
    remarks: "",
    street: "", building: "", apartment: "",
    lastName: "", firstName: "", middleName: "",
    phone: "", email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const upd = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.satisfaction) return setError("Оберіть задоволеність");
    setLoading(true);
    try {
      const res = await fetch("/api/quality-survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
        <p className="flex items-center justify-center gap-2 font-semibold text-green-700"><Check className="h-5 w-5" /> Дякуємо!</p>
        <p className="mt-2 text-sm text-green-800">Ваші відповіді надіслано. Використаємо узагальнено для покращення водопостачання.</p>
        <button onClick={() => setSuccess(false)} className="mt-3 rounded-full bg-white border border-green-200 px-4 py-1.5 text-xs font-semibold">Надіслати ще</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <p className="font-semibold text-sm">Чи задоволені ви якістю води у вашій оселі? *</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Повністю задоволений/-а", "Більше задоволений/-а, ніж незадоволений/-а", "Більше незадоволений/-а, ніж задоволений/-а", "Цілком незадоволений/-а", "Важко відповісти"].map((v) => (
            <label key={v} className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium border ${form.satisfaction === v ? "bg-[#0B57D0] text-white border-[#0B57D0]" : "bg-white border-black/10 hover:bg-black/5"}`}>
              <input type="radio" name="satisfaction" value={v} checked={form.satisfaction === v} onChange={(e) => upd("satisfaction", e.target.value)} className="hidden" /> {v}
            </label>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { k: "taste", label: "Присмак", opts: ["Є", "Нема", "Інше"] },
          { k: "smell", label: "Запах", opts: ["Є", "Нема", "Інше"] },
        ].map((f) => (
          <div key={f.k} className="rounded-2xl bg-[#F5F5F7] p-4">
            <p className="text-sm font-semibold">{f.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {f.opts.map((o) => (
                <label key={o} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs border ${form[f.k as keyof typeof form] === o ? "bg-[#0B57D0] text-white" : "bg-white border-black/10"}`}>
                  <input type="radio" name={f.k} value={o} checked={form[f.k as keyof typeof form] === o} onChange={(e) => upd(f.k, e.target.value)} className="hidden" /> {o}
                </label>
              ))}
            </div>
            {(form[f.k as keyof typeof form] as string) === "Інше" && (
              <input placeholder="Вкажіть" value={form[`${f.k}Other` as keyof typeof form] as string} onChange={(e) => upd(`${f.k}Other`, e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
            )}
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#F5F5F7] p-4">
          <p className="text-sm font-semibold">Каламутність</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Велика", "Середня", "Відсутня"].map((o) => (
              <label key={o} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs border ${form.turbidity === o ? "bg-[#0B57D0] text-white" : "bg-white border-black/10"}`}>
                <input type="radio" name="turbidity" value={o} checked={form.turbidity === o} onChange={(e) => upd("turbidity", e.target.value)} className="hidden" /> {o}
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#F5F5F7] p-4">
          <p className="text-sm font-semibold">Тиск у мережі</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Достатній", "Недостатній", "Інше"].map((o) => (
              <label key={o} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs border ${form.pressure === o ? "bg-[#0B57D0] text-white" : "bg-white border-black/10"}`}>
                <input type="radio" name="pressure" value={o} checked={form.pressure === o} onChange={(e) => upd("pressure", e.target.value)} className="hidden" /> {o}
              </label>
            ))}
          </div>
          {form.pressure === "Інше" && <input placeholder="Вкажіть" value={form.pressureOther} onChange={(e) => upd("pressureOther", e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />}
        </div>
      </div>

      <div className="rounded-2xl bg-[#F5F5F7] p-4">
        <p className="text-sm font-semibold">Інші зауваження до стану води</p>
        <textarea value={form.remarks} onChange={(e) => upd("remarks", e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" placeholder="Ваші зауваження..." />
      </div>

      <div className="rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-semibold">Адреса та персональні дані <span className="text-xs font-normal text-[#6E6E73]">(використаємо узагальнено, не поширюємо)</span></p>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          <input value={form.street} onChange={(e) => upd("street", e.target.value)} placeholder="Вулиця" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.building} onChange={(e) => upd("building", e.target.value)} placeholder="Будинок" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.apartment} onChange={(e) => upd("apartment", e.target.value)} placeholder="Квартира" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.lastName} onChange={(e) => upd("lastName", e.target.value)} placeholder="Прізвище" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.firstName} onChange={(e) => upd("firstName", e.target.value)} placeholder="Ім’я" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.middleName} onChange={(e) => upd("middleName", e.target.value)} placeholder="По-батькові" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="Тел." className="rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          <input value={form.email} onChange={(e) => upd("email", e.target.value)} placeholder="E-mail" type="email" className="rounded-xl border border-black/10 px-3 py-2.5 text-sm sm:col-span-2" />
        </div>
      </div>

      {error && <p className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"><AlertCircle className="h-4 w-4" /> {error}</p>}

      <button type="submit" disabled={loading} className="m3-fab w-full py-3 text-sm disabled:opacity-60">{loading ? "Надсилання..." : "Надіслати анкету"}</button>
      <p className="text-center text-xs text-[#86868B]">Натискаючи, ви погоджуєтесь що дані будуть використані узагальнено • Відправка на <b>office@bcvoda.com.ua</b></p>
    </form>
  );
}
