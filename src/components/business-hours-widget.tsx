"use client";
import { useEffect, useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/data";

function isOpenNow(date = new Date()) {
  const day = date.getDay(); // 0 Sun - 6 Sat
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const total = hours * 60 + minutes;
  const isWeekday = day >= 1 && day <= 5;
  const open = 8 * 60;
  const close = 17 * 60;
  return isWeekday && total >= open && total < close;
}

export function BusinessHoursWidget() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d);
      setOpen(isOpenNow(d));
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-[0_1px_3px_#00000014]">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-[#0B57D0]" /> Ми працюємо</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${open ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          <span className={`h-2 w-2 rounded-full ${open ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
          {open ? "Відкрито" : "Зачинено"} • {timeStr}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-[#6E6E73]">Пн–Пт 8:00–17:00 • Сб–Нд вихідний • {open ? "Зараз приймаємо дзвінки" : "Відкриємось о 8:00 у будні"}</p>

      <div className="mt-4 space-y-3">
        <div className="flex gap-3 rounded-xl bg-[#F5F5F7] p-3">
          <MapPin className="h-4 w-4 text-[#6E6E73] mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-[#86868B]">Адреса</p>
            <p className="text-[13px] font-medium text-[#1D1D1F]">{siteConfig.contacts.address}</p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contacts.address)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0B57D0] hover:underline">Відкрити на карті →</a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <a href={`tel:${siteConfig.contacts.emergency.replace(/[^0-9+]/g, "")}`} className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 hover:bg-[#F5F5F7] transition">
            <span className="flex items-center gap-2 text-[13px] font-semibold"><Phone className="h-4 w-4 text-[#0B57D0]" /> Аварійна {siteConfig.contacts.emergency}</span>
            <span className="text-[11px] font-medium text-[#0B57D0]">Подзвонити</span>
          </a>
          <a href={`tel:${siteConfig.contacts.callCenter.replace(/[^0-9+]/g, "")}`} className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 hover:bg-[#F5F5F7] transition">
            <span className="flex items-center gap-2 text-[13px] font-semibold"><Phone className="h-4 w-4 text-[#6750A4]" /> Call-центр {siteConfig.contacts.callCenter}</span>
            <span className="text-[11px] font-medium text-[#0B57D0]">Подзвонити</span>
          </a>
          <a href={`mailto:${siteConfig.contacts.email}`} className="text-center rounded-xl bg-[#F5F5F7] px-4 py-2 text-[12px] font-medium text-[#1D1D1F] hover:bg-black/5">{siteConfig.contacts.email}</a>
        </div>
      </div>
    </div>
  );
}
