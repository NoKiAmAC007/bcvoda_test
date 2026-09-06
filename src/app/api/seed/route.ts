import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockNews, mockEvents, mockReports } from "@/lib/data";

export async function GET() {
  // idempotent seed
  for (const n of mockNews) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {},
      create: {
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt || null,
        content: n.content || n.excerpt || "",
        image: (n as any).image || null,
        publishedAt: new Date(n.publishedAt),
      },
    });
  }
  for (const e of mockEvents) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt || null,
        content: e.content || e.excerpt || "",
        image: (e as any).image || null,
        publishedAt: new Date(e.publishedAt),
      },
    });
  }
  for (const r of mockReports) {
    await prisma.report.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt || null,
        content: "",
        publishedAt: new Date(r.publishedAt),
      },
    });
  }
  // demo pages
  await prisma.page.upsert({
    where: { slug: "pro-nas" },
    update: {},
    create: { slug: "pro-nas", title: "Про нас", content: "Demo" },
  });

  return NextResponse.json({ ok: true, seeded: { news: mockNews.length, events: mockEvents.length, reports: mockReports.length } });
}
