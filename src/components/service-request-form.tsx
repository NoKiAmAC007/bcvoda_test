"use client";
import { useState, useRef } from "react";
import { Paperclip, X, FileUp, Send } from "lucide-react";

type Props = {
  defaultType?: string;
};

const typeOptions = [
  { value: "connection", label: "Підключення" },
  { value: "tech", label: "Технічні умови" },
  { value: "meter", label: "Повірка лічильника" },
  { value: "complaint", label: "Скарга" },
  { value: "reception", label: "Прийом громадян" },
  { value: "other", label: "Інше" },
];

export function ServiceRequestForm({ defaultType = "other" }: Props) {
  const initialType = typeOptions.some((o) => o.value === defaultType) ? defaultType : "other";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState(initialType);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!phone.trim()) return "Телефон обовʼязковий";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Невірний формат email";
    if (!name.trim()) return "Вкажіть ПІБ";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const file = fileRef.current?.files?.[0];
      // Use JSON unless file present — for simplicity send JSON, log file name
      const payload: Record<string, unknown> = { name, phone, email, address, type, message, fileName: file?.name || null };
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка відправки");
      setToast("Заявку відправлено!");
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setMessage("");
      setFileName(null);
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setToast(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Не вдалося відправити";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-8">
      <h3 className="text-[18px] font-semibold tracking-tight text-[#1D1D1F]">Подати заявку онлайн</h3>
      <p className="text-[13px] text-[#6E6E73] mt-1">Заповніть форму — ми звʼяжемось протягом робочого дня. Поля з * обовʼязкові.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">ПІБ *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Іваненко Іван Іванович" className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">Телефон *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 XX XXX XX XX" required className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" type="email" className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white" />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1D1D1F]">Адреса</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="м. Біла Церква, вул. ..." className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white" />
          </div>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Тип заявки</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20">
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Повідомлення</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Опишіть суть звернення..." rows={4} className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 bg-white resize-none" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#1D1D1F]">Документи (опціонально)</label>
          <input
            ref={fileRef}
            id="srf-file"
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
          />
          {!fileName ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1 w-full rounded-2xl border-2 border-dashed border-[#0B57D0]/30 bg-[#F8FAFF] px-4 py-5 flex items-center justify-center gap-3 text-[#0B57D0] hover:border-[#0B57D0] hover:bg-[#E3F2FD] transition"
            >
              <span className="h-10 w-10 rounded-2xl bg-[#0B57D0] text-white grid place-items-center shrink-0">
                <FileUp className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-[14px] font-bold">Прикріпити документ</span>
                <span className="block text-[12px] font-normal opacity-70">Натисни або перетягни файл сюди</span>
              </span>
            </button>
          ) : (
            <div className="mt-1 w-full rounded-2xl border border-[#0B57D0]/20 bg-[#E3F2FD] px-4 py-3 flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-[#0B57D0] text-white grid place-items-center shrink-0">
                <Paperclip className="h-5 w-5" />
              </span>
              <span className="flex-1 min-w-0 text-[13px] font-semibold text-[#1D1D1F] truncate">{fileName}</span>
              <button
                type="button"
                onClick={() => { setFileName(null); if (fileRef.current) fileRef.current.value = ""; }}
                title="Прибрати файл"
                className="h-8 w-8 rounded-full bg-white grid place-items-center text-[#6E6E73] hover:text-[#B3261E] hover:bg-red-50 transition shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {error && <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="group w-full rounded-2xl bg-gradient-to-r from-[#0B57D0] to-[#084298] text-white px-8 py-4 text-[15px] font-bold hover:shadow-[0_8px_24px_rgba(11,87,208,0.35)] disabled:opacity-60 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2.5"
        >
          {loading ? (
            "Відправка..."
          ) : (
            <>
              <Send className="h-4.5 w-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              Відправити заявку
            </>
          )}
        </button>
      </form>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-in fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
