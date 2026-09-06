import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Цікаве про воду" };

export default function Page() {
  return (
    <PageLayout title="Цікаве про воду" breadcrumbs={[{ label: "Цікаве про воду" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Цікаві факти про воду та річку Рось.</p><div class="not-prose grid sm:grid-cols-2 gap-4 mt-4"><div class="rounded-xl border border-slate-200 p-4"><h4 class="font-bold">Рось — 346 км</h4><p class="text-sm text-slate-600 mt-1">Права притока Дніпра.</p></div></div>` }} />
      
    </PageLayout>
  );
}
