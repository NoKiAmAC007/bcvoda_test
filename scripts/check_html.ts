async function main(){
  const html = await fetch('https://bcvoda.com.ua/zviti').then(r=>r.text());
  const idx = html.indexOf('Звіт');
  console.log(html.slice(idx, idx+1500).replace(/</g,'\n<'));
}
main();
