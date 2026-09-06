"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets, Waves } from "lucide-react";
import { heroSlides, usp } from "@/lib/data";

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[idx];

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r.slice(-3), { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((v) => v.id !== id)), 900);
  };

  return (
    <section>
      <div
        onClick={addRipple}
        className="relative overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_16px_48px_rgba(14,122,138,0.25),0_4px_12px_rgba(0,0,0,0.12)] cursor-pointer select-none"
      >
        <div className="relative h-[340px] sm:h-[440px] lg:h-[500px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
          {/* water tint + gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a3a]/85 via-[#0e7a8a]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-[#0e7a8a]/20" />
          {/* shimmer line як відблиск води */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute -inset-x-1/2 top-[38%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[0.5px] wave-1" />
          </div>

          {/* ripples по кліку */}
          {ripples.map((r) => (
            <span key={r.id} className="ripple absolute h-20 w-20 -ml-10 -mt-10 rounded-full border-2 border-white/50 pointer-events-none" style={{ left: r.x, top: r.y }} />
          ))}

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              <Waves className="h-3.5 w-3.5" /> Біла Церква • Рось
            </div>
            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] max-w-2xl leading-tight">
              {slide.title}
            </h1>
            <Link
              href={slide.href}
              className="btn-water mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white"
            >
              <Droplets className="h-4 w-4" /> Детальніше
            </Link>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i - 1 + heroSlides.length) % heroSlides.length);
            }}
            aria-label="Назад"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-white/50 hover:bg-white flex items-center justify-center shadow-lg transition"
          >
            <ChevronLeft className="h-5 w-5 text-slate-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i + 1) % heroSlides.length);
            }}
            aria-label="Вперед"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-white/50 hover:bg-white flex items-center justify-center shadow-lg transition"
          >
            <ChevronRight className="h-5 w-5 text-slate-800" />
          </button>

          <div className="absolute bottom-4 right-6 sm:right-10 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                aria-label={`Слайд ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-7 bg-white shadow" : "w-2 bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {usp.map((u) => (
          <div key={u.title} className="glass rounded-2xl p-5 flex gap-3 items-start hover:shadow-[0_8px_24px_rgba(14,122,138,0.12)] transition-shadow">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0e7a8a] to-[#1a9ab0] text-white flex items-center justify-center shrink-0 shadow-md">
              <Droplets className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold leading-snug text-slate-800">{u.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
