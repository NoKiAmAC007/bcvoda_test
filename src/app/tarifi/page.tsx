import { PageLayout } from "@/components/page-layout";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Тарифи" };

export default async function Page() {
  let tariffs: Awaited<ReturnType<typeof prisma.tariff.findMany>> = [];
  try {
    tariffs = await prisma.tariff.findMany({ orderBy: { validFrom: "desc" } });
  } catch {}

  return (
    <PageLayout title="Тарифи" breadcrumbs={[{ label: "Тарифи" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<div class="flex flex-wrap items-center gap-x-4 gap-y-3">
<p class="flex-1 min-w-[240px]">Рішенням виконкому БМР №616 від 25.08.2026 встановлено тарифи з 01.09.2026 — актуально на сьогодні 01.09.2026.</p>
<a href="https://bcvoda.com.ua/wp-content/uploads/2026/08/tarif-rishennya-1.pdf" target="_blank" class="not-prose inline-flex shrink-0 rounded-full bg-[#0B57D0] text-white px-5 py-2 text-sm font-semibold">Рішення №616 PDF →</a>
</div>
<div class="not-prose mt-4 grid gap-4">
  <div class="rounded-xl border border-slate-200 p-4 bg-white">
    <h3 class="font-bold">Водопостачання</h3>
    <p class="text-2xl font-extrabold text-[#0B57D0] mt-1">30,75 грн/м³ <span class="text-sm font-normal text-slate-500">без ПДВ • з 01.09.2026</span></p>
    <p class="text-xs text-slate-500 mt-1">Для суб’єктів господарювання — 11,62 грн/м³ без ПДВ</p>
  </div>
  <div class="rounded-xl border border-slate-200 p-4 bg-white">
    <h3 class="font-bold">Водовідведення</h3>
    <p class="text-2xl font-extrabold text-[#0B57D0] mt-1">48,50 грн/м³ <span class="text-sm font-normal text-slate-500">без ПДВ • з 01.09.2026</span></p>
  </div>
</div>
` }} />

      {tariffs.length > 0 && (
        <div className="not-prose mt-8">
          <h3 className="text-[16px] font-bold text-[#1D1D1F]">Історія тарифів</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#49454F]">Послуга</th>
                  <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#49454F]">Ціна</th>
                  <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#49454F]">Одиниця</th>
                  <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#49454F]">Категорія</th>
                  <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#49454F]">Діє з</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((t) => (
                  <tr key={t.id} className="border-t border-black/5">
                    <td className="px-4 py-2 font-medium">{t.title}</td>
                    <td className="px-4 py-2 font-bold text-[#0B57D0]">{t.price}</td>
                    <td className="px-4 py-2 text-[#6E6E73]">{t.unit}</td>
                    <td className="px-4 py-2"><span className="rounded-full bg-[#F3EDF7] px-2 py-0.5 text-xs">{t.category}</span></td>
                    <td className="px-4 py-2 text-[#6E6E73]">{new Date(t.validFrom).toLocaleDateString("uk-UA")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </PageLayout>
  );
}
