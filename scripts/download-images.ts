#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "https://bcvoda.com.ua";
const heroSlides = [
  "https://bcvoda.com.ua/wp-content/uploads/2015/02/DSC56511-700x2872.jpg",
  "https://bcvoda.com.ua/wp-content/uploads/2015/02/DSC5853-700x287.jpg",
  "https://bcvoda.com.ua/wp-content/uploads/2015/01/DSC6171-700x287.jpg",
];

const outDir = path.join(process.cwd(), "public", "uploads", "bcvoda");
fs.mkdirSync(outDir, { recursive: true });

async function download(url: string): Promise<string | null> {
  try {
    const u = new URL(url);
    const filename = path.basename(u.pathname) || `img-${Date.now()}.jpg`;
    // sanitize
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outPath = path.join(outDir, safe);
    if (fs.existsSync(outPath)) {
      console.log(`  skip exists ${safe}`);
      return `/uploads/bcvoda/${safe}`;
    }
    console.log(`  ↓ ${url} -> ${safe}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outPath, buf);
    return `/uploads/bcvoda/${safe}`;
  } catch (e) {
    console.warn(`  ! fail ${url}:`, (e as Error).message);
    return null;
  }
}

async function main() {
  console.log("=== Download images to public/uploads/bcvoda ===");
  const urls = new Set<string>();

  // hero
  heroSlides.forEach((u) => urls.add(u));

  // DB images
  const [news, events] = await Promise.all([prisma.news.findMany({ select: { image: true } }), prisma.event.findMany({ select: { image: true } })]);
  for (const n of [...news, ...events]) if (n.image && n.image.startsWith("http")) urls.add(n.image);

  // content images — parse HTML for <img src>
  const allContent = await prisma.news.findMany({ select: { content: true } });
  const re = /src=["'](https:\/\/bcvoda\.com\.ua[^"']+)["']/g;
  for (const c of allContent) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(c.content || ""))) urls.add(m[1]);
  }

  console.log(`Found ${urls.size} unique image URLs`);

  const map = new Map<string, string>();
  for (const url of urls) {
    const local = await download(url);
    if (local) map.set(url, local);
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\nDownloaded ${map.size}/${urls.size}`);

  // Update DB to use local paths
  let updated = 0;
  for (const [remote, local] of map) {
    const n1 = await prisma.news.updateMany({ where: { image: remote }, data: { image: local } });
    const n2 = await prisma.event.updateMany({ where: { image: remote }, data: { image: local } });
    // update content HTML
    const newsWithContent = await prisma.news.findMany({ where: { content: { contains: remote } }, select: { id: true, content: true } });
    for (const row of newsWithContent) {
      await prisma.news.update({ where: { id: row.id }, data: { content: row.content.replaceAll(remote, local) } });
      updated++;
    }
    const evWithContent = await prisma.event.findMany({ where: { content: { contains: remote } }, select: { id: true, content: true } });
    for (const row of evWithContent) {
      await prisma.event.update({ where: { id: row.id }, data: { content: row.content.replaceAll(remote, local) } });
      updated++;
    }
    updated += n1.count + n2.count;
  }

  // Seed hero slides as local
  for (let i = 0; i < heroSlides.length; i++) {
    const remote = heroSlides[i];
    const local = map.get(remote);
    if (local) {
      await prisma.heroSlide.upsert({
        where: { id: `hero-${i + 1}` },
        update: { imageUrl: local },
        create: { id: `hero-${i + 1}`, title: ["Біла Церква", "Хіміко-бактеріологічна лабораторія", "Річка Рось"][i], imageUrl: local, order: i },
      });
    }
  }

  console.log(`Updated ${updated} DB records to local paths`);
  console.log(`\nDone. Images in public/uploads/bcvoda — тепер сайт не залежить від bcvoda.com.ua`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
