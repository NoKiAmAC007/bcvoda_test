import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Соціальні проекти" };

export default function Page() {
  return (
    <PageLayout title="Соціальні проекти" breadcrumbs={[{ label: "Соціальні проекти" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Соціальні ініціативи: екскурсії, дні відкритих дверей.</p><div class="not-prose mt-4 rounded-xl bg-cyan-50 border border-cyan-100 p-6 text-center"><p class="font-semibold text-cyan-900">Хочете долучитися?</p><p class="text-sm text-cyan-800 mt-1">office@bcvoda.com.ua</p></div>` }} />
      
    </PageLayout>
  );
}
