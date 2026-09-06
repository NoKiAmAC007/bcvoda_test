import { PageLayout } from "@/components/page-layout";

export const metadata = { title: "Мапа комерційного обліку" };

export default function MapPage() {
  return (
    <PageLayout title="Мапа комерційного обліку води" breadcrumbs={[{ label: "Мапа" }]}>
      <p>Інтерактивна мапа вузлів комерційного обліку води (інтеграція з зовнішнім сервісом).</p>
      <div className="not-prose mt-4">
        <a href="http://bcvoda.com.ua/komertsiyniy-oblik-vodi" target="_blank" className="rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold inline-flex">Відкрити оригінальну мапу →</a>
      </div>
      <div className="not-prose mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Тут буде вбудована мапа Leaflet / Google Maps з API кабінету. Для інтеграції потрібен доступ до API my.bcvoda.com.ua.
        <br />
        <span className="text-xs">Заглушка — готова до підключення бекенду мапи.</span>
      </div>
    </PageLayout>
  );
}
