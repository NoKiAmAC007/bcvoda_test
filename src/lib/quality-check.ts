/**
 * Спільна логіка щоденної перевірки звітів якості води з bcvoda.com.ua.
 * Використовується скриптом scripts/quality-daily.ts і кроном /api/cron/quality-daily.
 *
 * Що вміє:
 *  - зчитати 3 архівні сторінки (питна вода / стічні води / р. Рось) і зібрати список PDF;
 *  - визначити, чи з'явився новий звіт (порівняння URL останнього PDF);
 *  - завантажити останній PDF РЧВ і позиційно витягти 4 показники
 *    (pH, хлор вільний, жорсткість, каламутність) з жорсткою валідацією діапазонів.
 *
 * УВАГА: PDF мають биті вбудовані шрифти кирилиці (без ToUnicode) — назви показників
 * читаються як гарбл, тому прив'язка йде до незмінних якорів (номери ДСТУ/ISO/ГОСТ
 * у колонці "метод") + колонки результату по координаті X. Якщо парсинг непевний —
 * показник НЕ оновлюється (повертається null), старе значення зберігається.
 */
import fs from "fs";
import path from "path";

export type ReportEntry = { url: string; title: string };
export type QualityNumbers = { pH: number | null; chlorine: number | null; hardness: number | null; turbidity: number | null };
export type QualityCheck = {
  checkedAt: string;
  pitna: ReportEntry[];
  kos: ReportEntry[];
  richka: ReportEntry[];
  numbers: QualityNumbers;
  numbersPdf: string;
};

export const ARCHIVE_URLS = {
  pitna: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi",
  kos: "https://bcvoda.com.ua/yakist-stichnih-vod",
  richka: "https://bcvoda.com.ua/yakist-vodi",
} as const;

const UA = { "User-Agent": "bcvoda-quality-check/1.0 (+https://bcvoda.com.ua)" };

/** Папка сайту для звітів: public/reports/quality/<category>/ */
export function reportsDir(category: string): string {
  return path.join(process.cwd(), "public", "reports", "quality", category);
}

function safeFileName(pdfUrl: string): string {
  const raw = decodeURIComponent(pdfUrl.split("?")[0].split("/").pop() || "report.pdf");
  const clean = raw.replace(/[^a-zA-Z0-9а-яА-ЯіїєґІЇЄҐ._-]/g, "_").slice(0, 120);
  return clean.toLowerCase().endsWith(".pdf") ? clean : `${clean}.pdf`;
}

/**
 * Скачує PDF у папку сайту (якщо ще немає) і повертає локальне посилання
 * виду /reports/quality/pitna/xxx.pdf. Кидає помилку лише якщо файла
 * немає локально І скачати не вдалося.
 */
