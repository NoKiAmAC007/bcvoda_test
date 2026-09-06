import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatContent } from "@/lib/utils";
import { ArrowLeft, CalendarDays, Phone, TriangleAlert, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: any = null;
  try {
    item = await prisma.event.findUnique({ where: { slug } });
  } catch {}
  if (!item) notFound();
  // Іконка редагування — лише для залогінених в адмінку
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Хлібні крихти */}
      <nav className="text-xs text-[#6E6E73] flex gap-1.5 flex-wrap items-center">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-[#0B57D0]">Події</Link>
        <span>/</span>
        <span className="text-[#1C1B1F] font-medium line-clamp-1">{item.title}</span>
      </nav>

      {/* Hero: фото + заголовок поверх */}
      <div className="relative mt-4 overflow-hidden rounded-[28px] shadow-[0_1px_3px_#00000014] bg-[#0B57D0]">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-[240px] sm:h-[360px] w-full object-cover" />
        ) : (
          <div className="h-[180px] sm:h-[220px] w-full bg-gradient-to-br from-[#0B57D0] to-[#084298]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-[12px] font-bold text-[#1D1D1F] hover:bg-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Усі події
          </Link>
          <div className="flex items-center gap-2">
            {session && (
              <Link
                href={`/admin/events/${item.id}`}
                title="Редагувати"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-[12px] font-bold text-[#0B57D0] hover:bg-white transition"
              >
                <Pencil className="h-3.5 w-3.5" /> Редагувати
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B3261E] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
              <TriangleAlert className="h-3 w-3" /> Подія
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[12px] font-medium text-white">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.publishedAt)}
          </p>
          <h1 className="mt-2 text-[18px] sm:text-[24px] sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis font-bold leading-tight tracking-tight text-white">
            {item.title}
          </h1>
        </div>
      </div>

      {/* Текст */}
      <div className="mt-4 m3-card p-6 sm:p-8">
        {item.excerpt && (
          <p className="text-[15px] sm:text-[17px] font-medium leading-relaxed text-[#1D1D1F] border-l-4 border-[#0B57D0] pl-4">
            {item.excerpt}
          </p>
        )}
        <div
          className="mt-5 rich-content whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatContent(item.content || "") }}
        />

        {/* Дії */}
        <div className="mt-7 pt-5 border-t border-black/[0.06] flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[13px] font-bold hover:bg-black/[0.04] transition"
          >
            <ArrowLeft className="h-4 w-4" /> До всіх подій
          </Link>
          <a
            href="tel:301111"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B3261E] text-white px-6 py-3 text-[13px] font-bold hover:bg-[#8C1D18] transition"
          >
            <Phone className="h-4 w-4" /> Аварійна 30-11-11
          </a>
        </div>
      </div>
    </div>
  );
}
