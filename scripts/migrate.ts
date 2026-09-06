#!/usr/bin/env tsx
/**
 * Міграція контенту з https://bcvoda.com.ua/ (WordPress) на новий движок (Prisma)
 * Повний аудит: ~1150 записів (700 news_, 300 events, 130 reports)
 * Запуск: npx tsx scripts/migrate.ts --pages=5  (скільки сторінок пагінації брати, 1 стор = 10 записів)
 * Повна міграція: npx tsx scripts/migrate.ts --pages=114
 */
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "https://bcvoda.com.ua";
const ARCHIVE = `${BASE}/aktualna-informatsiya`;

function getArg(name: string, fallback: string) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : fallback;
}
const PAGES = Number(getArg("pages", "3")); // за замовчуванням 3 стор = 30 записів для демо

async function fetchHtml(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": "bcvoda-migrate/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

type Item = { url: string; slug: string; type: "news" | "event" | "report" };

async function collectArchive(pages: number): Promise<Item[]> {
  const items: Item[] = [];
  const seen = new Set<string>();
  for (let p = 1; p <= pages; p++) {
    const url = p === 1 ? ARCHIVE : `${ARCHIVE}/page/${p}`;
    console.log(`[archive] ${url}`);
    try {
      const html = await fetchHtml(url);
      const $ = cheerio.load(html);
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        let type: Item["type"] | null = null;
        if (href.includes("/news_/")) type = "news";
        else if (href.includes("/events/")) type = "event";
        else if (href.includes("/reports/")) type = "report";
        else return;
        const m = href.match(/\/(?:news_|events|reports)\/([^\/\?#]+)\/?/);
        if (!m) return;
        const slug = m[1];
        const full = `${BASE}/${type === "news" ? "news_" : type === "event" ? "events" : "reports"}/${slug}`;
        const key = `${type}:${slug}`;
        if (seen.has(key)) return;
        seen.add(key);
        items.push({ url: full, slug, type });
      });
    } catch (e) {
      console.warn(`  ! failed ${url}:`, (e as Error).message);
    }
    // пауза щоб не заDDOSити
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log(`[archive] found ${items.length} items`);
  return items;
}

async function parseDetail(item: Item) {
  const html = await fetchHtml(item.url);
  const $ = cheerio.load(html);
  // Заголовок — на старому WP реальний заголовок в <h2> всередині .page-news, а <title> — загальний "БiлоцеркiвВода"
  let title =
    $(".page-news h2").first().text().trim() ||
    $(".page-news h1").first().text().trim() ||
    $("h2").first().text().trim() ||
    $("h1").first().text().trim() ||
    item.slug;
  // якщо все ще "БілоцерківВода" — це загальний тайтл, замінити на slug
  if (title === "БiлоцеркiвВода" || title === "БілоцерківВода" || title === "Бiлоцеркiввода") {
    title = item.slug.replace(/-/g, " ");
  }
  title = title.replace(/\s+/g, " ").trim().slice(0, 200);

  // Контент — пробуємо .content, article, .news-content
  let content =
    $(".news-content").html() ||
    $("article").html() ||
    $(".content").html() ||
    $(".entry-content").html() ||
    "";
  if (!content) {
    // fallback: весь текст після h1
    content = $("body").html() || "";
  }

  // Очистити content від скриптів/стилів
  const $c = cheerio.load(`<div>${content}</div>`);
  $c("script, style, nav, header, footer").remove();
  content = $c("div").html() || "";

  // Зображення — перше в контенті
  let image: string | null = null;
  const img = $c("img").first().attr("src");
  if (img) image = img.startsWith("http") ? img : `${BASE}${img}`;
  // Якщо немає — пробуємо OpenGraph
  if (!image) {
    const og = $('meta[property="og:image"]').attr("content");
    if (og) image = og;
  }

  // Дата — шукаємо в тексті або meta
  let publishedAt = new Date();
  const dateText = $(".grey-text").text() || $("time").attr("datetime") || "";
  const m = dateText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) publishedAt = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  else {
    const meta = $('meta[property="article:published_time"]').attr("content");
    if (meta) publishedAt = new Date(meta);
  }

  // Excerpt — перший абзац
  const excerpt = $c("p").first().text().trim().slice(0, 280) || title;

  return { title, content, excerpt, image, publishedAt };
}

async function migrate() {
  console.log(`\n=== BCVODA MIGRATE pages=${PAGES} base=${BASE} ===\n`);
  const items = await collectArchive(PAGES);
  console.log(`\nMigrating ${items.length} details...\n`);
  let ok = 0, fail = 0;
  for (const [idx, it] of items.entries()) {
    process.stdout.write(`[${idx + 1}/${items.length}] ${it.type} ${it.slug} ... `);
    try {
      const detail = await parseDetail(it);
      if (it.type === "news") {
        await prisma.news.upsert({
          where: { slug: it.slug },
          update: { title: detail.title, excerpt: detail.excerpt, content: detail.content, image: detail.image, publishedAt: detail.publishedAt },
          create: { slug: it.slug, title: detail.title, excerpt: detail.excerpt, content: detail.content, image: detail.image, publishedAt: detail.publishedAt },
        });
      } else if (it.type === "event") {
        await prisma.event.upsert({
          where: { slug: it.slug },
          update: { title: detail.title, excerpt: detail.excerpt, content: detail.content, image: detail.image, publishedAt: detail.publishedAt },
          create: { slug: it.slug, title: detail.title, excerpt: detail.excerpt, content: detail.content, image: detail.image, publishedAt: detail.publishedAt },
        });
      } else {
        await prisma.report.upsert({
          where: { slug: it.slug },
          update: { title: detail.title, excerpt: detail.excerpt, content: detail.content, publishedAt: detail.publishedAt },
          create: { slug: it.slug, title: detail.title, excerpt: detail.excerpt, content: detail.content, publishedAt: detail.publishedAt },
        });
      }
      ok++;
      console.log("OK");
    } catch (e) {
      fail++;
      console.log("FAIL", (e as Error).message);
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`\n=== DONE ok=${ok} fail=${fail} total=${items.length} ===`);
  // Статистика БД
  const [n, ev, rep] = await Promise.all([prisma.news.count(), prisma.event.count(), prisma.report.count()]);
  console.log(`DB totals: news=${n} events=${ev} reports=${rep}`);

  // Додатково: показати структуру файлів нового сайту
  console.log("\nНовий сайт покриває URL (next.config redirects): news_→news, gallery-2→gallery, ?p=9→/pro-nas, wp-content проксі");
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
