import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "https://bcvoda.com.ua";

async function fetchHtml(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.text();
}

async function main() {
  console.log("Exact zviti dates via regex Звіт + href");
  const map = new Map<string, Date>();
  for (let p = 1; p <= 13; p++) {
    const url = p === 1 ? `${BASE}/zviti` : `${BASE}/zviti/page/${p}`;
    const html = await fetchHtml(url);
    const re = /Звіт\s+(\d{1,2})\.(\d{1,2})\.(\d{4})[\s\S]*?href="\/reports\/([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const day = Number(m[1]), month = Number(m[2]) - 1, year = Number(m[3]), slug = m[4];
      const d = new Date(year, month, day);
      if (!map.has(slug)) {
        map.set(slug, d);
        console.log(`  ${slug} -> ${d.toISOString().slice(0,10)} (Звіт ${m[1]}.${m[2]}.${m[3]})`);
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`\nFound ${map.size} exact dates`);
  let upd = 0;
  for (const [slug, date] of map) {
    const ex = await prisma.report.findUnique({ where: { slug } });
    if (ex && ex.publishedAt.toISOString().slice(0,10) !== date.toISOString().slice(0,10)) {
      console.log(` update ${slug}: ${ex.publishedAt.toISOString().slice(0,10)} -> ${date.toISOString().slice(0,10)}`);
      await prisma.report.update({ where: { slug }, data: { publishedAt: date } });
      upd++;
    }
  }
  console.log(`Updated ${upd}`);
  const top = await prisma.report.findMany({ orderBy: { publishedAt: "desc" }, take: 6, select: { title: true, publishedAt: true } });
  console.log("\nTop after exact fix:");
  console.log(top.map(r => `${r.publishedAt.toISOString().slice(0,10)} | ${r.title.slice(0,50)}`).join("\n"));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
