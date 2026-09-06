/**
 * Синхронізація новин і подій з bcvoda.com.ua (стрічка /aktualna-informatsiya).
 * Нові статті докладаються в БД News/Event (існуючі не чіпаємо — їх міг правити адмін).
 * Фото качаються в public/uploads/bcvoda/.
 */
import fs from "fs";
import path from "path";

const UA = { "User-Agent": "bcvoda-content-sync/1.0 (+https://bcvoda.com.ua)" };
const FEED_URL = "https://bcvoda.com.ua/aktualna-informatsiya";

export type FeedItem = { kind: "news" | "event"; slug: string; title: string };
export type Article = {
  title: string;
  html: string;
  text: string;
  excerpt: string;
  image: string | null;
  publishedAt: Date;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&(quot|amp|lt|gt|nbsp|ldquo|rdquo|laquo|raquo|mdash|ndash);/g, (_, e) => {
      const m: Record<string, string> = {
        quot: '"', amp: "&", lt: "<", gt: ">", nbsp: " ", ldquo: "\u201C", rdquo: "\u201D",
        laquo: "\u00AB", raquo: "\u00BB", mdash: "\u2014", ndash: "\u2013",
      };
      return m[e] ?? " ";
    });
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Список статей зі стрічки (нові — перші). */
export async function fetchFeedList(limit = 30): Promise<FeedItem[]> {
  const res = await fetch(FEED_URL, { headers: UA });
  if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
  const html = await res.text();
  const out: FeedItem[] = [];
  const re = /<a[^>]+href="https:\/\/bcvoda\.com\.ua\/(news_|events)\/([^"/?#]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null && out.length < limit) {
    const kind = m[1] === "news_" ? "news" : "event";
    const slug = m[2].replace(/\/$/, "");
    if (!slug || out.find((x) => x.slug === slug && x.kind === kind)) continue;
    out.push({ kind, slug, title: stripTags(m[3]).slice(0, 200) });
  }
  return out;
}

export async function downloadImage(imgUrl: string, slug: string): Promise<string | null> {
  try {
    const clean = imgUrl.split("?")[0].replace(/-\d+x\d+(?=\.\w+$)/, "");
    const ext = (clean.split(".").pop() || "jpg").toLowerCase().slice(0, 4);
    const name = `${slug}.${ext === "jpeg" ? "jpg" : ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "bcvoda");
    const abs = path.join(dir, name);
    if (!fs.existsSync(abs)) {
      const res = await fetch(clean, { headers: UA });
      if (!res.ok) throw new Error(`img HTTP ${res.status}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(abs, Buffer.from(await res.arrayBuffer()));
    }
    return `/uploads/bcvoda/${name}`;
  } catch (e) {
    console.warn(`[content-sync] img fail ${imgUrl}:`, (e as Error).message);
    return null;
  }
}

/** Повна стаття: заголовок, чистий HTML, текст, фото, дата. */
export async function fetchArticle(kind: "news" | "event", slug: string): Promise<Article> {
  const pageUrl = `https://bcvoda.com.ua/${kind === "news" ? "news_" : "events"}/${slug}`;
  const res = await fetch(pageUrl, { headers: UA });
  if (!res.ok) throw new Error(`article HTTP ${res.status}: ${pageUrl}`);
  const html = await res.text();

  const block = html.match(/<div class="page-news">([\s\S]*?)<\/div>\s*<\/div>/)?.[1]
    || html.match(/<div class="page-news">([\s\S]*?)<!-- ngg_resource_manager_marker -->/)?.[1]
    || "";
  if (!block) throw new Error(`no page-news block: ${pageUrl}`);

  const title = stripTags(block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || slug).slice(0, 250) || slug;

  // чистимо: скрипти, шери, коментарі, порожні more-спани; h2 прибираємо (заголовок окремо);
  // srcset/sizes видаляємо — лишаємо тільки локальний src з папки проєкту
  let body = block
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<div class="share42init"[\s\S]*?<\/div>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<span id="more-\d+"><\/span>/gi, "")
    .replace(/\s+srcset="[^"]*"/gi, "")
    .replace(/\s+sizes="[^"]*"/gi, "")
    .trim();

  const text = stripTags(body);
  const excerpt = text.slice(0, 220);

  // дата: перше DD.M.YYYY у тексті, інакше зараз
  let publishedAt = new Date();
  const dm = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dm) {
    const d = new Date(Number(dm[3]), Number(dm[2]) - 1, Number(dm[1]), 8, 0, 0);
    if (!isNaN(d.getTime()) && d.getTime() < Date.now() + 86400000) publishedAt = d;
  }

  // перше контентне фото (не тема оформлення)
  const imgs = [...body.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((x) => x[1]).filter((u) => u.includes("/uploads/"));
  let image: string | null = null;
  if (imgs[0]) {
    image = await downloadImage(imgs[0], slug);
    // міняємо src в HTML на локальний
    if (image) body = body.split(imgs[0]).join(image);
  }

  return { title, html: body, text, excerpt, image, publishedAt };
}

type PrismaLike = {
  news: { findUnique(args: any): Promise<unknown>; create(args: any): Promise<unknown> };
  event: { findUnique(args: any): Promise<unknown>; create(args: any): Promise<unknown> };
};

/** Докладає відсутні статті в БД. Повертає кількість доданих. */
export async function syncContent(prisma: PrismaLike, limit = 30): Promise<{ news: number; events: number; skipped: number }> {
  const feed = await fetchFeedList(limit);
  let news = 0;
  let events = 0;
  let skipped = 0;
  for (const item of feed) {
    try {
      const table = item.kind === "news" ? prisma.news : prisma.event;
      const exists = await table.findUnique({ where: { slug: item.slug } });
      if (exists) {
        skipped++;
        continue;
      }
      const a = await fetchArticle(item.kind, item.slug);
      await table.create({
        data: {
          slug: item.slug,
          title: a.title || item.title,
          excerpt: a.excerpt,
          content: a.html,
          image: a.image,
          publishedAt: a.publishedAt,
        },
      });
      if (item.kind === "news") news++;
      else events++;
      console.log(`  + [${item.kind}] ${item.slug}`);
    } catch (e) {
      console.warn(`  ! skip ${item.kind}/${item.slug}:`, (e as Error).message);
    }
  }
  return { news, events, skipped };
}
