import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Додаткова інформація" };

export default function Page() {
  return (
    <PageLayout title="Додаткова інформація" breadcrumbs={[{ label: "Додаткова інформація" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Корисні посилання для споживачів.</p><ul class="list-disc ml-6 mt-3 text-sm"><li><a href="/normativni-dokumenti">Нормативні документи</a></li><li><a href="/kontrol-yakosti">Якість води</a></li></ul>` }} />
      
    </PageLayout>
  );
}
