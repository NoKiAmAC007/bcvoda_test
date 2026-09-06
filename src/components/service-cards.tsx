import Link from "next/link";
import { HelpCircle, Users, Wallet, Settings, Gauge, CupSoda, FileText } from "lucide-react";
import { services } from "@/lib/data";

const icons: Record<string, React.ReactNode> = {
  help: <HelpCircle className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  wallet: <Wallet className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  gauge: <Gauge className="h-5 w-5" />,
  cup: <CupSoda className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
};

export function ServiceCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/${s.slug}`}
          className="group relative overflow-hidden glass rounded-2xl p-4 flex items-center gap-3 hover:shadow-[0_8px_24px_rgba(14,122,138,0.12)] hover:scale-[1.01] transition-all"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[#0e7a8a]/[0.06] to-transparent" />
          <span className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#0f2a3a] to-[#1a7a8a] text-white group-hover:from-[#0e7a8a] group-hover:to-[#1a9ab0] flex items-center justify-center shrink-0 shadow-md transition-colors">
            {icons[s.icon]}
          </span>
          <span className="relative text-sm font-bold leading-tight text-slate-800">{s.title}</span>
          <span className="ml-auto opacity-0 group-hover:opacity-100 text-[#0e7a8a] transition-opacity">›</span>
        </Link>
      ))}
    </div>
  );
}
