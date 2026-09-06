import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Питання — відповідь" };

export default function Page() {
  return (
    <PageLayout title="Питання — відповідь" breadcrumbs={[{ label: "Питання — відповідь" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<h3>Часті запитання</h3>
<details class="mt-3 rounded-xl border border-slate-200 p-4"><summary class="font-semibold cursor-pointer">Як передати показники лічильника?</summary><p class="mt-2 text-sm text-slate-600">Через <a href="http://my.bcvoda.com.ua/" target="_blank">Мій кабінет</a>, за телефоном 0-800-604-513.</p></details>
<details class="rounded-xl border border-slate-200 p-4"><summary class="font-semibold cursor-pointer">Куди звертатися при аварії?</summary><p class="mt-2 text-sm text-slate-600">Аварійна служба: 30-11-11 (цілодобово).</p></details>
` }} />
      
    </PageLayout>
  );
}
