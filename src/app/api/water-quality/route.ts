import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Мок історія 6 місяців — реалістичні значення в межах ДСанПіН
const MOCK_HISTORY = [
  { month: "Січ 2026", label: "Січ", pH: 7.2, turbidity: 0.14, chlorine: 0.26, hardness: 2.0 },
  { month: "Лют 2026", label: "Лют", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
  { month: "Бер 2026", label: "Бер", pH: 7.4, turbidity: 0.11, chlorine: 0.3, hardness: 2.2 },
  { month: "Кві 2026", label: "Кві", pH: 7.35, turbidity: 0.13, chlorine: 0.27, hardness: 2.0 },
  { month: "Тра 2026", label: "Тра", pH: 7.25, turbidity: 0.1, chlorine: 0.25, hardness: 1.9 },
  { month: "Чер 2026", label: "Чер", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
  { month: "Лип 2026", label: "Лип", pH: 7.32, turbidity: 0.11, chlorine: 0.29, hardness: 2.15 },
  { month: "Сер 2026", label: "Сер", pH: 7.3, turbidity: 0.12, chlorine: 0.28, hardness: 2.1 },
];

export async function GET() {
  let latest: any = null;
  let lastUpdated: string | null = null;
  try {
    const file = path.join(process.cwd(), "public", "data", "daily.json");
    const raw = fs.readFileSync(file, "utf-8");
    const j = JSON.parse(raw);
    latest = j.data?.quality ?? null;
    lastUpdated = j.checkedAt || j.data?.quality?.lastCheck || null;
  } catch {}

  // якщо є свіжі дані — підміняємо останній місяць
  const history = [...MOCK_HISTORY];
  if (latest && typeof latest.pH === "number") {
    history[history.length - 1] = {
      ...history[history.length - 1],
      pH: latest.pH,
      turbidity: latest.turbidity ?? history[history.length - 1].turbidity,
      chlorine: latest.chlorine ?? history[history.length - 1].chlorine,
      hardness: latest.hardness ?? history[history.length - 1].hardness,
      month: latest.reportMonth || history[history.length - 1].month,
    };
  }

  return NextResponse.json(
    {
      history,
      latest,
      lastUpdated,
      norms: { pH: "6.5–8.5", turbidity: "≤1.0", chlorine: "≤0.5", hardness: "≤7" },
      source: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
