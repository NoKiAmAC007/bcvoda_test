import { notFound } from "next/navigation";
import Link from "next/link";
import { mockReports } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate, formatContent } from "@/lib/utils";
import { Calendar, ArrowLeft, ExternalLink, BarChart3 } from "lucide-react";

function cleanContent(html: string) {
  if (!html) return "";
  let c = html.replace(/<code[^>]*>\s*<iframe/g, "<iframe").replace(/<\/iframe>\s*<\/code>/g, "</iframe>");
  c = c.replace(/<div class="share42init"[^>]*>.*?<\/div>/g, "");
  c = c.replace(/<div id="full-container">/g, "<div>");
  c = c.replace(/<iframe /g, '<iframe loading="lazy" allow="fullscreen" ');
  return c;
}

export default async function ReportDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: any = null;
  try {
    item = await prisma.report.findUnique({ where: { slug } });
  } catch {}
  if (!item) notFound();

  const rawContent = item.content || item.excerpt || "";
  // Якщо текст без HTML — форматуємо абзаци, інакше чистимо як раніше
  const content = /<\s*(p|br|div|ul|ol|li|h[1-6]|iframe)\b/i.test(rawContent) ? cleanContent(rawContent) : formatContent(rawContent);
  const hasIframe = content.includes("<iframe");
  const iframeSrc = content.match(/src="([^"]+)"/)?.[1] || "";
  const pubLink = iframeSrc ? iframeSrc.replace("pubembed", "pub") : "";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8DEF8] text-[#1D192B] px-3 py-1 text-xs font-semibold">
          <BarChart3 className="h-3 w-3" /> Звіт
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6E73]">
          <Calendar className="h-3 w-3" /> {formatDate(item.publishedAt)}
        </span>
      </div>

      <h1 className="mt-3 text-[28px] lg:text-[32px] font-bold tracking-tight leading-tight text-[#1D1D1F]" style={{ fontFamily: '"SF Pro Display", -apple-system, sans-serif' }}>
        {item.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/zviti" className="rounded-full bg-[#1C1B1F] text-white px-6 py-2.5 text-sm font-medium">← Всі звіти</Link>
        {hasIframe && <a href={pubLink} target="_blank" className="rounded-full bg-white border border-black/10 px-6 py-2.5 text-sm font-medium hover:bg-black/5">Відкрити презентацію</a>}
        {item.fileUrl && <a href={item.fileUrl} target="_blank" className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-sm font-medium">Завантажити PDF</a>}
      </div>

      <div className="mt-4 overflow-hidden rounded-[28px] bg-white border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <div className="px-6 lg:px-8 py-4 border-b border-black/5 flex items-center justify-between gap-4">
          <p className="text-xs text-[#6E6E73] flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(item.publishedAt)}</p>
          {hasIframe && pubLink && (
            <a href={pubLink} target="_blank" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold hover:bg-black/5">
              <ExternalLink className="h-3 w-3" /> Відкрити
            </a>
          )}
        </div>

        {hasIframe ? (
          <div className="bg-[#F5F5F7] p-3 lg:p-4">
            <div className="mx-auto max-w-[960px] overflow-hidden rounded-[20px] border border-black/10 shadow-sm bg-white">
              <div className="relative w-full overflow-hidden" style={{ paddingTop: "59.3%" }}>
                <div className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
            <div className="mx-auto max-w-[960px] mt-2 flex items-center justify-between px-1 text-xs text-[#6E6E73]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0B57D0] animate-pulse" /> Google Slides • вміщується автоматично
              </span>
              <span className="hidden sm:block">БілоцерківВода</span>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-8 rich-content" dangerouslySetInnerHTML={{ __html: content || `<p>${item.excerpt || ""}</p>` }} />
        )}
      </div>
    </div>
  );
}