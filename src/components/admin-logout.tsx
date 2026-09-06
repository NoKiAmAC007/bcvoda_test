"use client";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-bold hover:bg-slate-50">
      Вийти
    </button>
  );
}
