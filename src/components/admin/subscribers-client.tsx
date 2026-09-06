"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Search, Pencil, X } from "lucide-react";

type Sub = {
  id: string;
  account: string;
  lastName: string;
  firstName: string;
  middleName?: string | null;
  fio: string;
  address?: string | null;
  phone?: string | null;
};

export function SubscribersClient({ initial }: { initial: Sub[] }) {
  const [list, setList] = useState<Sub[]>(initial);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Sub | null>(null);
  const [form, setForm] = useState({ account: "", lastName: "", firstName: "", middleName: "", address: "", phone: "" });
  const router = useRouter();

  const doSearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/subscribers?q=${encodeURIComponent(q)}`);
    const data = await res.json().catch(() => []);
    setLoading(false);
    if (Array.isArray(data)) setList(data);
  };

  const clearSearch = async () => {
    setQ("");
    const res = await fetch("/api/subscribers");
    const data = await res.json().catch(() => []);
    if (Array.isArray(data)) setList(data);
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.account || !form.lastName || !form.firstName) return alert("Заповни рахунок, прізвище, ім'я");
    const res = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const created = await res.json();
      setList(prev => [created, ...prev]);
      setForm({ account: "", lastName: "", firstName: "", middleName: "", address: "", phone: "" });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Помилка");
    }
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/subscribers/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await res.json();
      setList(prev => prev.map(s => s.id === editing.id ? updated : s));
      setEditing(null);
      setForm({ account: "", lastName: "", firstName: "", middleName: "", address: "", phone: "" });
    } else alert("Помилка");
  };

  const startEdit = (s: Sub) => {
    setEditing(s);
    setForm({ account: s.account, lastName: s.lastName, firstName: s.firstName, middleName: s.middleName || "", address: s.address || "", phone: s.phone || "" });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Видалити абонента?")) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) setList(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">{editing ? "Редагувати абонента" : "Додати абонента"}</h3>
        <form onSubmit={editing ? onUpdate : onCreate} className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-semibold">Рахунок *</label>
              <input value={form.account} onChange={e=>setForm({...form, account: e.target.value.replace(/\D/g,"")})} placeholder="56101" required pattern="\d{5,10}" inputMode="numeric" className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold">Прізвище *</label>
              <input value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} placeholder="Засадюк" required className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold">Імʼя *</label>
              <input value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} placeholder="Олександр" required className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-semibold">По батькові</label>
              <input value={form.middleName} onChange={e=>setForm({...form, middleName: e.target.value})} placeholder="Костянтинович" className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold">Телефон</label>
              <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="067..." className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold">Адреса</label>
              <input value={form.address} onChange={e=>setForm({...form, address: e.target.value})} placeholder="вул. ..." className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-[13px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#0842A0]">{editing ? "Зберегти" : "Додати"}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null); setForm({ account: "", lastName: "", firstName: "", middleName: "", address: "", phone: "" });}} className="rounded-full border border-black/10 px-6 py-2.5 text-[13px] font-semibold">Скасувати</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter" && doSearch()} placeholder="Пошук: 56101, Засадюк..." className="w-full rounded-xl border border-black/10 pl-9 pr-9 py-2.5 text-[13px]" />
            {q && <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-black/5 grid place-items-center"><X className="h-4 w-4" /></button>}
          </div>
          <button onClick={doSearch} disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold disabled:opacity-50">{loading ? "..." : "Шукати"}</button>
        </div>

        <div className="space-y-2">
          {list.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] border border-transparent hover:border-black/[0.06]">
              <div className="h-10 w-10 rounded-xl bg-[#E8F0FE] text-[#0B57D0] grid place-items-center font-bold text-[11px] shrink-0">{s.account.slice(0,2)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold break-words">{s.fio} <span className="text-[11px] font-normal text-[#86868B]">• {s.account}</span></p>
                <p className="text-[11px] text-[#86868B] break-words">{s.lastName} {s.firstName} {s.middleName || ""} • {s.address || "—"} {s.phone ? `• ${s.phone}` : ""}</p>
              </div>
              <button onClick={()=>startEdit(s)} title="Редагувати" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#E8F0FE] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0]"><Pencil className="h-4 w-4" /></button>
              <button onClick={()=>onDelete(s.id)} title="Видалити" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#FCE8E6] grid place-items-center text-[#6E6E73] hover:text-[#B3261E]"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {!list.length && <p className="text-[13px] text-[#86868B] py-6 text-center">Немає абонентів. Додай 56101 Засадюк Олександр Костянтинович.</p>}
        </div>
      </div>
    </div>
  );
}
