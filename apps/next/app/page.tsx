import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, locales } from "../i18n/config";

export default async function Page() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const preferredLocale = acceptLanguage
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim().toLowerCase().split("-")[0])
    .find((locale) => locales.includes(locale as (typeof locales)[number]));

  redirect(`/${preferredLocale ?? defaultLocale}`);
}
