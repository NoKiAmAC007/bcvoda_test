"use client";
import { useState, useMemo } from "react";
import { Search, FileText, ExternalLink } from "lucide-react";

type Doc = { id: string; title: string; fileUrl: string; category: string };

export function NormativniClient({ docs, initialQ = "", initialCat = "Всі" }: { docs: Doc[]; initialQ?: string; initialCat?: string }) {
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(docs.map((d) => d.category)));
    return ["Всі", ...cats];
  }, [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const matchCat = cat === "Всі" || d.category === cat;
      const matchQ = !q || d.title.toLowerCase().includes(q.toLowerCase()) || d.category.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [docs, q, cat]);

  return (
    <div className="mt-6">
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук по назві..." className="w-full rounded-xl border border-black/10 pl-9 pr-4 py-2.5 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold border ${cat === c ? "bg-[#0B57D0] text-white border-[#0B57D0]" : "bg-white border-black/10 hover:bg-black/5"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-8 text-center text-sm text-[#6E6E73]">Нічого не знайдено</div>
        ) : (
          filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-black/[0.06] p-4 flex items-center justify-between gap-4 hover:shadow-sm transition">
              <div className="flex gap-3 min-w-0">
                <span className="h-9 w-9 rounded-xl bg-[#F5F5F7] flex items-center justify-center shrink-0"><FileText className="h-4 w-4 text-[#0B57D0]" /></span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#1D1D1F] leading-tight truncate sm:whitespace-normal">{d.title}</p>
                  <span className="inline-flex mt-1 rounded-full bg-[#E8DEF8] px-2 py-0.5 text-[11px] font-medium text-[#6750A4]">{d.category}</span>
                </div>
              </div>
              <a href={d.fileUrl} target={d.fileUrl !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold ${d.fileUrl !== "#" ? "bg-[#0B57D0] text-white hover:bg-[#0842A0]" : "bg-[#F5F5F7] text-[#6E6E73]"}`}>
                {d.fileUrl !== "#" ? <>PDF <ExternalLink className="h-3 w-3" /></> : "—"}
              </a>
            </div>
          ))
        )}
      </div>
      <p className="mt-3 text-[11px] text-[#86868B]">Знайдено: {filtered.length} з {docs.length}</p>
    </div>
  );
}
