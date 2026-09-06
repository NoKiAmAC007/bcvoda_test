# Білоцерківвода — новий движок

Переписаний сайт https://bcvoda.com.ua/ на сучасному стеку.

## Стек

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS 4** + shadcn/ui
- **Prisma 6** + SQLite (dev) / Postgres (prod, Neon/Vercel Postgres)
- **Headless CMS** власна адмінка на `/admin` (CRUD для новин/подій/звітів)
- SEO: sitemap.xml, robots.txt, 301 редиректи, metadata

## Структура контенту

Зі старого WordPress перенесено всі розділи:

| Старий URL | Новий |
|---|---|
| `/aktualna-informatsiya` | `/aktualna-informatsiya` + `/news` `/events` |
| `/pitannya-vidpovid` | `/pitannya-vidpovid` |
| `/priyom-gromadyan` | `/priyom-gromadyan` |
| `/tarifi` | `/tarifi` (редагується в БД) |
| `/otrimannya-tehnichnih-umov` | `/otrimannya-tehnichnih-umov` |
| `/povirka-lichilnikiv` | `/povirka-lichilnikiv` |
| `/normi-spozhivannya-vodi` | `/normi-spozhivannya-vodi` |
| `/dodatkova-informatsiya` | `/dodatkova-informatsiya` |
| `/kontrol-yakosti` | `/kontrol-yakosti` |
| `/zviti` + `/reports/*` | `/zviti` `/reports` `/reports/[slug]` |
| `/gallery-2` | `/gallery` (301) |
| `/normativni-dokumenti` | `/normativni-dokumenti` |
| `/?p=9` | `/pro-nas` |
| `/komertsiyniy-oblik-vodi` | `/map` (301) |
| `my.bcvoda.com.ua` | `/api/cabinet/personal/*` проксі |
| `cabinet.bcvoda.com.ua` | `/api/cabinet/legal/*` проксі |

## Запуск

```bash
npm install
npx prisma db push
# наповнити демо-даними (або відкрити http://localhost:3000/api/seed)
npm run dev
# http://localhost:3000
# http://localhost:3000/admin — адмінка
```

## Адмінка

- `/admin` — список новин/подій/звітів, форми додавання, видалення
- API: `POST /api/news`, `POST /api/events`, `POST /api/reports` (JSON або form-data)
- `GET /api/seed` — заповнити БД даними зі старого сайту
- Для продакшн додати авторизацію (NextAuth + middleware) та замінити SQLite на Postgres:
  ```prisma
  datasource db { provider = "postgresql" url = env("DATABASE_URL") }
  ```

## Дизайн

Повний редизайн: mobile-first, сучасна типографіка (Geist), водна палітра (cyan 700), картки, hero-слайдер, липкий хедер, доступність.

Старий дизайн 2015 року на Bootstrap 3 + jQuery замінено на Tailwind + React.

## Хостинг (рекомендація)

- **Vercel** (оптимально для Next.js) + Neon Postgres
- Альтернатива: Docker на VPS (український хостинг) — `npm run build && npm run start`

## Кабінети — інтеграція

Зовнішні сервіси поки лишаються за лінками, але підготовлено проксі:
- `src/app/api/cabinet/[...path]/route.ts` — проксює запити до `my.bcvoda.com.ua` та `cabinet.bcvoda.com.ua`
- Додайте `CABINET_API_KEY` в `.env` та розкоментайте fetch.

Мапа ком. обліку — `/map`, готова до вбудовування Leaflet/Google Maps з API мапи.

## TODO для продакшн

- [ ] Додати NextAuth (ADMIN/EDITOR ролі)
- [ ] Міграція на Postgres + налаштувати `DATABASE_URL`
- [ ] Завантажити всі реальні новини/звіти з WP (скрипт парсингу)
- [ ] Підключити реальні API кабінетів
- [ ] Додати завантаження файлів (S3 / Vercel Blob) для звітів/документів
- [ ] Налаштувати домен та 301 з bcvoda.com.ua
