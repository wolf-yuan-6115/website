export const locales = ["en", "zh-tw"] as const;

export type Locale = (typeof locales)[number];

export interface LocaleConfig {
  pathPrefix: "" | "/zh-tw";
  htmlLang: "en" | "zh-Hant";
  hrefLang: "en" | "zh-TW";
  ogLocale: "en_US" | "zh_TW";
  feedPath: "/rss/blog-en.xml" | "/rss/blog-zh.xml";
}

export const defaultLocale: Locale = "en";

export const localeConfig = {
  en: {
    pathPrefix: "",
    htmlLang: "en",
    hrefLang: "en",
    ogLocale: "en_US",
    feedPath: "/rss/blog-en.xml",
  },
  "zh-tw": {
    pathPrefix: "/zh-tw",
    htmlLang: "zh-Hant",
    hrefLang: "zh-TW",
    ogLocale: "zh_TW",
    feedPath: "/rss/blog-zh.xml",
  },
} satisfies Record<Locale, LocaleConfig>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getLocalePath(locale: Locale, path = "/"): string {
  const normalizedPath = `/${path}`.replace(/\/{2,}/g, "/");
  const localizedPath = `${localeConfig[locale].pathPrefix}${normalizedPath}`;

  return localizedPath === "" ? "/" : localizedPath;
}
