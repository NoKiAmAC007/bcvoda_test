"use client";
import { useEffect, useState } from "react";
import { WaterLiveIndicator } from "@/components/water-live-indicator";

// Останній звіт з папки сайту — показуємо як текст, поки дані ще вантажаться
const LATEST_PDF = "/reports/quality/pitna/Zvedeni-dani-serpen-RCHV.pdf";

export function QualityWidget() {
  const [data, setData] = useState({ pH: 7.3, chlorine: 0.28, hardness: 2.1, turbidity: 0.12 });
  const [reportMonth, setReportMonth] = useState<string>("—");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [lastCheck, setLastCheck] = useState<string>("");

  const fetchData = async () => {
    // Два джерела: адмін-панель (ручні показники) + daily.json (звіти з оф. сайту).
    // Зливаємо: цифри — з адмінки, місяць звіту/PDF — з daily.json (там свіже з bcvoda.com.ua).
    let admin: any = null;
    try {
      const r1 = await fetch("/api/water-quality/current");
      if (r1.ok) admin = await r1.json();
    } catch {}
    let daily: any = null;
    try {
      const res = await fetch("/data/daily.json");
      daily = await res.json();
    } catch {}
    const dq = daily?.data?.quality;

    if (admin && typeof admin.pH === "number") {
      setData({
        pH: admin.pH ?? 7.3,
        chlorine: admin.chlorine ?? 0.28,
        hardness: admin.hardness ?? 2.1,
        turbidity: admin.turbidity ?? 0.12,
      });
    } else if (dq) {
      setData({
        pH: dq.pH ?? 7.3,
        chlorine: dq.chlorine ?? 0.28,
        hardness: dq.hardness ?? 2.1,
        turbidity: dq.turbidity ?? 0.12,
      });
    }
    setReportMonth(admin?.reportMonth || dq?.reportMonth || "—");
    if (dq?.pdfUrl || admin?.pdfUrl) setPdfUrl(dq?.pdfUrl || admin.pdfUrl);
    setLastCheck(admin?.updatedAt || daily?.checkedAt || dq?.lastCheck || "");
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const m = [
    { l: "pH", v: String(data.pH), n: "6.5–8.5", p: Math.min(100, (data.pH / 8.5) * 100) },
    { l: "Хлор", v: String(data.chlorine), n: "≤0.5", p: (data.chlorine / 0.5) * 100 },
    { l: "Жорсткість", v: String(data.hardness), n: "≤7", p: (data.hardness / 7) * 100 },
    { l: "Каламутність", v: String(data.turbidity), n: "≤1.0", p: (data.turbidity / 1) * 100 },
  ];

  return (
    <div className="m3-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-[19px] font-semibold">Якість води</h3>
        <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          щомісячний звіт
        </span>
      </div>
      <div className="mt-2 flex justify-center">
        <WaterLiveIndicator lastUpdated={lastCheck} />
      </div>
      <p className="text-[12px] text-[#6E6E73] mt-1 text-center">
        {reportMonth !== "—" ? (
          <>Дані звіту за <span className="font-medium text-[#1D1D1F]">{reportMonth}</span></>
        ) : (
          <span className="font-bold text-[#1D1D1F]">Звіт за серпень 2026 (PDF)</span>
        )}
      </p>
      <p className="text-[11px] text-[#86868B] mt-1 text-center">
        <a href={pdfUrl || LATEST_PDF} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0B57D0]">
          Переглянути протокол (PDF)
        </a>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 flex-1 content-evenly">
        {m.map((x) => (
          <div key={x.l} className="rounded-xl bg-[#F5F5F7] p-3">
            <p className="text-[11px] text-[#6E6E73]">{x.l}</p>
            <p className="text-[15px] font-semibold">{x.v}</p>
            <p className="text-[10px] text-[#86868B]">{x.n}</p>
            <div className="mt-2 h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-[#0B57D0]" style={{ width: `${Math.min(100, x.p)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
