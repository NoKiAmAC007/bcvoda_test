"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Droplets, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

function LoginForm() {
  const [email, setEmail] = useState("admin@bcvoda.com.ua");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/admin";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) setError("Невірний email або пароль");
    else if (res?.ok) window.location.href = callbackUrl;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a8a]/30"
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a8a]/30"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading} className="btn-water w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2">
        <Lock className="h-4 w-4" /> {loading ? "Вхід..." : "Увійти"}
      </button>
      <p className="text-xs text-slate-500 text-center">Демо: admin@bcvoda.com.ua / ShOnYVoDa</p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass rounded-[20px] p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#0e7a8a] to-[#1a9ab0] flex items-center justify-center text-white">
            <Droplets className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-extrabold text-[#0f2a3a]">Вхід в адмінку</h1>
            <p className="text-xs text-slate-500">БілоцерківВода CMS</p>
          </div>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-500">Завантаження...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
