import Link from "next/link";

export const metadata = { title: "Про нас — БілоцерківВода" };

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-[#6E6E73] flex gap-1.5">
        <Link href="/" className="hover:text-[#0B57D0]">Головна</Link> <span>/</span> <span className="text-[#1C1B1F] font-medium">Про нас</span>
      </nav>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight">Про нас</h1>
      <p className="mt-1 text-sm text-[#6E6E73]">ТОВ «БІЛОЦЕРКІВВОДА» — з 01 липня 2013 року виконавець послуг водопостачання та водовідведення в м. Біла Церква.</p>

      {/* УТП — 5 блоків як на оригіналі, тепер локальні картинки */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { img: "/uploads/pro-nas/whitelogo.png", t: "Перший водоканал в Україні, успішно переданий в концесію" },
          { img: "/uploads/bcvoda/DSC6171-700x287.jpg", t: "Обслуговує: м. Біла Церква, забезпечує питною водою: м. Умань та с. М. Вільшанка" },
          { img: "/uploads/bcvoda/DSC5853-700x287.jpg", t: "Цілодобовий контроль за якістю питної води та стічних вод" },
          { icon: "locate", t: "Київська область,\nм. Біла Церква,\nвул. Сухоярська, 14" },
          { icon: "cup", t: "Джерело — р. Рось, білоцерківське верхнє водосховище, с. Глибічка" },
        ].map((b: any, i) => (
          <div key={b.t} className="m3-card p-4 text-center overflow-hidden flex flex-col">
            {b.icon ? (
              <div className="w-full h-24 rounded-2xl bg-[#E8F0FE] flex items-center justify-center">
                {b.icon === "locate" ? (
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#0B57D0]" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 21s7-6 7-11a7 7 0 1 0 -14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="3" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#0B57D0]" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 22a7 7 0 0 0 7-7c0-3.5-3-6-7-10-4 4-7 6.5-7 10a7 7 0 0 0 7 7z" /><path d="M9 12c0 1 1 2 3 2s3-1 3-2" /></svg>
                )}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.img} alt="" className="w-full h-24 object-cover rounded-2xl" />
            )}
            <p className="mt-3 text-xs font-medium leading-tight px-1 flex-1 flex items-center justify-center whitespace-pre-line">{b.t}</p>
          </div>
        ))}
      </div>

      {/* Місія */}
      <div className="mt-6 m3-card overflow-hidden">
        <div className="bg-[#0B57D0] text-white px-6 py-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/pro-nas/whitelogo.png" alt="" className="h-8 w-auto brightness-0 invert" />
          <p className="font-semibold">Місія компанії: Забезпечувати людей чистою та якісною водою кожного дня</p>
        </div>
        <div className="p-6 lg:p-8 space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-base">1. Основний пріоритет — подача в кожний дім чистої води</h3>
            <p className="mt-1 text-[#49454F]">Введення нових технологій та оновлення споруд дозволить досягнути результату та зберігати його на належному рівні протягом діяльності підприємства.</p>
          </div>
          <div>
            <h3 className="font-bold">2. Надання якісної своєчасної послуги усім споживачам</h3>
            <p className="mt-1 text-[#49454F]">Ми віримо, що вода — унікальний ресурс. Тільки вода має памʼять і реагує на зміну середовища. Тому до неї слід відноситися з ретельністю, акуратністю, дбайливістю і навіть з любовʼю…</p>
          </div>
          <div>
            <h3 className="font-bold">3. Наш клієнт завжди на першому місці</h3>
            <p className="mt-1 text-[#49454F]">Принципи: Відкритість • Чесність • Толерантність • Етичність.</p>
          </div>
          <div>
            <h3 className="font-bold">4. Працівники — основа репутації</h3>
            <p className="mt-1 text-[#49454F]">Професіоналізм, відповідальність, взаємоповага, чесність, простота та співпереживання — наше кредо.</p>
          </div>
          <div>
            <h3 className="font-bold">5. Не співпрацюємо з порушниками</h3>
            <p className="mt-1 text-[#49454F]">Хто порушує законодавство, права робітників, охорону праці та довкілля.</p>
          </div>
          <div>
            <h3 className="font-bold">6. Соціально-відповідальний бізнес</h3>
            <p className="mt-1 text-[#49454F]">Підтримуємо заходи для молоді, екологічні ініціативи, важливі для громади.</p>
          </div>
          <div>
            <h3 className="font-bold">7. Політика підприємства</h3>
            <ul className="mt-1 list-disc ml-5 text-[#49454F] space-y-1">
              <li>задоволення потреб споживачів та зацікавлених сторін</li>
              <li>безпека для довкілля</li>
              <li>попередження шкоди здоровʼю персоналу</li>
              <li>удосконалення СМЯ за ISO, відповідність законодавству, управління ризиками, екобезпечні процеси, підвищення компетентності</li>
            </ul>
            <p className="mt-2 text-xs text-[#6E6E73]">Керівництво бере зобовʼязання за реалізацію Політики та інформування.</p>
          </div>
        </div>
      </div>

      {/* Адреса та філії */}
      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="m3-card p-6">
          <h3 className="font-bold">ТОВ «БІЛОЦЕРКІВВОДА»</h3>
          <p className="mt-1 text-sm">Адреса: 09100, Київська обл., м. Біла Церква, вул. Сухоярська, 14</p>
          <p className="mt-2 text-sm font-semibold">Філії:</p>
          <ul className="text-sm text-[#49454F] space-y-1">
            <li>• вул. Млинова, 11</li>
            <li>• бул. Олександрійський, 94 (готель «Рось», 2 пов.)</li>
            <li>• просп. Незалежності, 55 Б (маг. «Еней», 2 пов.)</li>
          </ul>
          <p className="mt-2 text-xs text-[#6E6E73]">Години: Пн–Чт 8:00–17:00, Пт 8:00–16:00, Сб–Нд вихідні.</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0B57D0]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="16" x="2" y="4" rx="4" fill="#E8DEF8" stroke="#0B57D0" strokeWidth="1.5" />
              <path d="M2 6l8 5.5a2 2 0 0 0 2.4 0L22 6" stroke="#0B57D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <a href="mailto:office@bcvoda.com.ua" className="text-[#0B57D0] hover:underline">office@bcvoda.com.ua</a>
          </p>
        </div>
        <div className="m3-card p-6 flex gap-4 items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/pro-nas/boyko.jpg" alt="Бойко Тетяна" className="h-40 w-28 object-cover rounded-2xl border shadow-sm" />
          <div>
            <p className="font-bold">Бойко Тетяна Юріївна</p>
            <p className="text-sm text-[#6E6E73]">Генеральний директор ТОВ «БІЛОЦЕРКІВВОДА»</p>
            <p className="mt-1 text-sm">Прийом громадян: середа 13:00–15:00</p>
            <p className="mt-2 text-xs">Приймальня <a href="tel:0456368212" className="text-[#0B57D0] hover:underline">(04563) 6-82-12</a> • <a href="tel:0456301112" className="text-[#0B57D0] hover:underline">(0456) 30-11-12</a><br /><a href="mailto:office@bcvoda.com.ua" className="text-[#0B57D0] hover:underline">office@bcvoda.com.ua</a> — Загальний <a href="tel:0456301115" className="text-[#0B57D0] hover:underline">(0456) 30-11-15</a> • Viber: <a href="tel:0673847703" className="text-[#0B57D0] hover:underline">0673847703</a></p>
          </div>
        </div>
      </div>

      <div className="mt-4 m3-card p-4 text-xs space-y-1">
        <p>Диспетчер (аварійна) (0456) 30-11-11 • Call-центр (0456) 30-11-30 / 0-800-604-513 • Viber 050 467-50-42 • Технічний (0456) 30-11-14 • Договірний (0456) 30-11-16</p>
      </div>
    </div>
  );
}
