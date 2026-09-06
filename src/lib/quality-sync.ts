/**
 * Застосування результату перевірки (runQualityCheck) до сайту:
 * БД QualityReport + WaterQuality, за можливості — public/data/daily.json
 * (на Vercel запис у файли ефемерний, тому БД — головне джерело для сторінок).
 */
import fs from "fs";
import path from "path";
import { downloadPdf, type QualityCheck } from "./quality-check";

type PrismaLike = {
  qualityReport: {
    upsert(args: any): Promise<unknown>;
    findMany(args: any): Promise<{ id: string; sourceUrl: string }[]>;
    delete(args: any): Promise<unknown>;
  };
  waterQuality: { upsert(args: any): Promise<unknown> };
};

/** Качає PDF у public/reports/quality/<category>/ і пише в БД локальне посилання. */
export async function syncReportsToDb(prisma: PrismaLike, category: string, entries: { url: string; title: string }[]) {
  const seen: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const src = entries[i].url;
    seen.push(src);
    let local = src;
    try {
      local = await downloadPdf(src, category);
    } catch (e) {
      console.warn(`[quality-sync] не скачалось, лишаю оригінал: ${src} — ${(e as Error).message}`);
    }
    await prisma.qualityReport.upsert({
      where: { sourceUrl: src },
      create: { category, title: entries[i].title, url: local, sourceUrl: src, order: i },
      update: { category, title: entries[i].title, url: local, order: i },
    });
  }
  const stale = await prisma.qualityReport.findMany({ where: { category }, select: { id: true, sourceUrl: true } });
  for (const s of stale) {
    if (!seen.includes(s.sourceUrl)) await prisma.qualityReport.delete({ where: { id: s.id } });
  }
}

function readDaily(): any {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "data", "daily.json"), "utf-8"));
  } catch {
    return { city: "Біла Церква", sources: {}, data: {} };
  }
}

export async function applyQualityCheck(
  prisma: PrismaLike,
  check: QualityCheck,
  opts: { force?: boolean } = {}
): Promise<{ isNew: boolean; title: string; url: string; sourceUrl?: string; numbers: Record<string, number>; warnings: string[] }> {
  const warnings: string[] = [];
  const daily = readDaily();
  const storedPdf: string = daily.data?.quality?.pdfUrl || "";
  // pdfUrl у daily.json тепер локальний — новизну звіряємо за оригіналом (pdfSource)
  const storedRemote: string = daily.data?.quality?.pdfSource || (storedPdf.startsWith("http") ? storedPdf : "");
  const latest = check.pitna[0];
  if (!latest) throw new Error("порожній архів питної води");
  const isNew = !!opts.force || !storedRemote || latest.url !== storedRemote;

  // посилання + скачування PDF у папку сайту — завжди (дешево, БД лишається актуальною)
  await syncReportsToDb(prisma, "pitna", check.pitna);
  await syncReportsToDb(prisma, "kos", check.kos);
  await syncReportsToDb(prisma, "richka", check.richka);

  const numbers: Record<string, number> = {};
  if (!isNew) return { isNew, title: latest.title, url: latest.url, numbers, warnings };

  // Локальні шляхи (файли вже скачані кроком вище; де скачати не вдалось — оригінал)
  const localOrRemote = async (url: string, category: string) => {
    try {
      return await downloadPdf(url, category);
    } catch {
      return url;
    }
  };
  const latestLocal = await localOrRemote(latest.url, "pitna");
  const kosLocal = check.kos[0] ? await localOrRemote(check.kos[0].url, "kos") : "";
  const richkaLocal = check.richka[0] ? await localOrRemote(check.richka[0].url, "richka") : "";
  const topPdfs: { url: string; title: string }[] = [];
  for (const e of check.pitna.slice(0, 5)) {
    topPdfs.push({ url: await localOrRemote(e.url, "pitna"), title: e.title });
  }

  const now = new Date();

  // daily.json (спрацює локально/standalone; на Vercel read-only — ігноруємо)
  try {
    const out = {
      ...daily,
      checkedAt: now.toISOString(),
      sources: { ...daily.sources, quality: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi" },
      data: {
        ...daily.data,
        quality: {
          ...(daily.data?.quality || {}),
          source: "https://bcvoda.com.ua/yakist-vodi-pitnoyi-vodi",
          reportMonth: latest.title,
          pdfUrl: latestLocal,
          pdfSource: latest.url,
          allPdfs: topPdfs,
          sewage: {
            reportMonth: check.kos[0]?.title || daily.data?.quality?.sewage?.reportMonth || "",
            pdfUrl: kosLocal || daily.data?.quality?.sewage?.pdfUrl || "",
            pdfSource: check.kos[0]?.url || "",
            source: "https://bcvoda.com.ua/yakist-stichnih-vod",
          },
          river: {
            reportMonth: check.richka[0]?.title || daily.data?.quality?.river?.reportMonth || "",
            pdfUrl: richkaLocal || daily.data?.quality?.river?.pdfUrl || "",
            pdfSource: check.richka[0]?.url || "",
            source: "https://bcvoda.com.ua/yakist-vodi",
          },
          lastCheck: now.toISOString(),
          nextCheck: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
        reports: { ...daily.data?.reports, latest: latest.title.toLowerCase() },
      },
    };
    const dir = path.join(process.cwd(), "public", "data");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "daily.json"), JSON.stringify(out, null, 2));
  } catch (e) {
    warnings.push("daily.json write: " + String(e));
  }

  // WaterQuality: місяць завжди; цифри — лише впевнено розпарсені
  const patch: any = { reportMonth: latest.title };
  const names: [keyof QualityCheck["numbers"], string][] = [
    ["pH", "pH"],
    ["chlorine", "хлор"],
    ["hardness", "жорсткість"],
    ["turbidity", "каламутність"],
  ];
  for (const [key, label] of names) {
    const v = check.numbers[key];
    if (v !== null) {
      patch[key] = v;
      numbers[key] = v;
    } else {
      warnings.push(`${label} не розпізнано — лишаю старе`);
    }
  }
  await prisma.waterQuality.upsert({ where: { id: "current" }, create: { id: "current", ...patch }, update: patch });

  return { isNew, title: latest.title, url: latestLocal, sourceUrl: latest.url, numbers, warnings };
}
