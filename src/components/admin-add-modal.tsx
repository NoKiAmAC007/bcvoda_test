"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./image-uploader";
import { slugify } from "@/lib/slug";
import { RefreshCw } from "lucide-react";

export function AdminAddModal({ type }: { type: "news" | "event" | "report" }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const label = type === "news" ? "Новину" : type === "event" ? "Подію" : "Звіт";
  const endpoint = type === "news" ? "/api/news" : type === "event" ? "/api/events" : "/api/reports";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("Заповни заголовок і slug");
    setLoading(true);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, image, content: excerpt }),
    });
    setLoading(false);
    if (res.ok) {
      setTitle(""); setSlug(""); setExcerpt(""); setImage(""); setOpen(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Помилка");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="h-7 w-7 rounded-full bg-[#0B57D0] text-white flex items-center justify-center hover:bg-[#0842A0] text-lg leading-none" title={`Додати ${label.toLowerCase()}`}>+</button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={onSubmit} className="relative w-full max-w-lg m3-card p-6 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold">Додати {label.toLowerCase()}</h3>
            <p className="text-xs text-[#6E6E73]">Стиль як в редагуванні — SF Pro, 28px, Material 3</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold">Заголовок</label>
                <input value={title} onChange={(e) => { setTitle(e.target.value); const ns = slugify(e.target.value); if (!slug || slug === slugify(title)) setSlug(ns); }} placeholder="Напр. Шановні споживачі!" required className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold">Slug <span className="font-normal text-[#86868B]">(англ.)</span></label>
                <div className="flex gap-2 mt-1">
                  <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="slug-латиницею" required pattern="[a-z0-9-]+" lang="en" inputMode="text" autoComplete="off" spellCheck={false} className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
                  <button type="button" onClick={()=> title && setSlug(slugify(title))} title="Оновити з заголовка" className="h-[42px] w-11 shrink-0 rounded-xl border border-black/10 bg-white hover:bg-[#F5F5F7] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0]">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Короткий опис</label>
                <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="1-2 речення" className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold">Фото</label>
                <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/..." className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
                <div className="mt-2">
                  <ImageUploader folder={type} label="📷 Завантажити фото" onUploaded={setImage} />
                </div>
                {image && <img src={image} alt="preview" className="mt-2 h-32 w-auto rounded-xl border object-cover" />}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading} className="m3-fab px-6 py-2.5 text-sm disabled:opacity-50">{loading ? "..." : "Додати"}</button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold">Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
