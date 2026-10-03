import type { CollectionEntry } from "astro:content";

import {
  getLocalePath,
  isLocale,
  locales,
  type Locale,
} from "../i18n/config";

export type BlogEntry = CollectionEntry<"blog">;
export type BlogFrontmatter = BlogEntry["data"];
export type TranslationUrls = Partial<Record<Locale, string>>;

export function sortPostsNewestFirst<
  T extends { data: { publishDate: Date } },
>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (first, second) =>
      second.data.publishDate.getTime() -
      first.data.publishDate.getTime(),
  );
}

export function getEntryLocale(entry: BlogEntry | string): Locale {
  const id = typeof entry === "string" ? entry : entry.id;
  const locale = id.split("/", 1)[0];

  if (!isLocale(locale)) {
    throw new Error(
      `Blog entry "${id}" does not start with a supported locale.`,
    );
  }

  return locale;
}

export function getSlug(entry: BlogEntry): string {
  const locale = getEntryLocale(entry);
  const prefix = `${locale}/`;

  if (
    !entry.id.startsWith(prefix) ||
    entry.id.length === prefix.length
  ) {
    throw new Error(
      `Blog entry "${entry.id}" does not contain a slug.`,
    );
  }

  return entry.id.slice(prefix.length);
}

export function assertUniqueTranslationKeys(
  entries: BlogEntry[],
): void {
  const seenKeys = new Map<string, string>();

  for (const entry of entries) {
    const locale = getEntryLocale(entry);
    const scopedKey = `${locale}:${entry.data.translationKey}`;
    const existingId = seenKeys.get(scopedKey);

    if (existingId) {
      throw new Error(
        `Duplicate translation key "${entry.data.translationKey}" for locale "${locale}" in "${existingId}" and "${entry.id}".`,
      );
    }

    seenKeys.set(scopedKey, entry.id);
  }
}

async function getBlogEntries(): Promise<BlogEntry[]> {
  const { getCollection } = await import("astro:content");
  const entries = await getCollection("blog");
  assertUniqueTranslationKeys(entries);
  return entries;
}

export async function getPosts(locale: Locale): Promise<BlogEntry[]> {
  return sortPostsNewestFirst(
    (await getBlogEntries()).filter(
      (entry) => getEntryLocale(entry) === locale,
    ),
  );
}

export async function getPostPaths(locale: Locale) {
  return (await getPosts(locale)).map((entry) => ({
    params: { slug: getSlug(entry) },
    props: { entry },
  }));
}

export function getBlogPostPath(entry: BlogEntry): string {
  return getLocalePath(
    getEntryLocale(entry),
    `/blog/${getSlug(entry)}/`,
  );
}

export async function getTranslationUrls(
  entry: BlogEntry,
): Promise<TranslationUrls> {
  const entries = await getBlogEntries();
  const translations = entries.filter(
    (candidate) =>
      candidate.data.translationKey === entry.data.translationKey,
  );

  return Object.fromEntries(
    locales.flatMap((locale) => {
      const translation = translations.find(
        (candidate) => getEntryLocale(candidate) === locale,
      );

      return translation
        ? ([[locale, getBlogPostPath(translation)]] as const)
        : [];
    }),
  );
}
