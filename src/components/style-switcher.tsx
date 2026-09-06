"use client";
import { useEffect, useState } from "react";
import { Palette, Sparkles } from "lucide-react";

const themes = [
  { id: "apple", label: "Apple", color: "#007AFF" },
  { id: "material", label: "Material", color: "#6750A4" },
  { id: "brutalist", label: "Brutal", color: "#FFD60A" },
  { id: "glass", label: "Glass", color: "#30D5C8" },
  { id: "cyber", label: "Cyber", color: "#FF00FF" },
  { id: "minimal", label: "Minimal", color: "#111" },
  { id: "water", label: "Water", color: "#0e7a8a" },
];

export function StyleSwitcher() {
  const [theme, setTheme] = useState("apple");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bcvoda-theme") || "apple";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const set = (id: string) => {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("bcvoda-theme", id);
  };

  return (
    <div className="fixed bottom-4 left-4 lg:left-[260px] z-50 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="h-11 w-11 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
          title="Стилі та агенти"
        >
          <Palette className="h-5 w-5" />
        </button>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white border border-black/10 px-3 py-1.5 text-xs font-semibold shadow">
          <Sparkles className="h-3 w-3 text-[#007AFF]" /> {themes.find((t) => t.id === theme)?.label} • 8 агентів
        </span>
      </div>
      {open && (
        <div className="apple-card p-3 w-[220px] grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => set(t.id)}
              className={`rounded-xl p-3 text-left border transition ${theme === t.id ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "bg-[#F5F5F7] border-black/10 hover:bg-white"}`}
            >
              <span className="block h-3 w-3 rounded-full mb-1.5" style={{ background: t.color }} />
              <span className="block text-xs font-semibold">{t.label}</span>
              <span className="block text-[10px] opacity-60">агент {t.id}</span>
            </button>
          ))}
          <a href="/admin" className="col-span-2 rounded-xl bg-[#007AFF] text-white text-center py-2 text-xs font-semibold">Адмінка • всі агенти</a>
        </div>
      )}
    </div>
  );
}
