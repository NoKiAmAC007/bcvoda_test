// Fallback mock data that mirrors old site structure, used when DB is empty
// Will be replaced by Prisma queries

export const siteConfig = {
  name: "БілоцерківВода",
  fullName: 'ТОВ "БІЛОЦЕРКІВВОДА"',
  description: "Виконавець послуг централізованого водопостачання та водовідведення в м. Біла Церква",
  contacts: {
    emergency: "30-11-11",
    general: "30-11-15",
    callCenter: "0-800-604-513",
    address: "09100, Київська обл., м. Біла Церква, вул. Сухоярська, 14",
    director: "Тетяна Бойко",
    email: "office@bcvoda.com.ua",
  },
  social: {
    youtube: "https://www.youtube.com/channel/UCo3WeZ38RIaiKF77XR8F88w/feed",
    facebook: "https://www.facebook.com/bilotserkivoda",
  },
  cabinets: {
    personal: "http://my.bcvoda.com.ua/",
    legal: "http://cabinet.bcvoda.com.ua",
    map: "http://bcvoda.com.ua/komertsiyniy-oblik-vodi",
  },
};

export const heroSlides = [
  { id: 1, title: "Біла Церква", image: "/uploads/bcvoda/DSC56511-700x2872.jpg", href: "/pro-nas" },
  { id: 2, title: "Хіміко-бактеріологічна лабораторія", image: "/uploads/bcvoda/DSC5853-700x287.jpg", href: "/kontrol-yakosti" },
  { id: 3, title: "Річка Рось", image: "/uploads/bcvoda/DSC6171-700x287.jpg", href: "/pro-nas" },
];

export const usp = [
  { title: "Перший водоканал в Україні, успішно переданий в концесію", icon: "award" },
  { title: "Виконавець послуг централізованого водопостачання та водовідведення в м. Біла Церква", icon: "droplets" },
  { title: "Цілодобовий контроль за якістю питної води та стічних вод", icon: "flask" },
];

export const services = [
  { slug: "pitannya-vidpovid", title: "Питання — відповідь", icon: "help" },
  { slug: "priyom-gromadyan", title: "Прийом громадян", icon: "users" },
  { slug: "tarifi", title: "Тарифи", icon: "wallet" },
  { slug: "otrimannya-tehnichnih-umov", title: "Отримання технічних умов", icon: "settings" },
  { slug: "povirka-lichilnikiv", title: "Повірка лічильників", icon: "gauge" },
  { slug: "normi-spozhivannya-vodi", title: "Норми споживання води", icon: "cup" },
  { slug: "dodatkova-informatsiya", title: "Додаткова інформація", icon: "file" },
];

export const mockNews = [
  {
    slug: "shanovni-spozhivachi-8",
    title: "Шановні споживачі!",
    excerpt: "Повідомляємо, що з 01 вересня 2026 року для ТОВ «БІЛОЦЕРКІВВОДА» було встановлено нові тарифи на централізоване водопостачання та водовідведення.",
    content: "<p>Повідомляємо, що з 01 вересня 2026 року для ТОВ «БІЛОЦЕРКІВВОДА» було встановлено нові тарифи на централізоване водопостачання та водовідведення. Детальніше в розділі Тарифи.</p>",
    image: null,
    publishedAt: "2026-08-28",
    category: "news" as const,
  },
];

export const mockEvents = [
  {
    slug: "avariyno-remontni-roboti-na-merezhah-115",
    title: "Аварійно-ремонтні роботи на мережах",
    excerpt: "28.8.2026 проводяться аварійно-ремонтні роботи по вул. Котляревського, 112 – розкопка та ремонт водопровідної мережі d – 150 мм.",
    content: "<p>28.8.2026 проводяться аварійно-ремонтні роботи по вул. Котляревського, 112 – розкопка та ремонт водопровідної мережі d – 150 мм.</p>",
    image: "https://bcvoda.com.ua/wp-content/uploads/2026/08/789034348_1524161699510971_8448178838052110773_n-130x130.jpg",
    publishedAt: "2026-08-28",
    category: "event" as const,
  },
];

export const mockReports = [
  {
    slug: "virobnicho-finansovi-pokazniki-za-lipen-2026",
    title: "Виробничо-фінансові показники за липень 2026",
    excerpt: "",
    publishedAt: "2026-08-06",
    category: "report" as const,
  },
];

export const navLinks = [
  { href: "/aktualna-informatsiya", label: "Актуальна інформація" },
  { href: "/spozhyvacham", label: "Споживачам", children: services.map(s => ({ href: `/${s.slug}`, label: s.title })) },
  { href: "/kontrol-yakosti", label: "Якість води" },
  { href: "/zviti", label: "Звіти" },
  { href: "/gallery", label: "Галерея" },
  { href: "/normativni-dokumenti", label: "Нормативні документи" },
  { href: "/pro-nas", label: "Про нас" },
  { href: "/tsikave-pro-vodu", label: "Цікаве про воду" },
  { href: "/sotsialni-proekti", label: "Соціальні проекти" },
];

export async function getLatestContent() {
  // 100% admin-controlled — no mock fallback. If DB empty, return null (site shows "Немає записів")
  try {
    const { prisma } = await import("./prisma");
    const [news, events, reports, eventCount, reportCount] = await Promise.all([
      prisma.news.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.event.findMany({ orderBy: { publishedAt: "desc" }, take: 100 }),
      prisma.report.findMany({ orderBy: { publishedAt: "desc" }, take: 100 }),
      prisma.event.count(),
      prisma.report.count(),
    ]);
    return {
      news: news[0] ?? null,
      event: events[0] ?? null,
      report: reports[0] ?? null,
      newsList: news,
      eventsList: events,
      reportsList: reports,
      totalEvents: eventCount,
      totalReports: reportCount,
    };
  } catch {
    return { news: null, event: null, report: null, newsList: [], eventsList: [], reportsList: [], totalEvents: 0, totalReports: 0 };
  }
}
