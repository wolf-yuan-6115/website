import { describe, expect, test } from "bun:test";

import {
  getLocalePath,
  isLocale,
  localeConfig,
  locales,
  resolveLocale,
} from "../../src/i18n/config";
import { getMessages, messages } from "../../src/i18n/messages";

describe("locale configuration", () => {
  test("recognizes supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh-tw")).toBe(true);
    expect(isLocale("zh-TW")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  test("falls back to English for missing or unsupported locales", () => {
    expect(resolveLocale(undefined)).toBe("en");
    expect(resolveLocale("fr")).toBe("en");
    expect(getMessages("fr")).toBe(messages.en);
  });

  for (const [locale, path, expected] of [
    ["en", "/", "/"],
    ["en", "blog", "/blog"],
    ["en", "/blog/post/", "/blog/post/"],
    ["zh-tw", "/", "/zh-tw/"],
    ["zh-tw", "blog", "/zh-tw/blog"],
    ["zh-tw", "/blog/post/", "/zh-tw/blog/post/"],
  ] as const) {
    test(`maps ${locale} and ${path} to ${expected}`, () => {
      expect(getLocalePath(locale, path)).toBe(expected);
    });
  }

  test("defines complete, distinct metadata and messages for each locale", () => {
    expect(Object.keys(localeConfig).sort()).toEqual(
      [...locales].sort(),
    );
    expect(Object.keys(messages).sort()).toEqual([...locales].sort());
    expect(localeConfig.en.htmlLang).toBe("en");
    expect(localeConfig["zh-tw"].htmlLang).toBe("zh-Hant");
    expect(messages.en.blog.noPosts).not.toBe(
      messages["zh-tw"].blog.noPosts,
    );
  });
});
