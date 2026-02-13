import type React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { defaultLocale, type AppLocale } from "../i18n/config";
import { getLocaleMessages } from "../i18n/messages";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar",
  description: "Radar social discovery app",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = ((await getLocale()) || defaultLocale) as AppLocale;
  const messages = await getLocaleMessages(locale);

  return (
    <html lang={locale} className="dark">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
        <div id="modal-root" />
      </body>
    </html>
  );
}
