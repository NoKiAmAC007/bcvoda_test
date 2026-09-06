import Link from "next/link";

export function PageLayout({ title, breadcrumbs, children }: { title: string; breadcrumbs?: { label: string; href?: string }[]; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {breadcrumbs && (
        <nav className="text-xs text-slate-500 mb-4 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#0e7a8a]">
            Головна
          </Link>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex gap-1.5">
              <span className="text-slate-300">/</span>{" "}
              {b.href ? (
                <Link href={b.href} className="hover:text-[#0e7a8a]">
                  {b.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="relative">
        <h1 className="relative text-[32px] font-semibold tracking-tight text-[#1D1D1F]">{title}</h1>
      </div>
      <div className="mt-6 m3-card p-6 sm:p-8 prose prose-slate max-w-none prose-a:text-[#0B57D0] prose-headings:text-[#1C1B1F]">
        {children}
      </div>
    </div>
  );
}
