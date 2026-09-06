import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscribersClient } from "@/components/admin/subscribers-client";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Абоненти (ПІБ)</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{subs.length} записів • окрема база для лічильників — пошук по рахунку показує ПІБ (напр. 56101 → Засадюк Олександр Костянтинович)</p>
      </div>
      <SubscribersClient initial={subs as any} />
    </div>
  );
}
