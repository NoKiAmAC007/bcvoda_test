import Link from "next/link";

export const metadata = { title: "Повірка лічильників — БілоцерківВода" };

function Price({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-[#F5F5F7] p-4 text-center shadow-[0_1px_3px_#00000014]">
      <p className="text-[12px] text-[#6E6E73]">{label}</p>
      <p className="mt-1 text-[20px] font-bold text-[#0B57D0] leading-none">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-[#86868B]">{sub}</p>}
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Повірка лічильників</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight min-h-[40px]">Повірка лічильників</h1>

      <div className="mt-6 space-y-6">
        <div className="m3-card p-6 lg:p-8">
          <h2 className="text-lg font-bold">Повірка та заміна лічильників населення</h2>

          <div className="mt-4 rounded-2xl bg-[#E3F2FD] p-4 sm:p-5">
            <p className="text-[14px] font-bold text-[#1D1D1F]">Без розпломбування та демонтажу</p>
            <p className="mt-1 text-[13px] text-[#49454F]">Роботи проводяться ліцензованими організаціями на місці експлуатації.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="tel:301130" className="rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-[#0B57D0] shadow-[0_1px_3px_#00000014] hover:shadow-md transition">30 11 30</a>
              <a href="tel:0800604513" className="rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-[#0B57D0] shadow-[0_1px_3px_#00000014] hover:shadow-md transition">0 800 604 513</a>
              <a href="tel:0504675042" className="rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-[#0B57D0] shadow-[0_1px_3px_#00000014] hover:shadow-md transition">050 467 50 42</a>
            </div>
            <p className="mt-3 text-[14px] text-[#1D1D1F]">Вартість — <span className="text-[18px] font-bold text-[#0B57D0]">360 грн</span> <span className="text-[11px] text-[#6E6E73]">• зміни 22.04.2026</span></p>
          </div>

          <h3 className="mt-6 text-[15px] font-bold text-[#1D1D1F]">Виїзд бригади</h3>

          <div className="mt-3">
            <p className="text-[14px] font-bold text-[#1D1D1F]">I. Повірка лічильників</p>
            <p className="text-[12px] text-[#6E6E73] mt-1">Квартири, приватний сектор – в будинку (виїзд, демонтаж, повірка, монтаж, пломбування)</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <Price label="1 лічильник" value="876,00 грн" />
              <Price label="2 лічильники" value="1 353,00 грн" />
            </div>
            <p className="text-[12px] text-[#6E6E73] mt-4">Приватний сектор – лічильник в колодязі (виїзд, зняття, повірка, установлення, пломбування)</p>
            <div className="mt-3 rounded-2xl bg-[#F5F5F7] p-4 text-center text-[14px] shadow-[0_1px_3px_#00000014]">
              <b>1 323,00</b> + <b>135,00</b> (пломбування) = <b className="text-[18px] text-[#0B57D0]">1 458,00 грн</b>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[14px] font-bold text-[#1D1D1F]">II. Заміна лічильників</p>
            <p className="text-[12px] text-[#6E6E73] mt-1">Квартири, приватний – лічильник в будинку (виїзд, заміна нового лічильника споживача, пломбування)</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <Price label="1 лічильник" value="421,50 грн" sub="391,50 + 30,00" />
              <Price label="2 лічильники" value="625,50 грн" sub="583,50 + 42,00" />
            </div>
            <p className="text-[12px] text-[#6E6E73] mt-4">Приватний сектор – лічильник в колодязі (виїзд, заміна, пломбування)</p>
            <div className="mt-3 rounded-2xl bg-[#F5F5F7] p-4 text-center text-[14px] shadow-[0_1px_3px_#00000014]">
              478,50 + 135,00 = <b className="text-[18px] text-[#0B57D0]">613,50 грн</b>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#F5F5F7] p-4 sm:p-5">
            <p className="text-[14px] font-bold text-[#1D1D1F]">Власними силами</p>
            <div className="mt-2 space-y-1.5 text-[13px] text-[#49454F]">
              <p>Повірка: 1 ліч-к 291,00 + 30,00 = <b>321,00 грн</b> • 2 ліч-ки 582,00 + 42,00 = <b>624,00 грн</b> • 1 колодязь 291,00 + 135,00 = <b>426,00 грн</b></p>
              <p>Пломбування: 1 лічильник — 30,00 коп., другий — 12,00 коп. = <b>42,00 грн</b> за 2</p>
              <p className="text-[11px] text-[#86868B]">Зміни внесено 01.03.2026</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href="https://bcvoda.com.ua/news_/neobhidno-poviriti-abo-zaminiti-lichilnik" target="_blank" className="rounded-full bg-[#0B57D0] text-white px-6 py-2.5 text-[13px] font-bold hover:bg-[#0842A0] transition">Необхідно повірити? →</a>
            <a href="tel:0673847703" className="rounded-full border border-black/10 px-6 py-2.5 text-[13px] font-bold hover:bg-black/[0.04] transition">067-384-77-03</a>
          </div>
        </div>

        <div className="m3-card p-6 lg:p-8">
          <h3 className="text-[15px] font-bold text-[#1D1D1F]">Для замовлення онлайн</h3>
          <ol className="mt-3 ml-5 list-decimal space-y-1.5 text-[13px] text-[#49454F]">
            <li>Подзвоніть <b>067-384-77-03</b> або напишіть на <b>Viber</b> / <a href="mailto:zagalnyy.viddil@bcvoda.com.ua" className="text-[#0B57D0] underline">zagalnyy.viddil@bcvoda.com.ua</a>, уточніть вартість та порядок заявки;</li>
            <li>Отримайте рахунок на оплату;</li>
            <li>Оплатіть — в призначенні вкажіть адресу, ПІБ;</li>
            <li>Перешліть на Viber копію платіжного документа разом із заявкою;</li>
            <li>Узгодьте дату виконання в телефонному режимі.</li>
          </ol>
          <p className="mt-3 text-[13px] font-medium text-[#1D1D1F]">Якщо лічильник не пройшов повірку — замініть.</p>
        </div>
      </div>
    </div>
  );
}
