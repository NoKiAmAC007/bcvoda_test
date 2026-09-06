"use client";
import { useEffect, useState } from "react";

export function WaterLiveIndicator({ lastUpdated }: { lastUpdated?: string }) {
  const [time, setTime] = useState<string>(lastUpdated || "");

  useEffect(() => {
    if (lastUpdated) {
      try {
        const d = new Date(lastUpdated);
        setTime(d.toLocaleString("uk-UA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }));
      } catch {
        setTime(lastUpdated);
      }
    } else {
      setTime(new Date().toLocaleString("uk-UA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }));
    }
  }, [lastUpdated]);

  return (
    <span className="inline-flex items-center gap-2 text-[11px]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32] animate-pulse" />
      </span>
      <span className="font-bold tracking-widest text-[#2E7D32]">LIVE</span>
      {time && <span className="text-[#6E6E73] font-medium">• оновлено {time}</span>}
    </span>
  );
}
