"use client";
import { useState, useRef } from "react";

export function ImageUploader({
  folder = "bcvoda",
  onUploaded,
  label = "Додати фото",
}: {
  folder?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      alert("Помилка завантаження");
      return;
    }
    const data = await res.json();
    onUploaded(data.url);
    // keep preview as local url, but parent will set final url
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-sm font-semibold hover:bg-[#0842A0] disabled:opacity-60">
        {uploading ? "Завантаження..." : label}
      </button>
      {preview && <img src={preview} alt="preview" className="mt-2 h-32 w-auto rounded-xl border border-black/10 object-cover" />}
    </div>
  );
}
