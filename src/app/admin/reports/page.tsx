import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteForm } from "@/components/admin-delete-btn";
import { BulkDeleteButton } from "@/components/admin/bulk-delete-btn";
import { ReportCreateForm } from "@/components/admin/forms/report-form";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Звіти</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{reports.length} записів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати звіт</h3>
        <p className="text-[12px] text-[#6E6E73] mb-4">Реалістичний звіт: заголовок + фото обкладинки + PDF файл + дата + превʼю</p>
        <ReportCreateForm />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Всі звіти</h3>
          {reports.length > 0 && <BulkDeleteButton endpoint="/api/reports" label="звітів" />}
        </div>
        <div className="space-y-2">
          {reports.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              {r.image ? <img src={r.image} alt="" className="h-10 w-14 rounded-lg object-cover border border-black/10 shrink-0" /> : r.fileUrl ? <div className="h-10 w-14 rounded-lg bg-[#E8F0FE] border border-black/10 shrink-0 grid place-items-center text-[10px] font-bold text-[#0B57D0]">PDF</div> : <div className="h-10 w-14 rounded-lg bg-[#F5F5F7] border border-black/10 shrink-0 grid place-items-center text-[10px] text-[#86868B]">no img</div>}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium break-words whitespace-normal [overflow-wrap:anywhere]">{r.title}</p>
                <p className="text-[11px] text-[#86868B] break-words whitespace-normal [overflow-wrap:anywhere]">{r.excerpt || "—"} • {r.publishedAt?.toLocaleDateString("uk-UA")} {r.fileUrl ? "• PDF" : ""}</p>
              </div>
              <Link href={`/admin/reports/${r.id}`} title="Редагувати" className="h-8 w-8 rounded-full bg-white border border-black/10 hover:bg-[#E8F0FE] hover:border-[#BFDBFE] hover:text-[#0B57D0] text-[#6E6E73] grid place-items-center transition-colors shrink-0">
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteForm action={`/api/reports/${r.id}`} iconOnly />
            </div>
          ))}
          {!reports.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
