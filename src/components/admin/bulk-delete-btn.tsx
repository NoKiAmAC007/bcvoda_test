"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function BulkDeleteButton({ endpoint, label }: { endpoint: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    if (!confirm(`Видалити ВСІ ${label}? Цю дію не можна скасувати.`)) return;
    if (!confirm(`Точно видалити всі ${label}?`)) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Помилка видалення");
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={`Видалити всі ${label}`}
      className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#FCE8E6] hover:border-[#FECACA] hover:text-[#B3261E] text-[#6E6E73] grid place-items-center transition-colors disabled:opacity-50 shrink-0"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
