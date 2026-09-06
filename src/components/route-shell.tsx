"use client"
import { usePathname } from "next/navigation";
import { AppleSidebar } from "./apple-sidebar";
import { AndroidTopBar } from "./android-topbar";
import { Footer } from "./footer";

export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <AppleSidebar />
      <div className="flex-1 lg:ml-[240px] flex flex-col min-w-0">
        <AndroidTopBar />
        <main className="flex-1 cursor-pointer">{children}</main>
        <Footer />
      </div>
    </>
  );
}
