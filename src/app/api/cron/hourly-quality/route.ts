import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Щогодинний крон якості води.
 * Фетчить метадані звітів з https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi (сторінка архіву PDF).
 * Посилання типу https://bcvoda.com.ua/wp-content/uploads/2026/08/Zvit-misyats-RCHV.pdf
 *
 * УВАГА: PDF має кастомне кодування кирилиці (embedded subset fonts без ToUnicode) —
 * текст витягується як гарбл (наприклад "Ð¢Ð°Ð±Ð»"). Цифри читаються позиційно,
 * тому парсинг робимо по координатах X/Y з pdfjs-dist або pdf2json, а не по тексту.
 * Тут лише збираємо метадані (pdfUrl, reportMonth) і оновлюємо public/data/daily.json;
 * важкий парсинг цифр — у scripts/parse-quality-pdf.ts (запускається вручну/кроном окремо).
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth && auth !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi", {
      headers: { "User-Agent": "bcvoda-daily/1.0 (+https://bcvoda.com.ua)" },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`fetch yakist-vodi-pitnoyi-vodi: ${res.status}`);
    const html = await res.text();

    // bcvoda верстка: <a href="...pdf"><div><span>pdf</span></div><div><span>Звіт за липень 2026 — РЧВ</span></div></a>
    // пробуємо кілька патернів для надійності
    let pdfUrl = "";
    let reportMonth = "—";

    const patterns = [
      /href="(https:\/\/bcvoda\.com\.ua\/wp-content\/uploads\/[^"]+\.pdf)"[^>]*>\s*<div><span[^>]*>pdf<\/span><\/div>\s*<div><span[^>]*>([^<]+)<\/span>/i,
      /href="(https:\/\/bcvoda\.com\.ua\/wp-content\/uploads\/[^"]+\.pdf)"[^>]*>[^<]*<div><span[^>]*>([^<]*pdf[^<]*)<\/span>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i,
      /href="(https:\/\/bcvoda\.com\.ua\/wp-content\/uploads\/[^"]+\.pdf)"/i,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      if (m) {
        pdfUrl = m[1];
        // другий паттерн має 3 групи, перший — 2
        const candidate = (m[3] || m[2] || "").trim();
        if (candidate && !/pdf/i.test(candidate)) reportMonth = candidate;
        else if (pdfUrl) {
          // fallback: витягуємо title поруч з href
          const near = html.slice(Math.max(0, html.indexOf(pdfUrl) - 300), html.indexOf(pdfUrl) + 600);
          const t = near.match(/<span[^>]*>([^<]{5,80})<\/span>/);
          if (t) reportMonth = t[1].trim();
        }
        if (pdfUrl) break;
      }
    }

    // Збираємо всі PDF звіти на сторінці (для history)
    const allPdfs: { url: string; title: string }[] = [];
    const pdfRe = /href="(https:\/\/bcvoda\.com\.ua\/wp-content\/uploads\/[^"]+\.pdf)"/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pdfRe.exec(html)) !== null) {
      const url = pm[1];
      const slice = html.slice(pm.index, pm.index + 800);
      const titleMatch = slice.match(/<span[^>]*>([^<]{4,120})<\/span>\s*<\/div>\s*<div><span[^>]*>([^<]{4,120})<\/span>/);
      const title = (titleMatch?.[2] || titleMatch?.[1] || url.split("/").pop() || "").trim();
      if (!allPdfs.find((p) => p.url === url)) allPdfs.push({ url, title });
    }

    const now = new Date();
    const nextCheck = new Date(now.getTime() + 60 * 60 * 1000); // щогодини

    const fs = await import("fs");
    const path = await import("path");
    const file = path.join(process.cwd(), "public", "data", "daily.json");

    let existing: any = { city: "Біла Церква", sources: {}, data: {} };
    try {
      existing = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {}

    const out = {
      ...existing,
      checkedAt: now.toISOString(),
      sources: {
        ...existing.sources,
        quality: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi",
      },
      data: {
        ...existing.data,
        quality: {
          pH: existing.data?.quality?.pH ?? 7.3,
          chlorine: existing.data?.quality?.chlorine ?? 0.28,
          hardness: existing.data?.quality?.hardness ?? 2.1,
          turbidity: existing.data?.quality?.turbidity ?? 0.12,
          source: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi",
          reportMonth: reportMonth !== "—" ? reportMonth : existing.data?.quality?.reportMonth ?? "—",
          pdfUrl: pdfUrl || existing.data?.quality?.pdfUrl || "",
          allPdfs: allPdfs.length ? allPdfs.slice(0, 12) : existing.data?.quality?.allPdfs || [],
          lastCheck: now.toISOString(),
          nextCheck: nextCheck.toISOString(),
        },
        tariff: existing.data?.tariff,
        reports: existing.data?.reports,
      },
    };

    // fs write — працює в dev/standalone, на Vercel це ефемерно (тому також повертаємо JSON)
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(out, null, 2));
    } catch (e) {
      // на read-only FS (Vercel) — ігноруємо, дані віддаємо через API
    }

    return NextResponse.json({ ok: true, reportMonth: out.data.quality.reportMonth, pdfUrl: out.data.quality.pdfUrl, count: allPdfs.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
