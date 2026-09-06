import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";
import { EventEditForm } from "@/components/admin/forms/event-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Редагувати подію</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{event.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[13px] font-semibold text-[#1D1D1F] mb-4">Редагування — з фото та датою</h3>
        <EventEditForm initial={{ id: event.id, title: event.title, slug: event.slug, excerpt: event.excerpt, content: event.content, image: event.image, publishedAt: event.publishedAt.toISOString() }} />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#B3261E] mb-4">Небезпечна зона</h3>
        <DeleteForm action={`/api/events/${event.id}`} />
      </div>
    </div>
  );
}
