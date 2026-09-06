import { PageLayout } from "@/components/page-layout";
import { ServiceRequestForm } from "@/components/service-request-form";

export const metadata = { title: "Прийом громадян" };

export default function Page() {
  return (
    <PageLayout title="Прийом громадян" breadcrumbs={[{ label: "Прийом громадян" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Графік прийому громадян керівництвом ТОВ "БІЛОЦЕРКІВВОДА".</p>
<table class="w-full text-sm mt-4 border"><thead><tr class="bg-slate-50"><th class="p-2 text-left border">Посадова особа</th><th class="p-2 text-left border">Дні</th><th class="p-2 text-left border">Години</th></tr></thead>
<tbody><tr><td class="p-2 border">Директор</td><td class="p-2 border">Вівторок, четвер</td><td class="p-2 border">14:00–16:00</td></tr></tbody></table>` }} />
      <ServiceRequestForm defaultType="reception" />
    </PageLayout>
  );
}
