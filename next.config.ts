import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "bcvoda.com.ua" },
      { protocol: "http", hostname: "bcvoda.com.ua" },
    ],
  },
  async redirects() {
    return [
      // Критичні SEO 301 зі старого WP (аудит 1150 URL)
      { source: "/gallery-2", destination: "/gallery", permanent: true },
      { source: "/gallery-2/:path*", destination: "/gallery/:path*", permanent: true },
      { source: "/news_", destination: "/news", permanent: true },
      { source: "/news_/:slug", destination: "/news/:slug", permanent: true },
      { source: "/komertsiyniy-oblik-vodi", destination: "/map", permanent: true },
      { source: "/aktualna-informatsiya", destination: "/news", permanent: true },
      { source: "/aktualna-informatsiya/:path*", destination: "/news/:path*", permanent: true },
      { source: "/novini", destination: "/news", permanent: true },
      { source: "/novini/:path*", destination: "/news/:path*", permanent: true },
      { source: "/podiyi", destination: "/events", permanent: true },
      { source: "/podiyi/:path*", destination: "/events/:path*", permanent: true },
      { source: "/zviti", destination: "/reports", permanent: true },
      { source: "/interested_about_water/:path*", destination: "/tsikave-pro-vodu/:path*", permanent: true },
      { source: "/social_projects/:path*", destination: "/sotsialni-proekti/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Проксі для старих файлів — не втрачаємо індексацію PDF
      { source: "/wp-content/:path*", destination: "https://bcvoda.com.ua/wp-content/:path*" },
    ];
  },
};

export default nextConfig;
