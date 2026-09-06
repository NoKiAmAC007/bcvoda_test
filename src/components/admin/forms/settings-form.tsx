"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  emergency: string; general: string; callCenter: string; address: string; director: string; email: string;
  youtube?: string | null; facebook?: string | null; cabinetPersonal?: string | null; cabinetLegal?: string | null; cabinetMap?: string | null;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange = (k: keyof Settings, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) { router.refresh(); alert("Збережено ✓"); }
    else alert("Помилка");
  };

  const Field = ({ label, k, placeholder }: { label: string; k: keyof Settings; placeholder?: string }) => (
    <div>
      <label className="text-[12px] font-semibold text-[#1D1D1F]">{label}</label>
      <input value={form[k] || ""} onChange={e=>onChange(k, e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-black/[0.06] px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 space-y-4">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Контакти — відображаються на головній, в шапці, BusinessHoursWidget та footer</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Аварійна (30-11-11)" k="emergency" placeholder="30-11-11" />
          <Field label="Загальна" k="general" placeholder="30-11-15" />
          <Field label="Call-центр (0-800...)" k="callCenter" placeholder="0-800-604-513" />
        </div>
        <Field label="Адреса" k="address" placeholder="09100, Київська обл., м. Біла Церква, вул. Сухоярська, 14" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Директор" k="director" placeholder="Тетяна Бойко" />
          <Field label="Email" k="email" placeholder="office@bcvoda.com.ua" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 space-y-4">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Кабінети та соцмережі</h3>
        <Field label="Кабінет фіз. осіб (my.bcvoda.com.ua)" k="cabinetPersonal" />
        <Field label="Кабінет юр. осіб" k="cabinetLegal" />
        <Field label="Карта комерційного обліку" k="cabinetMap" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="YouTube" k="youtube" />
          <Field label="Facebook" k="facebook" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-[#0842A0] disabled:opacity-50">{loading ? "Збереження..." : "Зберегти налаштування"}</button>
      <p className="text-[11px] text-[#86868B]">Зміни одразу відобразяться на головній (KPI, контакти, footer, карта — телефон 30-11-11).</p>
    </form>
  );
}
