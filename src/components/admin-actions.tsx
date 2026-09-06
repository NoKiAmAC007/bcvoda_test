"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminActions({ type, id, slug }: { type: "news" | "event" | "report"; id: string; slug: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const editHref = `/admin/${type === "news" ? "news" : type === "event" ? "events" : "reports"}/${id}`;
  const viewHref = `/${type === "news" ? "news" : type === "event" ? "events" : "reports"}/${slug}`;

  const onDelete = async () => {
    if (!confirm("Видалити? Відновити неможливо.")) return;
    setLoading(true);
    const res = await fetch(`/api/${type === "news" ? "news" : type === "event" ? "events" : "reports"}/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Помилка видалення");
  };

  return (
    <div className="mt-2 flex gap-2">
      <Link href={editHref} className="rounded-full bg-[#0B57D0] text-white px-3 py-1 text-xs font-semibold hover:bg-[#0842A0]">
        Редагувати
      </Link>
      <a href={viewHref} target="_blank" className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50">
        Перегляд
      </a>
      <button onClick={onDelete} disabled={loading} className="rounded-full bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-xs font-semibold hover:bg-red-100 disabled:opacity-50">
        {loading ? "..." : "Видалити"}
      </button>
    </div>
  );
}
