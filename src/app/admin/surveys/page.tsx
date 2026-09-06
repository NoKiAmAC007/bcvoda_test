import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";

export const dynamic = "force-dynamic";

export default async function SurveysPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const surveys = await prisma.qualitySurvey.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Опитування якості</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{surveys.length} відповідей</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <div className="space-y-2">
          {surveys.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{s.firstName || s.lastName ? `${s.lastName || ""} ${s.firstName || ""}`.trim() : "Анонім"}</p>
                <p className="text-[11px] text-[#86868B]">{s.createdAt?.toLocaleDateString("uk-UA")} — {s.satisfaction || "—"}</p>
              </div>
              <span className="text-[13px] font-medium">{s.email || ""}</span>
            </div>
          ))}
          {!surveys.length && <p className="text-[13px] text-[#86868B]">Немає записів</p>}
        </div>
      </div>
    </div>
  );
}
