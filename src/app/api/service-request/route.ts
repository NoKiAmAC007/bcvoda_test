import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const name = String(body.name || body.fullName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const address = String(body.address || "").trim();
    const type = String(body.type || "other").trim();
    const message = String(body.message || "").trim();
    const fileName = body.fileName ? String(body.fileName) : null;

    if (!phone) return NextResponse.json({ error: "Телефон обовʼязковий" }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Невірний email" }, { status: 400 });
    }
    if (!name) return NextResponse.json({ error: "ПІБ обовʼязкове" }, { status: 400 });

    const allowed = ["connection", "tech", "meter", "complaint", "reception", "other"];
    const safeType = allowed.includes(type) ? type : "other";

    const payload = { name, phone, email, address, type: safeType, message, fileName, createdAt: new Date().toISOString() };
    console.log("[service-request]", JSON.stringify(payload));

    // Try to persist if ServiceRequest model exists — ignore if not
    try {
      const { prisma } = await import("@/lib/prisma");
      // @ts-ignore — optional model
      if (prisma.serviceRequest) {
        // @ts-ignore
        await prisma.serviceRequest.create({ data: { name, phone, email, address, type: safeType, message, fileName } });
      }
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[service-request] error", e);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
