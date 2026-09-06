import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const months: Record<string, number> = {
  "січень": 0, "січня": 0,
  "лютий": 1, "лютого": 1,
  "березень": 2, "березня": 2,
  "квітень": 3, "квітня": 3,
  "травень": 4, "травня": 4,
  "червень": 5, "червня": 5,
  "липень": 6, "липня": 6,
  "серпень": 7, "серпня": 7,
  "вересень": 8, "вересня": 8,
  "жовтень": 9, "жовтня": 9,
  "листопад": 10, "листопада": 10,
  "грудень": 11, "грудня": 11,
};

function parseTitleDate(title: string): Date | null {
  const m = title.match(/за\s+([а-яіїє]+)\s+(\d{4})/i);
  if (m) {
    const month = months[m[1].toLowerCase()];
    const year = Number(m[2]);
    if (month !== undefined && year) return new Date(year, month, 15);
  }
  // також шукаємо рік в slug або заголовку
  const y = title.match(/(202[4-6])/);
  if (y) {
    // пробуємо знайти місяць поруч
    for (const [k, v] of Object.entries(months)) {
      if (title.toLowerCase().includes(k)) return new Date(Number(y[1]), v, 15);
    }
    return new Date(Number(y[1]), 6, 1);
  }
  return null;
}

async function main() {
  console.log("Fixing report dates...");
  const reports = await prisma.report.findMany();
  let fixed = 0;
  for (const r of reports) {
    const d = parseTitleDate(r.title);
    if (d && d.toISOString().slice(0,10) !== r.publishedAt.toISOString().slice(0,10)) {
      console.log(`  ${r.slug} : ${r.publishedAt.toISOString().slice(0,10)} -> ${d.toISOString().slice(0,10)} | ${r.title.slice(0,60)}`);
      await prisma.report.update({ where: { id: r.id }, data: { publishedAt: d } });
      fixed++;
    }
  }
  console.log(`Fixed ${fixed} reports`);

  // Для новин — якщо в тайтлі є рік, ставимо відповідний рік, інакше залишаємо
  console.log("\nChecking news dates for 2026 priority...");
  const news = await prisma.news.findMany();
  let nFixed = 0;
  for (const n of news) {
    const has2026 = n.title.includes("2026") || n.slug.includes("2026") || n.excerpt?.includes("2026");
    const has2025 = n.title.includes("2025");
    // якщо зараз 01.09.2026 і новина 2026 — має бути в топі, ставимо її дату вперед (серпень-вересень 2026)
    if (has2026 && n.publishedAt.getFullYear() !== 2026) {
      const d = new Date(2026, 7, 15); // 15 серпня 2026
      await prisma.news.update({ where: { id: n.id }, data: { publishedAt: d } });
      nFixed++;
    } else if (has2025 && n.publishedAt.getFullYear() === 2026) {
      // 2025 новина помилково з 2026 датою — опустити в 2025
      const d = parseTitleDate(n.title) || new Date(2025, 5, 15);
      await prisma.news.update({ where: { id: n.id }, data: { publishedAt: d } });
      nFixed++;
    }
  }
  console.log(`Fixed ${nFixed} news`);

  const events = await prisma.event.findMany();
  let eFixed = 0;
  for (const e of events) {
    if (e.slug.includes("115") || e.title.includes("Котляревського")) {
      // остання подія має бути зверху — 28.08.2026
      await prisma.event.update({ where: { id: e.id }, data: { publishedAt: new Date(2026, 7, 28) } });
      eFixed++;
    }
  }
  console.log(`Fixed ${eFixed} events`);

  const [nr, er, rr] = await Promise.all([
    prisma.report.findMany({ orderBy: { publishedAt: "desc" }, take: 5, select: { title: true, publishedAt: true } }),
    prisma.news.findMany({ orderBy: { publishedAt: "desc" }, take: 3, select: { title: true, publishedAt: true } }),
    prisma.event.findMany({ orderBy: { publishedAt: "desc" }, take: 3, select: { title: true, publishedAt: true } }),
  ]);
  console.log("\nTop reports after fix:");
  console.log(nr.map(r => `${r.publishedAt.toISOString().slice(0,10)} | ${r.title.slice(0,50)}`).join("\n"));
  console.log("\nTop news:");
  console.log(er.map(r => `${r.publishedAt.toISOString().slice(0,10)} | ${r.title.slice(0,50)}`).join("\n"));

  await prisma.$disconnect();
}
main();
