"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Outage = { id?: string; title: string; address: string; district: string; status: string; time: string; x: number; y: number };

const DISTRICTS = ["Заріччя","Центр","Вокзальна","Піщаний","Гайок","Таращанський"];

export function OutageCreateForm() {
  const [form, setForm] = useState<Outage>({ title: "", address: "", district: "Центр", status: "active", time: "сьогодні 08:20", x: 300, y: 160 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.address) return alert("Заповни заголовок і адресу");
    setLoading(true);
    const res = await fetch("/api/outages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) { setForm({ title: "", address: "", district: "Центр", status: "active", time: "сьогодні 08:20", x: 300, y: 160 }); router.refresh(); }
    else alert("Помилка");
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-[#F8FAFF] rounded-xl p-4 border border-[#E0E7FF]">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold">Заголовок *</label>
          <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Аварія на водогоні" required className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold">Статус</label>
          <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px] bg-white">
            <option value="active">🔴 Активна</option>
            <option value="planned">🔵 Планові</option>
            <option value="done">⚪ Завершено</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold">Адреса *</label>
          <input value={form.address} onChange={e=>setForm({...form, address: e.target.value})} placeholder="вул. Леваневського, 55" required className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold">Район</label>
          <select value={form.district} onChange={e=>setForm({...form, district: e.target.value})} className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px] bg-white">
            {DISTRICTS.map(d=> <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[12px] font-semibold">Час</label>
          <input value={form.time} onChange={e=>setForm({...form, time: e.target.value})} placeholder="сьогодні 08:20" className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold">X (0-600)</label>
          <input type="number" value={form.x} onChange={e=>setForm({...form, x: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold">Y (0-360)</label>
          <input type="number" value={form.y} onChange={e=>setForm({...form, y: Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-black/[0.06] px-3 py-2.5 text-[13px]" />
        </div>
      </div>
      <p className="text-[11px] text-[#6B7280]">Координати для SVG карти 600×360. Центр районів: Центр (300,160), Заріччя (300,70), Вокзальна (100,190) тощо.</p>
      <button type="submit" disabled={loading} className="rounded-full bg-[#DC2626] text-white px-5 py-2 text-[13px] font-semibold hover:bg-[#B91C1C] disabled:opacity-50">{loading ? "..." : "Додати на карту"}</button>
    </form>
  );
}

export function OutageRow({ o }: { o: Outage & { id: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Outage>({ title: o.title, address: o.address, district: o.district, status: o.status, time: o.time, x: o.x, y: o.y });
  const onSave = async () => {
    const res = await fetch(`/api/outages/${o.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setEditing(false); router.refresh(); }
    else alert("Помилка");
  };
  const onDelete = async () => {
    if (!confirm("Видалити?")) return;
    const res = await fetch(`/api/outages/${o.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };
  if (!editing) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] border border-transparent hover:border-black/[0.06]">
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${o.status==="active" ? "bg-[#DC2626] animate-pulse" : o.status==="planned" ? "bg-[#2563EB]" : "bg-[#9CA3AF]"}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate">{o.title} • {o.address}</p>
          <p className="text-[11px] text-[#86868B]">{o.district} • {o.status} • {o.time} • x:{o.x} y:{o.y}</p>
        </div>
        <button onClick={()=>setEditing(true)} className="text-[13px] text-[#0B57D0] font-medium">Редагувати</button>
        <button onClick={onDelete} className="text-[13px] text-[#B3261E]">×</button>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E0E7FF] space-y-2">
      <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full rounded-lg border px-3 py-2 text-[13px]" />
      <div className="grid grid-cols-2 gap-2">
        <input value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="rounded-lg border px-3 py-2 text-[13px]" />
        <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="rounded-lg border px-3 py-2 text-[13px] bg-white">
          <option value="active">active</option><option value="planned">planned</option><option value="done">done</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <select value={form.district} onChange={e=>setForm({...form, district: e.target.value})} className="rounded-lg border px-3 py-2 text-[13px] bg-white">
          {DISTRICTS.map(d=> <option key={d} value={d}>{d}</option>)}
        </select>
        <input value={form.time} onChange={e=>setForm({...form, time: e.target.value})} className="rounded-lg border px-3 py-2 text-[13px]" />
        <div className="flex gap-1">
          <input type="number" value={form.x} onChange={e=>setForm({...form, x: Number(e.target.value)})} className="w-full rounded-lg border px-2 py-2 text-[13px]" />
          <input type="number" value={form.y} onChange={e=>setForm({...form, y: Number(e.target.value)})} className="w-full rounded-lg border px-2 py-2 text-[13px]" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-semibold">Зберегти</button>
        <button onClick={()=>setEditing(false)} className="rounded-full border border-black/10 px-4 py-1.5 text-[12px] font-semibold">Скасувати</button>
      </div>
    </div>
  );
}
