import { describe, expect, test } from "bun:test";

import type { BlogEntry } from "../../src/lib/blog";
import {
  assertUniqueTranslationKeys,
  getBlogPostPath,
  getEntryLocale,
  getSlug,
  sortPostsNewestFirst,
} from "../../src/lib/blog";

function entry(
  id: string,
  translationKey = id.split("/").at(-1) ?? id,
): BlogEntry {
  return {
    id,
    data: { translationKey },
  } as unknown as BlogEntry;
}

describe("blog entry helpers", () => {
  test("derives locale, slug, and public URL from a generated entry ID", () => {
    const english = entry("en/astro");
    const chinese = entry("zh-tw/astro");

    expect(getEntryLocale(english)).toBe("en");
    expect(getSlug(english)).toBe("astro");
    expect(getBlogPostPath(english)).toBe("/blog/astro/");
    expect(getEntryLocale(chinese)).toBe("zh-tw");
    expect(getBlogPostPath(chinese)).toBe("/zh-tw/blog/astro/");
  });

  test("rejects malformed entry IDs", () => {
    expect(() => getEntryLocale("fr/post")).toThrow(
      "supported locale",
    );
    expect(() => getSlug(entry("en/"))).toThrow(
      "does not contain a slug",
    );
  });

  test("permits a translation key once per locale", () => {
    expect(() =>
      assertUniqueTranslationKeys([
        entry("en/astro", "astro"),
        entry("zh-tw/astro", "astro"),
      ]),
    ).not.toThrow();
  });

  test("rejects duplicate translation keys within a locale", () => {
    expect(() =>
      assertUniqueTranslationKeys([
        entry("en/first", "same-key"),
        entry("en/second", "same-key"),
      ]),
    ).toThrow('Duplicate translation key "same-key" for locale "en"');
  });

  test("sorts by publish date without mutating the source list", () => {
    const oldest = { data: { publishDate: new Date("2024-01-01Z") } };
    const newest = { data: { publishDate: new Date("2026-01-01Z") } };
    const middle = { data: { publishDate: new Date("2025-01-01Z") } };
    const source = [oldest, newest, middle];

    expect(sortPostsNewestFirst(source)).toEqual([
      newest,
      middle,
      oldest,
    ]);
    expect(source).toEqual([oldest, newest, middle]);
  });
});
