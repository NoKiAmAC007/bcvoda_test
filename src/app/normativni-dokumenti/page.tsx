import { prisma } from "@/lib/prisma";
import { NormativniClient } from "@/components/normativni-client";

export const metadata = { title: "Нормативні документи" };

const staticDocs = [
  { id: "1", title: 'Закон України "Про питну воду, питне водопостачання та водовідведення"', fileUrl: "#", category: "Закони" },
  { id: "2", title: "Закон України «Про житлово-комунальні послуги»", fileUrl: "#", category: "Закони" },
  { id: "3", title: "Постанова КМУ №630 — Правила надання послуг", fileUrl: "#", category: "Постанови" },
  { id: "4", title: "Рішення виконкому БМР №616 — тарифи з 01.09.2026", fileUrl: "https://bcvoda.com.ua/wp-content/uploads/2026/08/tarif-rishennya-1.pdf", category: "Рішення" },
  { id: "5", title: "ДСанПіН 2.2.4-171-10 — гігієнічні вимоги до питної води", fileUrl: "#", category: "Нормативи" },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const { q, cat } = await searchParams;
  let docs: { id: string; title: string; fileUrl: string; category: string }[] = [];
  try {
    const dbDocs = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });
    // filter category "normative" fallback to all if none
    const normative = dbDocs.filter((d) => d.category === "normative");
    const source = normative.length > 0 ? normative : dbDocs;
    if (source.length > 0) {
      docs = source.map((d) => ({ id: d.id, title: d.title, fileUrl: d.fileUrl, category: d.category }));
    }
  } catch {}
  if (docs.length === 0) docs = staticDocs;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <a href="/" className="hover:text-[#0B57D0]">Головна</a> <span>/</span> <span className="text-[#1C1B1F] font-medium">Нормативні документи</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight">Нормативні документи</h1>
      <p className="mt-1 text-[13px] text-[#6E6E73]">Закони, постанови, рішення та нормативи — актуальна база.</p>
      <NormativniClient docs={docs} initialQ={q || ""} initialCat={cat || "Всі"} />
    </div>
  );
}
