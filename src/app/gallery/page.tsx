import { PageLayout } from "@/components/page-layout";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Галерея" };

export default function Page() {
  return (
    <PageLayout title="Галерея" breadcrumbs={[{ label: "Галерея" }]}>
      <div dangerouslySetInnerHTML={{ __html: `<p>Фото підприємства.</p><div class="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"><img src="https://bcvoda.com.ua/wp-content/uploads/2015/02/DSC56511-700x2872.jpg" class="rounded-xl object-cover h-40 w-full" alt="" /><img src="https://bcvoda.com.ua/wp-content/uploads/2015/02/DSC5853-700x287.jpg" class="rounded-xl object-cover h-40 w-full" alt="" /><img src="https://bcvoda.com.ua/wp-content/uploads/2015/01/DSC6171-700x287.jpg" class="rounded-xl object-cover h-40 w-full" alt="" /></div>` }} />
      
    </PageLayout>
  );
}
