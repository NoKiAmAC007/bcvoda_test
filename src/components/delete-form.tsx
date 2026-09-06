"use client";
import { useRef } from "react";

export function DeleteForm({ action, label = "Видалити?" }: { action: string; label?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={action}
      method="post"
      onSubmit={(e) => {
        if (!confirm(label)) e.preventDefault();
      }}
    >
      <input type="hidden" name="_method" value="DELETE" />
      <button type="submit" className="text-[11px] text-[#B3261E] font-medium hover:underline">
        Видалити
      </button>
    </form>
  );
}
