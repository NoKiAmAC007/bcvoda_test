import { NextRequest, NextResponse } from "next/server";

// Проксі для кабінетів — готова архітектура, чекає на реальні API-ключі
// Зараз повертає заглушку, щоб фронт міг інтегруватися без зовнішнього сервісу

const CABINETS: Record<string, string> = {
  personal: "http://my.bcvoda.com.ua",
  legal: "http://cabinet.bcvoda.com.ua",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const [cabinet, ...rest] = path || [];
  const targetBase = CABINETS[cabinet];

  if (!targetBase) {
    return NextResponse.json(
      { error: "Unknown cabinet. Use /api/cabinet/personal/* or /api/cabinet/legal/*", available: Object.keys(CABINETS) },
      { status: 400 }
    );
  }

  // TODO: коли буде доступ до реального API кабінетів:
  // const url = `${targetBase}/${rest.join("/")}?${req.nextUrl.searchParams.toString()}`
  // const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.CABINET_API_KEY}` } })
  // return new NextResponse(await res.text(), { status: res.status, headers: res.headers })

  return NextResponse.json({
    ok: true,
    stub: true,
    message: `Проксі для ${cabinet} готовий. Додайте CABINET_API_KEY в .env та розкоментайте fetch в цьому файлі.`,
    requested: `/${rest.join("/")}`,
    query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    target: targetBase,
  });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  // для POST — та сама логіка, проксює тіло
  return GET(req, ctx);
}
