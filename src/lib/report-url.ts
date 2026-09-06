import fs from "fs";
import path from "path";

/**
 * Пряме посилання на звіт: локальний файл з папки сайту (/reports/quality/...),
 * якщо він фізично існує; інакше — оригінал на bcvoda.com.ua.
 * (На serverless-хостингу рантайм-запис ефемерний — там спрацює фолбек.)
 */
export function reportPublicUrl(row: { url: string; sourceUrl?: string | null }): string {
  try {
    if (row.url.startsWith("/reports/") && fs.existsSync(path.join(process.cwd(), "public", row.url))) {
      return row.url;
    }
  } catch {}
  return row.sourceUrl || row.url;
}
