import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const news = await p.news.findMany({ select: { slug: true, title: true } });
  const bad = news.filter(n => n.title === "БiлоцеркiвВода" || n.title === "БілоцерківВода" || n.title.includes("Бiлоцерк") );
  console.log("bad count", bad.length);
  console.log(bad.slice(0,20));
  console.log("total", news.length);
  console.log("sample", news.slice(0,5));
  await p.$disconnect();
}
main();
