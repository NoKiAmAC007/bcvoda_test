import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/admin-delete-btn";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1D1D1F]">Користувачі</h1>
        <p className="text-[13px] text-[#6E6E73] mt-1">{users.length} користувачів</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Додати користувача</h3>
        <form action="/api/users" method="post" className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="name" placeholder="Ім'я" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <input name="password" type="password" placeholder="Пароль" required className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0]" />
          <select name="role" defaultValue="EDITOR" className="w-full rounded-xl border border-black/[0.06] p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] bg-white">
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" className="rounded-full bg-[#0B57D0] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#0B57D0]/90">Створити</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-4">Всі користувачі</h3>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7]">
              <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-[#6E6E73]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{u.email}</p>
                <p className="text-[11px] text-[#86868B]">{u.name || "—"} · {u.createdAt.toLocaleDateString("uk-UA")}</p>
              </div>
              <span className={u.role === "ADMIN" ? "text-[11px] px-2 py-1 rounded-full bg-[#E8F0FE] text-[#0B57D0] font-medium" : "text-[11px] px-2 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] font-medium"}>
                {u.role}
              </span>
              <DeleteForm action={`/api/users/${u.id}`} />
            </div>
          ))}
          {!users.length && <p className="text-[13px] text-[#86868B]">Немає користувачів</p>}
        </div>
      </div>
    </div>
  );
}
