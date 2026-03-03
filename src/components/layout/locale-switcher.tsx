"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { routing, localeLabels, type Locale } from "@/lib/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as Locale });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => onLocaleChange(loc)}
          className={`rounded-md px-2 py-1 text-sm transition-colors ${
            loc === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-label={`Switch to ${localeLabels[loc]}`}
          aria-current={loc === locale ? "true" : undefined}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
