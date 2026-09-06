"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

type Ann = { title: string; body: string; href?: string };

const Ctx = createContext<{ open: (a: Ann) => void } | null>(null);

export function useAnnouncement() {
  const c = useContext(Ctx);
  if (!c) throw new Error("outside provider");
  return c;
}

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [ann, setAnn] = useState<Ann | null>(null);
  return (
    <Ctx.Provider value={{ open: setAnn }}>
      {children}
      {ann && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAnn(null)} />
          <div className="relative w-full max-w-lg m3-card p-6 animate-in">
            <button onClick={() => setAnn(null)} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10">
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-bold tracking-widest uppercase text-[#0B57D0]">Оголошення</p>
            <h3 className="mt-2 text-xl font-bold leading-tight">{ann.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#49454F]">{ann.body}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setAnn(null)} className="m3-fab px-6 py-2 text-sm">Зрозуміло</button>
              {ann.href && <a href={ann.href} className="rounded-full border border-black/10 px-6 py-2 text-sm font-medium hover:bg-black/5">Відкрити</a>}
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

// Обгортка щоб будь-який клік відкривав оголошення
export function ClickAnnouncement({ title, body, href, children, className }: { title: string; body: string; href?: string; children: ReactNode; className?: string }) {
  const { open } = useAnnouncement();
  return (
    <div onClick={() => open({ title, body, href })} className={className + " cursor-pointer"}>
      {children}
    </div>
  );
}
