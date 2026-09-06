"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Search, User, MapPin, Phone, X } from "lucide-react";

type Meter = {
  id: string;
  account: string;
  prev: number;
  curr: number;
  diff: number;
  period?: string | null;
  fio?: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt: string;
  subscriberId?: string | null;
};

export function MetersClient({ initial }: { initial: Meter[] }) {
  const [q, setQ] = useState("");
  const [list, setList] = useState<Meter[]>(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doSearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/meter?q=${encodeURIComponent(q)}&take=100`);
    const data = await res.json().catch(() => []);
    setLoading(false);
    if (Array.isArray(data)) setList(data);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") doSearch();
  };

  const clearSearch = async () => {
    setQ("");
    setLoading(true);
    const res = await fetch("/api/meter?take=100");
    const data = await res.json().catch(() => []);
    setLoading(false);
    if (Array.isArray(data)) setList(data);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Видалити показання?")) return;
    const res = await fetch(`/api/meter/${id}`, { method: "DELETE" });
    if (res.ok) setList(prev => prev.filter(m => m.id !== id));
    else alert("Помилка");
  };

  const onDeleteAll = async () => {
    if (!confirm(`Видалити ВСІ ${list.length} показань?`)) return;
    if (!confirm("Точно видалити всі?")) return;
    const res = await fetch("/api/meter", { method: "DELETE" });
    if (res.ok) { setList([]); router.refresh(); }
    else alert("Помилка");
  };

  // Manual add subscriber when not found
  const [addAccount, setAddAccount] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addFirstName, setAddFirstName] = useState("");
  const [addMiddleName, setAddMiddleName] = useState("");
  const [addAddress, setAddAddress] = useState("");

  useEffect(() => {
    if (q && /^\d{5,10}$/.test(q.trim())) setAddAccount(q.trim());
  }, [q]);

  const onCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAccount || !addLastName || !addFirstName) return alert("Заповни рахунок, прізвище, імʼя");
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account: addAccount, lastName: addLastName, firstName: addFirstName, middleName: addMiddleName, address: addAddress }),
    });
    if (res.ok) {
      alert(`Абонента ${addLastName} ${addFirstName} додано. Наступні показання для ${addAccount} покажуть ПІБ.`);
      setAddLastName(""); setAddFirstName(""); setAddMiddleName(""); setAddAddress("");
      // refresh subscribers cache and re-search
      doSearch();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Помилка");
    }
  };

  // Sync if initial changes (e.g., after server refresh)
  useEffect(() => { if (!q) setList(initial); }, [initial, q]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={onKey}
              placeholder="Пошук по базі: рахунок, ПІБ, адреса..."
              className="w-full rounded-xl border border-black/10 pl-9 pr-9 py-2.5 text-[13px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20"
            />
            {q && (
              <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-black/5 grid place-items-center">
                <X className="h-4 w-4 text-[#86868B]" />
              </button>
            )}
          </div>
          <button onClick={doSearch} disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#0842A0] disabled:opacity-50">
            {loading ? "..." : "Шукати"}
          </button>
          {list.length > 0 && (
            <button onClick={onDeleteAll} title="Видалити всі" className="h-10 w-10 rounded-full bg-white border border-black/10 hover:bg-[#FCE8E6] hover:border-[#FECACA] hover:text-[#B3261E] text-[#6E6E73] grid place-items-center transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-[#86868B] mt-2">Пошук по рахунку, ПІБ та адресі — з бази `meterReading` + `Subscriber` (показує ПІБ). Натисни Enter або «Шукати».</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Знайдено: {list.length}</h3>
          <span className="text-[11px] text-[#86868B]">{q ? `за запитом "${q}"` : "останні 100"}</span>
        </div>
        <div className="space-y-2">
          {list.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] border border-transparent hover:border-black/[0.06]">
              <div className="h-10 w-10 rounded-xl bg-[#E8F0FE] text-[#0B57D0] grid place-items-center shrink-0 font-bold text-[11px]">
                {m.account.slice(0,2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold break-words flex items-center gap-1.5">
                  <span className="truncate">Рахунок: {m.account}</span>
                  {m.fio ? (
                    <Link href={m.subscriberId ? `/admin/subscribers/${m.subscriberId}` : `/admin/subscribers?q=${m.account}`} title="Перейти до картки абонента" className="inline-flex items-center gap-1 text-[11px] font-normal text-[#1D1D1F] bg-white border border-black/10 px-2 py-0.5 rounded-full hover:bg-[#E8F0FE] hover:border-[#BFDBFE] hover:text-[#0B57D0] transition-colors">
                      <User className="h-3 w-3" />{m.fio}
                    </Link>
                  ) : null}
                </p>
                <p className="text-[11px] text-[#86868B] break-words flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>{new Date(m.createdAt).toLocaleDateString("uk-UA")} {new Date(m.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })} • {m.period || "—"} • {m.prev}→{m.curr} (+{m.diff} м³)</span>
                  {m.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{m.address}</span>}
                  {m.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span>}
                  {!m.fio && !m.address && <span className="text-[#B3261E]">ПІБ не вказано — додай в <a href="/admin/subscribers" className="underline">Абоненти</a> для цього рахунку</span>}
                </p>
              </div>
              <span className="hidden sm:inline-flex text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#137333]">+{m.diff} м³</span>
              <button onClick={()=>onDelete(m.id)} title="Видалити" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#FCE8E6] hover:border-[#FECACA] hover:text-[#B3261E] text-[#6E6E73] grid place-items-center transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!list.length && (
            <div className="py-4">
              <p className="text-[13px] text-[#86868B] text-center">Нічого не знайдено{q ? ` за "${q}"` : ""}. Спробуй інший рахунок або ПІБ.</p>
              <div className="mt-4 rounded-xl border border-black/10 bg-[#F5F5F7] p-4">
                <p className="text-[13px] font-semibold text-[#1D1D1F]">Не знайшло? Додай ПІБ вручну — для наступних внесень цією людиною покаже автоматично</p>
                <p className="text-[11px] text-[#86868B] mt-1">Вкажи, якщо знаєш хто це (напр. сусід, родич). Збережеться в окремій базі `Subscriber`.</p>
                <form onSubmit={onCreateSubscriber} className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold">Рахунок *</label>
                    <input value={addAccount} onChange={e=>setAddAccount(e.target.value.replace(/\D/g,""))} placeholder="56101" required pattern="\d{5,10}" inputMode="numeric" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[13px]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold">Прізвище *</label>
                    <input value={addLastName} onChange={e=>setAddLastName(e.target.value)} placeholder="Засадюк" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[13px]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold">Імʼя *</label>
                    <input value={addFirstName} onChange={e=>setAddFirstName(e.target.value)} placeholder="Олександр" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[13px]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold">По батькові</label>
                    <input value={addMiddleName} onChange={e=>setAddMiddleName(e.target.value)} placeholder="Костянтинович" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[13px]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold">Адреса (необовʼязково)</label>
                    <input value={addAddress} onChange={e=>setAddAddress(e.target.value)} placeholder="вул. ..." className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[13px]" />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-semibold hover:bg-[#0842A0]">Зберегти ПІБ для рахунку</button>
                    <a href="/admin/subscribers" className="ml-2 text-[12px] text-[#0B57D0] underline">Перейти в Абоненти →</a>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
