import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WaterBackground } from "@/components/water-background";
import { Providers } from "@/components/providers";
import { AnnouncementProvider } from "@/components/announcement-modal";
import { StyleSwitcher } from "@/components/style-switcher";
import { RouteShell } from "@/components/route-shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "БілоцерківВода — водопостачання та водовідведення м. Біла Церква",
    template: "%s | БілоцерківВода",
  },
  description: 'ТОВ "БІЛОЦЕРКІВВОДА" — виконавець послуг централізованого водопостачання та водовідведення в м. Біла Церква. Аварійна 30-11-11, Call-центр 0-800-604-513.',
  metadataBase: new URL("https://bcvoda.com.ua"),
  openGraph: {
    title: "БілоцерківВода",
    description: "Водопостачання та водовідведення м. Біла Церква",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-mono" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <AnnouncementProvider>
            <WaterBackground />
            <div className="flex min-h-screen">
              <RouteShell>{children}</RouteShell>
            </div>
            <StyleSwitcher />
          </AnnouncementProvider>
        </Providers>
      </body>
    </html>
  );
}
