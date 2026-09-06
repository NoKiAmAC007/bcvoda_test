"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Chip = { label: string; bg: string; title: string; body: string; href: string; order: number };

export function StatusChipCreateForm() {
  const [form, setForm] = useState<Chip>({ label: "Тиск 4.2 атм", bg: "#E8DEF8", title: "Тиск в мережі", body: "Тиск 4.2 атм — в межах норми (норма 2.5–4.5 атм).", href: "/kontrol-yakosti", order: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.title || !form.body) return alert("Заповни поля");
    setLoading(true);
    const res = await fetch("/api/status-chips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) { setForm({ label: "", bg: "#E8DEF8", title: "", body: "", href: "", order: 0 }); router.refresh(); }
    else alert("Помилка");
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-[#F5F5F7] rounded-xl p-4 border border-black/10">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-[12px] font-semibold">Лейбл на чіпі *</label><input value={form.label} onChange={e=>setForm({...form, label: e.target.value})} placeholder="Тиск 3.8 атм" required className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
        <div><label className="text-[12px] font-semibold">Колір фону</label><input type="color" value={form.bg} onChange={e=>setForm({...form, bg: e.target.value})} className="mt-1 h-10 w-full rounded-xl border" /><input value={form.bg} onChange={e=>setForm({...form, bg: e.target.value})} className="mt-1 w-full rounded-lg border px-2 py-1 text-[11px]" /></div>
      </div>
      <div><label className="text-[12px] font-semibold">Title (модалка) *</label><input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
      <div><label className="text-[12px] font-semibold">Body (текст модалки) *</label><textarea value={form.body} onChange={e=>setForm({...form, body: e.target.value})} required rows={2} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-[12px] font-semibold">Href</label><input value={form.href} onChange={e=>setForm({...form, href: e.target.value})} placeholder="/kontrol-yakosti" className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
        <div><label className="text-[12px] font-semibold">Порядок</label><input type="number" value={form.order} onChange={e=>setForm({...form, order: Number(e.target.value)})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px]" /></div>
      </div>
      <button type="submit" disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-semibold disabled:opacity-50">{loading ? "..." : "Додати чіп"}</button>
    </form>
  );
}

export function StatusChipRow({ c }: { c: Chip & { id: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Chip>({ label: c.label, bg: c.bg, title: c.title, body: c.body, href: c.href, order: c.order });
  const onSave = async () => {
    const res = await fetch(`/api/status-chips/${c.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setEditing(false); router.refresh(); } else alert("Помилка");
  };
  const onDelete = async () => {
    if (!confirm("Видалити?")) return;
    const res = await fetch(`/api/status-chips/${c.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };
  if (!editing) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] border border-transparent hover:border-black/[0.06]">
        <span className="px-3 py-1 rounded-full text-[12px] font-medium border" style={{ background: c.bg }}>{c.label}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate">{c.title}</p>
          <p className="text-[11px] text-[#86868B] truncate">{c.body} • {c.href || "—"} • #{c.order}</p>
        </div>
        <button onClick={()=>setEditing(true)} className="text-[12px] text-[#0B57D0] font-medium">Редагувати</button>
        <button onClick={onDelete} className="text-[12px] text-[#B3261E]">×</button>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-xl bg-[#F5F5F7] border space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={form.label} onChange={e=>setForm({...form, label: e.target.value})} className="rounded-lg border px-2 py-2 text-[13px]" />
        <input value={form.bg} onChange={e=>setForm({...form, bg: e.target.value})} className="rounded-lg border px-2 py-2 text-[13px]" />
      </div>
      <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full rounded-lg border px-2 py-2 text-[13px]" />
      <textarea value={form.body} onChange={e=>setForm({...form, body: e.target.value})} rows={2} className="w-full rounded-lg border px-2 py-2 text-[13px]" />
      <div className="grid grid-cols-2 gap-2">
        <input value={form.href} onChange={e=>setForm({...form, href: e.target.value})} className="rounded-lg border px-2 py-2 text-[13px]" />
        <input type="number" value={form.order} onChange={e=>setForm({...form, order: Number(e.target.value)})} className="rounded-lg border px-2 py-2 text-[13px]" />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="rounded-full bg-[#0B57D0] text-white px-4 py-1.5 text-[12px] font-semibold">Зберегти</button>
        <button onClick={()=>setEditing(false)} className="rounded-full border px-4 py-1.5 text-[12px]">Скасувати</button>
      </div>
    </div>
  );
}
