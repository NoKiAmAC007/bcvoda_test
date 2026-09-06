import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "https://bcvoda.com.ua";

async function fetchHtml(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function main() {
  console.log("Fixing zviti dates from https://bcvoda.com.ua/zviti");
  const map = new Map<string, Date>();
  for (let p = 1; p <= 13; p++) {
    const url = p === 1 ? `${BASE}/zviti` : `${BASE}/zviti/page/${p}`;
    console.log(`  fetch ${url}`);
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    // шукаємо всі посилання на /reports/ та попередній текст "Звіт DD.MM.YYYY"
    $("a[href*='/reports/']").each((_, el) => {
      const href = $(el).attr("href") || "";
      const m = href.match(/\/reports\/([^\/\?#]+)/);
      if (!m) return;
      const slug = m[1];
      // дата поруч — в батьківському контейнері шукаємо текст "Звіт DD.MM.YYYY" або загальний текст сторінки
      const parentText = $(el).parent().parent().text() + " " + $(el).parent().text() + " " + $.html($(el).parent().prev());
      // простіший: шукаємо в загальному html навколо посилання 200 символів назад
      const htmlAll = $.html();
      const idx = htmlAll.indexOf(href);
      const snippet = htmlAll.slice(Math.max(0, idx - 500), idx);
      const dm = snippet.match(/Звіт\s+(\d{1,2})\.(\d{1,2})\.(\d{4})/) || htmlAll.slice(idx, idx + 500).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      // також пробуємо знайти в найближчому тексті
      let d: Date | null = null;
      if (dm) {
        const day = Number(dm[1]), month = Number(dm[2]) - 1, year = Number(dm[3]);
        d = new Date(year, month, day);
      } else {
        // fallback: шукаємо будь-яку дату поблизу в DOM — попередній sibling
        const prev = $(el).prev().text() + $(el).parent().prev().text();
        const pm = prev.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (pm) d = new Date(Number(pm[3]), Number(pm[2]) - 1, Number(pm[1]));
      }
      if (d && !isNaN(d.getTime())) {
        // якщо вже є, не перезаписувати більш ранньою
        if (!map.has(slug)) map.set(slug, d);
        console.log(`    ${slug} -> ${d.toISOString().slice(0,10)}`);
      }
    });
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\nFound ${map.size} zviti dates`);

  // Оновити БД
  let updated = 0;
  for (const [slug, date] of map) {
    const existing = await prisma.report.findUnique({ where: { slug } });
    if (existing && existing.publishedAt.toISOString().slice(0,10) !== date.toISOString().slice(0,10)) {
      console.log(`  update ${slug}: ${existing.publishedAt.toISOString().slice(0,10)} -> ${date.toISOString().slice(0,10)}`);
      await prisma.report.update({ where: { slug }, data: { publishedAt: date } });
      updated++;
    }
  }
  console.log(`Updated ${updated} reports`);

  // Перевірка топ
  const top = await prisma.report.findMany({ orderBy: { publishedAt: "desc" }, take: 5, select: { slug: true, title: true, publishedAt: true } });
  console.log("\nTop after fix:");
  console.log(top.map(r => `${r.publishedAt.toISOString().slice(0,10)} | ${r.title.slice(0,50)} | ${r.slug}`).join("\n"));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
