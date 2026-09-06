"use client";
import { useEffect, useState } from "react";
import { ImageUploader } from "./image-uploader";

type Slide = { id: string; title: string; imageUrl: string; link?: string | null };

export function HeroAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [title, setTitle] = useState("Новий слайд");
  const [url, setUrl] = useState("");

  const load = async () => {
    const res = await fetch("/api/hero");
    if (res.ok) setSlides(await res.json());
  };
  useEffect(() => { load(); }, []);

  const onUploaded = (u: string) => setUrl(u);

  const add = async () => {
    if (!url) return alert("Спочатку завантажте фото");
    const res = await fetch("/api/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, imageUrl: url }) });
    if (res.ok) { setUrl(""); setTitle("Новий слайд"); load(); }
    else alert("Помилка");
  };

  const del = async (id: string) => {
    if (!confirm("Видалити слайд?")) return;
    await fetch(`/api/hero?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="m3-card p-6">
      <h3 className="font-bold text-[#1C1B1F]">Фото на головну (Hero)</h3>
      <p className="text-xs text-[#49454F]">Кнопкою додай окреме фото на головну — воно зʼявиться в слайдері. Всі фото в папці public/uploads/bcvoda — незалежно від старого сайту.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {slides.map((s) => (
          <div key={s.id} className="rounded-xl overflow-hidden border border-black/10 bg-white">
            <img src={s.imageUrl} alt={s.title} className="h-32 w-full object-cover" />
            <div className="p-2 flex justify-between items-center">
              <span className="text-xs font-medium truncate">{s.title}</span>
              <button onClick={() => del(s.id)} className="text-xs text-red-600 hover:underline">×</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-semibold">Назва слайда</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs font-semibold">Фото (спочатку завантаж)</label>
          <div className="mt-1 flex gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/uploads/..." className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm" />
          </div>
        </div>
        <ImageUploader folder="hero" label="📷 Додати фото на головну" onUploaded={onUploaded} />
        <button onClick={add} className="rounded-full bg-[#0B57D0] text-white px-6 py-2 text-sm font-semibold">Додати слайд</button>
      </div>
      {url && <p className="mt-2 text-xs text-green-600">Готово: {url} — натисни Додати слайд</p>}
    </div>
  );
}
