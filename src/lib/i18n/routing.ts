import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "vi", "zh", "ru"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  vi: "Tiếng Việt",
  zh: "中文",
  ru: "Русский",
};
