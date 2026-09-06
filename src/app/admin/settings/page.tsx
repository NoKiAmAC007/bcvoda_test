import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/forms/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (!settings) settings = await prisma.siteSettings.create({ data: { id: "main" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Налаштування</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">Керує 100% контактів сайту — головна, шапка, BusinessHoursWidget, footer, карта аварій • Material 3</p>
      </div>
      <SettingsForm initial={settings as any} />
    </div>
  );
}
