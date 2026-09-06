import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { Droplets, Phone, MapPin, Clock, Mail, Shield, Wallet, Gauge, FlaskConical, FileText, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  const contacts: any = siteConfig.contacts;
  const cabinets: any = siteConfig.cabinets;

  return (
    <footer className="mt-12">
      {/* Main footer */}
      <div className="mt-6 bg-white border-t border-black/[0.06]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-[#0B57D0] text-white grid place-items-center">
                  <Droplets className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[15px] font-bold leading-none text-[#1D1D1F]">БілоцерківВода</p>
                  <p className="text-[11px] text-[#6E6E73]">ТОВ &quot;БІЛОЦЕРКІВВОДА&quot;</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#49454F]">{siteConfig.description} • Працюємо для 120 тис. мешканців.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={cabinets.personal || "#"} target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-[12px] font-semibold hover:bg-black/5">
                  Кабінет <ExternalLink className="h-3 w-3" />
                </a>
                <a href={siteConfig.social.facebook} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EDF7] px-3.5 py-1.5 text-[12px] font-semibold text-[#49454F] hover:bg-[#E8DEF8]">
                  Facebook
                </a>
              </div>
            </div>

            {/* For residents */}
            <div>
              <h4 className="text-[13px] font-bold text-[#1D1D1F] flex items-center gap-2"><Heart className="h-4 w-4 text-[#B3261E]" /> Мешканцям</h4>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[13px]">
                <li><Link href="#lichylnyk" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]"><Gauge className="h-3.5 w-3.5" /> Передати показники</Link></li>
                <li><Link href="/tarifi" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]"><Wallet className="h-3.5 w-3.5" /> Тарифи</Link></li>
                <li><Link href="/kontrol-yakosti" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]"><FlaskConical className="h-3.5 w-3.5" /> Якість води</Link></li>
                <li><Link href="/normi-spozhivannya-vodi" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]"><FileText className="h-3.5 w-3.5" /> Норми споживання</Link></li>
                <li><Link href="/povirka-lichilnikiv" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]">Повірка лічильників</Link></li>
                <li><Link href="/otrimannya-tehnichnih-umov" className="inline-flex items-center gap-2 py-1 text-[#49454F] hover:text-[#0B57D0]">Технічні умови</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-[13px] font-bold text-[#1D1D1F]">Допомога</h4>
              <ul className="mt-3 space-y-1.5 text-[13px] text-[#49454F]">
                <li><Link href="/pitannya-vidpovid" className="hover:text-[#0B57D0]">Питання — відповідь</Link></li>
                <li><Link href="/zviti" className="hover:text-[#0B57D0]">Звіти</Link></li>
                <li><Link href="/pro-nas" className="hover:text-[#0B57D0]">Про нас</Link></li>
                <li><Link href="/sotsialni-proekti" className="hover:text-[#0B57D0]">Соціальні проєкти</Link></li>
                <li><Link href="/gallery" className="hover:text-[#0B57D0]">Галерея</Link></li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-[13px] font-bold text-[#1D1D1F]">Контакти 24/7</h4>
              <div className="mt-3 space-y-2.5 text-[13px]">
                <a href={`tel:${contacts.emergency.replace(/\D/g,"")}`} className="flex items-center gap-2.5 rounded-xl bg-[#FCE8E6] border border-[#FECACA] px-3 py-2.5 font-bold text-[#B3261E] hover:bg-[#FFD8E4]">
                  <span className="h-8 w-8 rounded-full bg-[#B3261E] text-white grid place-items-center shrink-0"><Phone className="h-4 w-4" /></span>
                  Аварійна {contacts.emergency}
                </a>
                <div className="flex items-start gap-2.5 text-[#49454F] px-1">
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[#6E6E73]" />
                  <div>
                    <p className="font-medium text-[#1D1D1F]">Call-центр {contacts.callCenter}</p>
                    <a href={`tel:${contacts.callCenter.replace(/\D/g,"")}`} className="text-[#0B57D0] hover:underline text-[12px]">Зателефонувати безкоштовно</a>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[#49454F] px-1">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[#6E6E73]" />
                  <a href={`mailto:${contacts.email}`} className="hover:text-[#0B57D0] break-all">{contacts.email}</a>
                </div>
                <div className="flex items-start gap-2.5 text-[#49454F] px-1">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#6E6E73]" />
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(contacts.address)}`} target="_blank" className="hover:text-[#0B57D0] leading-snug">{contacts.address}</a>
                </div>
                <div className="flex items-start gap-2.5 text-[#49454F] px-1">
                  <Clock className="h-4 w-4 mt-0.5 shrink-0 text-[#6E6E73]" />
                  <span>Пн–Пт 8:00–17:00 • аварійна цілодобово</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row gap-3 items-center justify-between text-[12px] text-[#6E6E73]">
            <p>© {new Date().getFullYear()} {siteConfig.fullName} • {siteConfig.name}</p>
            <p className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EDF7] px-3 py-1 font-medium">Розробник &quot;ShAnDeR&quot;</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
