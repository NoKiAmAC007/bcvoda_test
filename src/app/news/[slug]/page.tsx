import { notFound } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { mockNews } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate, formatContent } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: any = null;
  try {
    item = await prisma.news.findUnique({ where: { slug } });
  } catch {}
  if (!item) notFound();
  return (
    <PageLayout title={item.title} breadcrumbs={[{ label: "Новини", href: "/news" }, { label: item.title }]}>
      <p className="text-xs text-slate-500 not-prose">{formatDate(item.publishedAt)}</p>
      {item.image && <img src={item.image} alt="" className="rounded-xl mt-4 w-full max-h-96 object-cover not-prose" />}
      <div className="mt-4 rich-content whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatContent(item.content || item.excerpt || "") }} />
    </PageLayout>
  );
}
