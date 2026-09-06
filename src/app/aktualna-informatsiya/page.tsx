import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Актуальна інформація" };

export default function Page() {
  return (
    <PageLayout title="Актуальна інформація" breadcrumbs={[{ label: "Актуальна інформація" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Оперативні повідомлення, відключення, зміни тарифів.</p><div class="not-prose mt-4 flex gap-3"><a href="/events" class="rounded-full bg-cyan-700 text-white px-5 py-2 text-sm font-semibold no-underline">Події</a><a href="/reports" class="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold no-underline">Звіти</a></div>` }} />
      
    </PageLayout>
  );
}
