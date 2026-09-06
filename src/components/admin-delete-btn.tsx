"use client"
import { useRef } from "react";
import { Trash2 } from "lucide-react";

export function DeleteForm({ action, iconOnly }: { action: string; iconOnly?: boolean }) {
  const ref = useRef<HTMLFormElement>(null);
  if (iconOnly) {
    return (
      <form
        ref={ref}
        action={action}
        method="post"
        onSubmit={(e) => { if (!confirm("Видалити?")) e.preventDefault(); }}
      >
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" title="Видалити" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#FCE8E6] hover:border-[#FECACA] hover:text-[#B3261E] text-[#6E6E73] grid place-items-center transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    );
  }
  return (
    <form
      ref={ref}
      action={action}
      method="post"
      onSubmit={(e) => { if (!confirm("Видалити?")) e.preventDefault(); }}
    >
      <input type="hidden" name="_method" value="DELETE" />
      <button type="submit" className="rounded-full bg-[#B3261E] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#B3261E]/90 flex items-center gap-2">
        <Trash2 className="h-4 w-4" />
        Видалити
      </button>
    </form>
  );
}
