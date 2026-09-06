"use client";
import { useState } from "react";
import { ImageUploader } from "./image-uploader";

export function NewsEditForm({ id, initial }: { id: string; initial: { title: string; slug: string; excerpt: string | null; image: string | null; content: string } }) {
  const [image, setImage] = useState(initial.image || "");
  return (
    <form action={`/api/news/${id}`} method="post" className="mt-6 space-y-4 m3-card p-6">
      <div>
        <label className="text-sm font-semibold">Заголовок</label>
        <input name="title" defaultValue={initial.title} required className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-sm font-semibold">Slug</label>
        <input name="slug" defaultValue={initial.slug} required className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-sm font-semibold">Короткий опис</label>
        <input name="excerpt" defaultValue={initial.excerpt || ""} className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-sm font-semibold">Фото новини</label>
        <div className="mt-1 flex gap-3 items-end">
          <input name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/..." className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        </div>
        <div className="mt-2 flex gap-3 items-center">
          <ImageUploader folder="news" label="📷 Додати фото в новину" onUploaded={setImage} />
          {image && <span className="text-xs text-green-600">Готово: {image}</span>}
        </div>
        {image && <img src={image} alt="preview" className="mt-3 h-40 w-auto rounded-xl border border-black/10 object-cover" />}
      </div>
      <div className="flex gap-3">
        <button type="submit" className="m3-fab px-8 py-2.5 text-sm">Зберегти</button>
        <a href="/admin" className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold hover:bg-black/5">Скасувати</a>
      </div>
    </form>
  );
}
