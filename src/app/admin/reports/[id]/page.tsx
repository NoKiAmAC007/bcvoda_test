import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";
import { ReportEditForm } from "@/components/admin/forms/report-form";

export const dynamic = "force-dynamic";

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати звіт</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{report.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[13px] font-semibold text-[#1D1D1F] mb-4">Редагування — з фото та PDF</h3>
        <ReportEditForm initial={{ id: report.id, title: report.title, slug: report.slug, excerpt: report.excerpt, content: report.content, image: report.image, fileUrl: report.fileUrl, publishedAt: report.publishedAt.toISOString() }} />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/reports/${report.id}`} />
      </div>
    </div>
  );
}
