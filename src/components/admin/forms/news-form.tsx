"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { slugify } from "@/lib/slug";
import { RefreshCw, Clock } from "lucide-react";

export function NewsCreateForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0,16));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("Заповни заголовок і slug");
    setLoading(true);
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content: content || excerpt, image, publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined }),
    });
    setLoading(false);
    if (res.ok) { setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setImage(""); router.refresh(); }
    else { const j = await res.json().catch(()=>({})); alert(j.error||"Помилка"); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Заголовок *</label>
          <input value={title} onChange={e=>{setTitle(e.target.value); const newSlug = slugify(e.target.value); if(!slug || slug===slugify(title)) setSlug(newSlug);}} placeholder="Напр. Шановні споживачі! Нові тарифи від 01.09.2026" required className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">Slug * <span className="font-normal text-[#86868B]">(англ.)</span></label>
            <div className="flex gap-2 mt-1">
              <input value={slug} onChange={e=>setSlug(slugify(e.target.value))} placeholder="shanovni-spozhivachi-8" required pattern="[a-z0-9-]+" lang="en" inputMode="text" autoComplete="off" spellCheck={false} className="flex-1 rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
              <button type="button" onClick={()=> title && setSlug(slugify(title))} title="Оновити з заголовка" className="h-[46px] w-11 shrink-0 rounded-xl border border-black/[0.06] bg-white hover:bg-[#F5F5F7] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0] transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1">Авто з заголовка — латиниця, вводиться англійською</p>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">Дата публікації</label>
            <div className="flex gap-2 mt-1">
              <input type="datetime-local" value={publishedAt} onChange={e=>setPublishedAt(e.target.value)} className="flex-1 rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
              <button type="button" onClick={() => setPublishedAt(new Date().toISOString().slice(0,16))} title="Поточний час" className="h-[46px] w-11 shrink-0 rounded-xl border border-black/[0.06] bg-white hover:bg-[#F5F5F7] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0] transition-colors" aria-label="Поточний час">
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Короткий опис (excerpt)</label>
          <input value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="1-2 речення для картки на головній" className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Текст</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Повний текст новини..." />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Зображення</label>
          <input value={image} onChange={e=>setImage(e.target.value)} placeholder="/uploads/bcvoda/..." className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
          <div className="mt-2 flex items-center gap-3">
            <ImageUploader folder="news" label="📷 Завантажити" onUploaded={setImage} />
            {image && <span className="text-[11px] text-[#2E7D32]">✓ завантажено</span>}
          </div>
          {image && <img src={image} alt="preview" className="mt-3 h-40 w-full max-w-sm rounded-xl border border-black/10 object-cover" />}
        </div>
      </div>
      <button type="submit" disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#0842A0] disabled:opacity-50">{loading ? "Збереження..." : "Створити новину"}</button>
    </form>
  );
}

export function NewsEditForm({ initial }: { initial: { id: string; title: string; slug: string; excerpt: string | null; content: string; image: string | null; publishedAt: string } }) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt || "");
  const [content, setContent] = useState(initial.content);
  const [image, setImage] = useState(initial.image || "");
  const [publishedAt, setPublishedAt] = useState(() => {
    try { return new Date(initial.publishedAt).toISOString().slice(0,16); } catch { return new Date().toISOString().slice(0,16); }
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/news/${initial.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, image, publishedAt: new Date(publishedAt).toISOString() }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin/news");
    else { const j = await res.json().catch(()=>({})); alert(j.error||"Помилка"); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-[12px] font-semibold text-[#1D1D1F]">Заголовок *</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Slug * <span className="font-normal text-[#86868B]">(англ.)</span></label>
          <div className="flex gap-2 mt-1">
            <input value={slug} onChange={e=>setSlug(slugify(e.target.value))} required pattern="[a-z0-9-]+" lang="en" inputMode="text" autoComplete="off" spellCheck={false} className="flex-1 rounded-xl border border-black/[0.06] px-4 py-3 text-[13px]" />
            <button type="button" onClick={()=> title && setSlug(slugify(title))} title="Оновити з заголовка" className="h-[46px] w-11 shrink-0 rounded-xl border border-black/[0.06] bg-white hover:bg-[#F5F5F7] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0] transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Дата</label>
          <div className="flex gap-2 mt-1">
            <input type="datetime-local" value={publishedAt} onChange={e=>setPublishedAt(e.target.value)} className="flex-1 rounded-xl border border-black/[0.06] px-4 py-3 text-[13px]" />
            <button type="button" onClick={() => setPublishedAt(new Date().toISOString().slice(0,16))} title="Поточний час" className="h-[46px] w-11 shrink-0 rounded-xl border border-black/[0.06] bg-white hover:bg-[#F5F5F7] grid place-items-center text-[#6E6E73] hover:text-[#0B57D0] transition-colors" aria-label="Поточний час">
              <Clock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <label className="text-[12px] font-semibold text-[#1D1D1F]">Короткий опис</label>
        <input value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px]" />
      </div>
      <div>
        <label className="text-[12px] font-semibold text-[#1D1D1F]">Текст</label>
        <RichTextEditor value={content} onChange={setContent} placeholder="Повний текст новини..." minHeight={180} />
      </div>
      <div>
        <label className="text-[12px] font-semibold text-[#1D1D1F]">Зображення</label>
        <input value={image} onChange={e=>setImage(e.target.value)} placeholder="/uploads/..." className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px]" />
        <div className="mt-2 flex items-center gap-3">
          <ImageUploader folder="news" label="📷 Змінити фото" onUploaded={setImage} />
          {image && <span className="text-[11px] text-[#2E7D32]">✓</span>}
        </div>
        {image && <img src={image} alt="preview" className="mt-3 h-48 w-full max-w-md rounded-xl border object-cover" />}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#0842A0] disabled:opacity-50">{loading ? "Збереження..." : "Зберегти"}</button>
        <a href="/admin/news" className="rounded-full border border-black/10 px-6 py-2.5 text-[13px] font-semibold">Назад</a>
      </div>
    </form>
  );
}
