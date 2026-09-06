"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bcvoda-theme-mode");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "apple");
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "apple");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bcvoda-theme-mode", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Світла тема" : "Темна тема"}
      title={dark ? "Світла тема" : "Темна тема"}
      className="h-10 w-10 rounded-full bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition shadow-sm"
    >
      {dark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-[#1D1D1F]" />}
    </button>
  );
}
