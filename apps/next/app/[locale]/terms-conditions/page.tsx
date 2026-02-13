"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export default function TermsPage() {
  const t = useTranslations("legal.terms");
  const common = useTranslations("auth.common");
  const locale = useLocale();
  const sections = t.raw("sections") as TermsSection[];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen px-6 py-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-[#C5C5C5] hover:text-[#00FFB3] transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{common("back")}</span>
        </Link>

        <article className="max-w-3xl mx-auto mt-12 space-y-8 text-white">
          <header className="space-y-4 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-[#C5C5C5]">{t("updatedAt")}</p>
          </header>

          <section className="space-y-6 text-[#C5C5C5] leading-relaxed">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                {section.paragraphs?.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? <p className="font-semibold text-white">{section.note}</p> : null}
              </div>
            ))}

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">{t("contact.title")}</h2>
              <p>
                {t("contact.prefix")}{" "}
                <a href={`mailto:${t("contact.email")}`} className="text-[#00FFB3] hover:text-[#1DE3F2] underline">
                  {t("contact.email")}
                </a>
              </p>
            </div>
          </section>

          <footer className="pt-8 border-t border-[#1DE3F2]/20 text-center">
            <Link href={`/${locale}`} className="text-[#00FFB3] hover:text-[#1DE3F2] transition-colors">
              {t("backHome")}
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
