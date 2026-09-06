import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bcvoda.com.ua";
  const pages = [
    "",
    "/aktualna-informatsiya",
    "/pitannya-vidpovid",
    "/priyom-gromadyan",
    "/tarifi",
    "/otrimannya-tehnichnih-umov",
    "/povirka-lichilnikiv",
    "/normi-spozhivannya-vodi",
    "/dodatkova-informatsiya",
    "/kontrol-yakosti",
    "/zviti",
    "/gallery",
    "/normativni-dokumenti",
    "/pro-nas",
    "/tsikave-pro-vodu",
    "/sotsialni-proekti",
    "/news",
    "/events",
    "/reports",
    "/map",
  ];
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