export async function downloadPdf(pdfUrl: string, category: string): Promise<string> {
  const dir = reportsDir(category);
  const name = safeFileName(pdfUrl);
  const abs = path.join(dir, name);
  if (!fs.existsSync(abs)) {
    const res = await fetch(pdfUrl, { headers: UA });
    if (!res.ok) throw new Error(`pdf download HTTP ${res.status}: ${pdfUrl}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(abs, Buffer.from(await res.arrayBuffer()));
  }
  return `/reports/quality/${category}/${name}`;
}

export function normalizeTitle(raw: string, fallbackUrl: string): string {
  let t = (raw || "").replace(/\s+/g, " ").trim();
  // "Травень2026" -> "Травень 2026"
  t = t.replace(/([а-яА-ЯіїєґІЇЄҐ]+)(\d{4})/, "$1 $2");
  if (!t) {
    const f = fallbackUrl.split("/").pop() || "";
    t = f.replace(/\.pdf$/i, "");
  }
  return t;
}

/** Витягує всі (pdfUrl, title) зі сторінки архіву у порядку зверху вниз (нові — перші). */
export function parseArchive(html: string): ReportEntry[] {
  const out: ReportEntry[] = [];
  const re = /href="(https:\/\/bcvoda\.com\.ua\/wp-content\/uploads\/[^"]+\.pdf)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const url = m[1];
    if (out.find((p) => p.url === url)) continue;
    const slice = html.slice(m.index, m.index + 900);
    // верстка: <div><span>pdf</span></div><div><span>Серпень 2026</span>...
    const spans = [...slice.matchAll(/<span[^>]*>([^<]{1,80})<\/span>/gi)].map((s) => s[1].trim());
    const titleRaw = spans.filter((s) => !/^pdf$/i.test(s))[0] || "";
    out.push({ url, title: normalizeTitle(titleRaw, url) });
  }
  return out;
}

export async function fetchArchive(kind: keyof typeof ARCHIVE_URLS): Promise<ReportEntry[]> {
  const res = await fetch(ARCHIVE_URLS[kind], { headers: UA, next: { revalidate: 0 } as any });
  if (!res.ok) throw new Error(`fetch ${kind}: HTTP ${res.status}`);
  return parseArchive(await res.text());
}

type PdfItem = { s: string; x: number; y: number };

async function pdfItems(buf: Buffer): Promise<PdfItem[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await (pdfjs as any).getDocument({ data: new Uint8Array(buf) }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  return (tc.items as any[])
    .map((it) => ({ s: String(it.str || ""), x: Math.round(it.transform[4]), y: Math.round(it.transform[5]) }))
    .filter((it) => it.s.trim());
}

function rowAt(items: PdfItem[], y: number, tol = 8): PdfItem[] {
  return items.filter((it) => Math.abs(it.y - y) < tol).sort((a, b) => a.x - b.x);
}

function numToken(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Число з колонки результату (x ≈ 270–340) у заданому рядку. */
function resultInRow(row: PdfItem[]): number | null {
  for (const it of row) {
    if (it.x >= 265 && it.x <= 345 && /^[<>]?\d+[.,]\d+$/.test(it.s.trim())) {
      const v = numToken(it.s.trim().replace(/^[<>]/, ""));
      if (v !== null) return v;
    }
  }
  return null;
}

function inRange(v: number | null, min: number, max: number): number | null {
  return v !== null && v >= min && v <= max ? v : null;
}

/**
 * Позиційний парсинг 4 показників з першої сторінки PDF РЧВ.
 * Якорі (незмінні номери методик у тексті):
 *  - каламутність: "7027" (ДСТУ ISO 7027), норма <1,0
 *  - жорсткість загальна: "4151" (ГОСТ 4151-72), норма <7
 *  - хлор вільний: "18190-72" + норма "<0,5" (рядок вільного хлору)
 *  - pH: "4077-2001" (ДСТУ 4077), норма 6,5–8,5 (перша цифра "7" б'ється в "'")
 */
export async function parseNumbersFromPdf(buf: Buffer): Promise<QualityNumbers> {
  const out: QualityNumbers = { pH: null, chlorine: null, hardness: null, turbidity: null };
  let items: PdfItem[];
  try {
    items = await pdfItems(buf);
  } catch (e) {
    console.warn("[quality-check] pdf read fail:", (e as Error).message);
    return out;
  }

  // Каламутність
  const tb = items.find((it) => /7027/.test(it.s));
  if (tb) out.turbidity = inRange(resultInRow(rowAt(items, tb.y)), 0, 5);

  // Жорсткість (у тексті "4" часто б'ється в "4l"/"4I": шукаємо 4151 або 4l5l-72)
  const hard = items.find((it) => /4151|4[lI]5[lI]-72/.test(it.s));
  if (hard) out.hardness = inRange(resultInRow(rowAt(items, hard.y)), 0, 10);

  // Хлор вільний: норма <0,5 ("<05" у гарблі) поруч із методикою 18190-72.
  // Прив'язка до методики обов'язкова: "<0,5" є і в інших рядках (напр. алюміній).
  const clAnchors = items.filter((it) => /18190-72/.test(it.s)).map((it) => it.y);
  const freeNorm = items.find((it) => {
    const t = it.s.replace(/\s/g, "");
    if (t !== "<05" && t !== "<0,5") return false;
    return clAnchors.some((y) => Math.abs(y - it.y) < 30);
  });
  if (freeNorm) out.chlorine = inRange(resultInRow(rowAt(items, freeNorm.y, 10)), 0, 0.6);

  // pH: токен результату на кшталт "'1" ("7," б'ється в "'") або "7,1"
  const phAnchor = items.find((it) => /4077-2001/.test(it.s));
  if (phAnchor) {
    const row = rowAt(items, phAnchor.y);
    for (const it of row) {
      if (it.x < 260 || it.x > 350) continue;
      const t = it.s.trim();
      let digits = t.replace(/[^0-9]/g, "");
      if (/^'/.test(t) && digits) digits = "7" + digits; // бита "7" -> "'"
      if (/^[67][,.]?\d$/.test(t)) digits = t.replace(/[^0-9]/g, "");
      if (digits.length === 2) {
        const v = parseFloat(`${digits[0]}.${digits[1]}`);
        if (v >= 6 && v <= 9) {
          out.pH = v;
          break;
        }
      }
    }
  }

  return out;
}

/** Повна перевірка: архіви + цифри з останнього PDF питної води. */
export async function runQualityCheck(): Promise<QualityCheck> {
  const [pitna, kos, richka] = await Promise.all([fetchArchive("pitna"), fetchArchive("kos"), fetchArchive("richka")]);
  const numbers: QualityNumbers = { pH: null, chlorine: null, hardness: null, turbidity: null };
  let numbersPdf = "";
  if (pitna[0]?.url) {
    try {
      const res = await fetch(pitna[0].url, { headers: UA });
      if (!res.ok) throw new Error(`pdf HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      Object.assign(numbers, await parseNumbersFromPdf(buf));
      numbersPdf = pitna[0].url;
    } catch (e) {
      console.warn("[quality-check] numbers pdf fail:", (e as Error).message);
    }
  }
  return { checkedAt: new Date().toISOString(), pitna, kos, richka, numbers, numbersPdf };
}
