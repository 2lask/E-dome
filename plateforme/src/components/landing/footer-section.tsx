"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useLandingLang } from "@/components/landing/landing-i18n";

export function FooterSection() {
  const { t } = useLandingLang();

  const demoLinks = [
    { label: t("footer.link_feed"), href: "/feed" },
    { label: t("footer.link_marketplace"), href: "/explorer" },
    { label: t("footer.link_dashboard"), href: "/dashboard" },
    { label: t("footer.link_formations"), href: "/formations" },
    { label: t("footer.link_live"), href: "/live" },
    { label: t("footer.link_messages"), href: "/messages" },
  ];

  const platformLinks = [
    { label: t("footer.link_apporteurs"), href: "/apporteurs" },
    { label: t("footer.link_reservations"), href: "/reservations" },
    { label: t("footer.link_statistiques"), href: "/statistiques" },
    { label: t("footer.link_evenements"), href: "/evenements" },
    { label: t("footer.link_services"), href: "/services" },
    { label: t("footer.link_investisseurs"), href: "/investisseurs" },
  ];

  return (
    <footer className="bg-gray-900 pt-16 pb-8 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">

          {/* ── Logo + description + contact ── */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={22} className="text-[#1e9df1]" />
              <span className="text-white font-semibold text-lg">E-Dome</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t("footer.desc")}
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:contact@edome.world"
                className="inline-flex items-center gap-2 text-gray-500 text-xs hover:text-[#1e9df1] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
              <a
                href="https://wa.me/66910687928"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 text-xs hover:text-[#25D366] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Leonard -- +66 91 068 79 28
              </a>
              <a
                href="https://wa.me/41762832444"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 text-xs hover:text-[#25D366] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Jean-Pierre -- +41 76 283 24 44
              </a>
            </div>
          </div>

          {/* ── Demo links ── */}
          <div>
            <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-4 font-medium">
              {t("footer.demo_label")}
            </p>
            <ul className="space-y-2.5">
              {demoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Platform links ── */}
          <div>
            <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-4 font-medium">
              {t("footer.platform_label")}
            </p>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About links ── */}
          <div>
            <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-4 font-medium">
              {t("footer.about_label")}
            </p>
            <ul className="space-y-2.5">
              <li>
                <a href="#vision" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_vision")}
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_features")}
                </a>
              </li>
              <li>
                <a href="#fondateurs" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_founders")}
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_roadmap")}
                </a>
              </li>
              <li>
                <Link href="/conditions" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_conditions")}
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors py-1 inline-block">
                  {t("footer.link_privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            {t("footer.copyright")}
          </p>
          <Link
            href="#inscriptions"
            className="rounded-full px-5 py-2.5 text-gray-400 text-xs hover:text-[#1e9df1] hover:bg-gray-800 transition-all border border-gray-700"
          >
            {t("footer.access")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
