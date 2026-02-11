import type React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { redirect } from "next/navigation";
import { defaultLocale, locales, type AppLocale } from "../../i18n/config";

const baseUrl = "https://use-radar.vercel.app";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function isLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;

  const messages = (await import(`../../messages/${resolvedLocale}.json`)).default;

  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${resolvedLocale}`,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locale) {
    redirect(`/${defaultLocale}`);
  }

  if (!isLocale(locale)) {
    redirect(`/${defaultLocale}`);
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
