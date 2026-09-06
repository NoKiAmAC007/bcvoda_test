import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Споживачам" };

export default function Page() {
  return (
    <PageLayout title="Споживачам" breadcrumbs={[{ label: "Споживачам" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Усі сервіси для споживачів.</p>` }} />
      <div className="not-prose mt-6 grid sm:grid-cols-2 gap-3">{services.map(s=>(<Link key={s.slug} href={`/${s.slug}`} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50"><span className="font-semibold text-sm">{s.title}</span></Link>))}</div>
    </PageLayout>
  );
}
