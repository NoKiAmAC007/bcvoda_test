"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

// Синтезує краплю через Web Audio — без зовнішніх mp3
function playDroplet(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // основний тон краплі
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200;
  filter.Q.value = 1.2;

  osc.type = "sine";
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.9, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.62);

  // другий "бульк" для реалізму
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(420, now + 0.06);
  osc2.frequency.exponentialRampToValueAtTime(180, now + 0.4);
  gain2.gain.setValueAtTime(0, now + 0.06);
  gain2.gain.linearRampToValueAtTime(volume * 0.35, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.06);
  osc2.stop(now + 0.55);
}

export function WaterSoundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const prevPath = useRef(pathname);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // грати при зміні маршруту
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (!mutedRef.current) {
        try {
          const ctx = getCtx();
          playDroplet(ctx, 0.45);
        } catch {}
      }
      // візуальна брижа
      const id = Date.now();
      setRipples((r) => [...r.slice(-2), { id, x: 50 + Math.random() * 20, y: 18 }]);
      setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 800);
    }
  }, [pathname, getCtx]);

  // ВСЕ клікабельно — кожен клік дає краплю + ripple (як просили "щоб все було клікательно")
  useEffect(() => {
    let last = 0;
    const onClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 180) return;
      last = now;
      if (!mutedRef.current) {
        try {
          playDroplet(getCtx(), 0.18);
        } catch {}
      }
      // візуальна крапля в точці кліку — все клікабельно
      const id = Date.now() + Math.random();
      const x = e.clientX;
      const y = e.clientY;
      const el = document.createElement("span");
      el.className = "ripple fixed h-12 w-12 -ml-6 -mt-6 rounded-full border border-[#007AFF]/30 pointer-events-none z-[99]";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [getCtx]);

  // unlock audio на першому взаємодії (політика браузера)
  useEffect(() => {
    const unlock = () => {
      try {
        getCtx();
      } catch {}
      document.removeEventListener("pointerdown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    return () => document.removeEventListener("pointerdown", unlock);
  }, [getCtx]);

  const toggle = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (!mutedRef.current) {
      try {
        playDroplet(getCtx(), 0.4);
      } catch {}
    }
  };

  return (
    <>
      {children}
      {/* візуальні брижі при переході */}
      <div className="pointer-events-none fixed top-[72px] left-0 right-0 h-0 z-[60]">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple absolute h-16 w-16 -ml-8 rounded-full border border-[#0e7a8a]/30"
            style={{ left: `${r.x}%`, top: r.y }}
          />
        ))}
      </div>

      {/* перемикач звуку */}
      <button
        onClick={toggle}
        aria-label={muted ? "Увімкнути звук краплі" : "Вимкнути звук"}
        title={muted ? "Звук вимкнено" : "Звук краплі при переході"}
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-lg hover:bg-white text-slate-700 transition"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-[#0e7a8a]" />}
      </button>
    </>
  );
}
