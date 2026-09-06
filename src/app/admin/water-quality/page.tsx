import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WaterQualityCurrentForm, WaterQualityHistoryForm, HistoryRow } from "@/components/admin/forms/water-quality-form";
import { reportPublicUrl } from "@/lib/report-url";

export const dynamic = "force-dynamic";

export default async function WaterQualityAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  let current = await prisma.waterQuality.findUnique({ where: { id: "current" } });
  if (!current) current = await prisma.waterQuality.create({ data: { id: "current" } });
  const history = await prisma.waterQualityHistory.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const autoReports = await prisma.qualityReport.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }], take: 9 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Якість води</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">Керує KPI pH, віджетом якості, картою якості та дашбордом • 100% звʼязок з сайтом</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Автосинхронізація з bcvoda.com.ua — щодня о 10:00 (Київ)</h3>
        <p className="text-[12px] text-[#6E6E73] mt-1">
          Скрипт <code className="bg-black/5 px-1 rounded">scripts/quality-daily.ts</code> + крон{" "}
          <code className="bg-black/5 px-1 rounded">/api/cron/quality-daily</code>. Якщо зʼявляється новий звіт — сайт оновлюється сам:
          посилання, місяць і цифри (pH/хлор/жорсткість/каламутність з PDF).
        </p>
        <div className="mt-3 grid gap-2">
          {autoReports.length ? autoReports.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 text-[12px] rounded-xl bg-[#F5F5F7] px-3 py-2">
              <span className="font-medium truncate">{r.category === "pitna" ? "Питна" : r.category === "kos" ? "КОС" : "Рось"} — {r.title}</span>
              <a href={reportPublicUrl(r)} target="_blank" className="text-[#0B57D0] shrink-0 font-semibold">PDF →</a>
            </div>
          )) : (
            <p className="text-[13px] text-[#86868B]">Ще не синхронізовано — запусти <code className="bg-black/5 px-1 rounded">npx tsx scripts/quality-daily.ts</code></p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Поточні показники (KPI на головній)</h3>
        <WaterQualityCurrentForm initial={current as any} />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати точку історії (графік 6 місяців)</h3>
        <WaterQualityHistoryForm />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Історія ({history.length}) — порядок = порядок на графіку</h3>
        <div className="space-y-2">
          {history.map(h => <HistoryRow key={h.id} h={h as any} />)}
          {!history.length && <p className="text-[13px] text-[#86868B]">Немає точок — додай 6 місяців</p>}
        </div>
      </div>
    </div>
  );
}
