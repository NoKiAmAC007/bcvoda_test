"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type WQ = { pH: number; chlorine: number; hardness: number; turbidity: number; pressure: number; reportMonth: string };

export function WaterQualityCurrentForm({ initial }: { initial: WQ }) {
  const [form, setForm] = useState<WQ>(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/water-quality/current", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) { router.refresh(); alert("Збережено ✓ — KPI pH на головній та віджет якості оновляться"); }
    else alert("Помилка");
  };
  const Field = ({ label, k, step = "0.01", max }: { label: string; k: keyof WQ; step?: string; max?: string }) => (
    <div>
      <label className="text-[12px] font-semibold text-[#1D1D1F]">{label}</label>
      <input type="number" step={step} value={form[k] as any} onChange={e=>setForm({...form, [k]: k==="reportMonth" ? e.target.value as any : Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" placeholder={max} />
    </div>
  );
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-5 gap-3">
        <Field label="pH (6.5–8.5)" k="pH" />
        <Field label="Хлор ≤0.5" k="chlorine" />
        <Field label="Жорсткість ≤7" k="hardness" />
        <Field label="Каламутність ≤1.0" k="turbidity" />
        <Field label="Тиск атм" k="pressure" />
      </div>
      <div>
        <label className="text-[12px] font-semibold">Місяць звіту</label>
        <input value={form.reportMonth} onChange={e=>setForm({...form, reportMonth: e.target.value})} placeholder="Липень 2026" className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
      </div>
      <button type="submit" disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold disabled:opacity-50">{loading ? "..." : "Зберегти поточну якість"}</button>
    </form>
  );
}

type Hist = { id?: string; month: string; label: string; pH: number; turbidity: number; chlorine: number; hardness: number; order: number };

export function WaterQualityHistoryForm() {
  const [form, setForm] = useState<Hist>({ month: "Сер 2026", label: "Сер", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1, order: 7 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/water-quality/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) { setForm({ month: "", label: "", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1, order: 7 }); router.refresh(); }
    else alert("Помилка");
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-[#F8FAFF] rounded-xl p-4 border border-[#E0E7FF]">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-[12px] font-semibold">Місяць *</label><input value={form.month} onChange={e=>setForm({...form, month: e.target.value})} placeholder="Сер 2026" required className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
        <div><label className="text-[12px] font-semibold">Лейбл *</label><input value={form.label} onChange={e=>setForm({...form, label: e.target.value})} placeholder="Сер" required className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div><label className="text-[11px] font-semibold">pH</label><input type="number" step="0.01" value={form.pH} onChange={e=>setForm({...form, pH: Number(e.target.value)})} className="mt-1 w-full rounded-lg border px-2 py-2 text-[13px]" /></div>
        <div><label className="text-[11px] font-semibold">Хлор</label><input type="number" step="0.01" value={form.chlorine} onChange={e=>setForm({...form, chlorine: Number(e.target.value)})} className="mt-1 w-full rounded-lg border px-2 py-2 text-[13px]" /></div>
        <div><label className="text-[11px] font-semibold">Жорстк.</label><input type="number" step="0.01" value={form.hardness} onChange={e=>setForm({...form, hardness: Number(e.target.value)})} className="mt-1 w-full rounded-lg border px-2 py-2 text-[13px]" /></div>
        <div><label className="text-[11px] font-semibold">Каламут.</label><input type="number" step="0.01" value={form.turbidity} onChange={e=>setForm({...form, turbidity: Number(e.target.value)})} className="mt-1 w-full rounded-lg border px-2 py-2 text-[13px]" /></div>
        <div><label className="text-[11px] font-semibold">Порядок</label><input type="number" value={form.order} onChange={e=>setForm({...form, order: Number(e.target.value)})} className="mt-1 w-full rounded-lg border px-2 py-2 text-[13px]" /></div>
      </div>
      <button type="submit" disabled={loading} className="rounded-full bg-[#2E7D32] text-white px-5 py-2 text-[13px] font-semibold disabled:opacity-50">{loading ? "..." : "Додати точку (графік 6 міс)"}</button>
    </form>
  );
}

export function HistoryRow({ h }: { h: Hist & { id: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Hist>({ month: h.month, label: h.label, pH: h.pH, turbidity: h.turbidity, chlorine: h.chlorine, hardness: h.hardness, order: h.order });
  const onSave = async () => {
    const res = await fetch(`/api/water-quality/history/${h.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setEditing(false); router.refresh(); } else alert("Помилка");
  };
  const onDelete = async () => {
    if (!confirm("Видалити точку?")) return;
    const res = await fetch(`/api/water-quality/history/${h.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };
  if (!editing) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] border border-transparent hover:border-black/[0.06]">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium">{h.label} — {h.month}</p>
          <p className="text-[11px] text-[#86868B]">pH {h.pH} • хлор {h.chlorine} • жорстк {h.hardness} • каламут {h.turbidity} • #{h.order}</p>
        </div>
        <button onClick={()=>setEditing(true)} className="text-[12px] text-[#0B57D0] font-medium">Редагувати</button>
        <button onClick={onDelete} className="text-[12px] text-[#B3261E]">×</button>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E0E7FF] space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={form.month} onChange={e=>setForm({...form, month: e.target.value})} className="rounded-lg border px-2 py-2 text-[13px]" />
        <input value={form.label} onChange={e=>setForm({...form, label: e.target.value})} className="rounded-lg border px-2 py-2 text-[13px]" />
      </div>
      <div className="grid grid-cols-5 gap-1">
        <input type="number" step="0.01" value={form.pH} onChange={e=>setForm({...form, pH: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[12px]" />
        <input type="number" step="0.01" value={form.chlorine} onChange={e=>setForm({...form, chlorine: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[12px]" />
        <input type="number" step="0.01" value={form.hardness} onChange={e=>setForm({...form, hardness: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[12px]" />
        <input type="number" step="0.01" value={form.turbidity} onChange={e=>setForm({...form, turbidity: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[12px]" />
        <input type="number" value={form.order} onChange={e=>setForm({...form, order: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[12px]" />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-semibold">Зберегти</button>
        <button onClick={()=>setEditing(false)} className="rounded-full border px-4 py-1.5 text-[12px]">Скасувати</button>
      </div>
    </div>
  );
}
