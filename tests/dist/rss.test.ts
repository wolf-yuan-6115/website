import { describe, expect, test } from "bun:test";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";

import { readDistFile, SITE_URL } from "./helpers";

interface FeedItem {
  title: string;
  pubDate: string;
  link: string;
  "content:encoded": string;
}

interface ParsedFeed {
  rss: {
    channel: {
      language: string;
      item: FeedItem | FeedItem[];
    };
  };
}

const feeds = [
  {
    file: "rss/blog-en.xml",
    language: "en-us",
    firstTitle: "What's so exciting about getting a new laptop?",
    pathPrefix: "/blog/",
  },
  {
    file: "rss/blog-zh.xml",
    language: "zh-tw",
    firstTitle: "換個筆電有什麼好開心的？",
    pathPrefix: "/zh-tw/blog/",
  },
] as const;
const parser = new XMLParser({
  // These are trusted build artifacts containing long HTML bodies.
  processEntities: { maxTotalExpansions: Infinity },
});

describe("RSS output", () => {
  for (const feed of feeds) {
    test(`${feed.file} contains full, newest-first, portable entries`, async () => {
      const xml = await readDistFile(feed.file);
      const parsed = parser.parse(xml) as ParsedFeed;
      const channel = parsed.rss.channel;
      const items = Array.isArray(channel.item)
        ? channel.item
        : [channel.item];
      const publicationTimes = items.map(({ pubDate }) =>
        Date.parse(pubDate),
      );
      let imageCount = 0;

      expect(channel.language).toBe(feed.language);
      expect(items).toHaveLength(9);
      expect(items[0].title).toBe(feed.firstTitle);
      expect(publicationTimes).toEqual(
        [...publicationTimes].sort((a, b) => b - a),
      );
      expect(xml).not.toContain("src/assets");

      for (const item of items) {
        const link = new URL(item.link);
        const $ = load(item["content:encoded"]);

        expect(link.origin).toBe(SITE_URL.origin);
        expect(link.pathname.startsWith(feed.pathPrefix)).toBe(true);
        expect(item["content:encoded"].length).toBeGreaterThan(200);
        expect($("p, h2, h3, pre").length).toBeGreaterThan(0);
        expect($("script")).toHaveLength(0);

        for (const element of $("a[href], img[src]").toArray()) {
          const attribute =
            element.tagName === "img" ? "src" : "href";
          const value = $(element).attr(attribute);
          const url = new URL(value ?? "");

          if (element.tagName === "img") {
            imageCount += 1;
            expect(["http:", "https:"]).toContain(url.protocol);
            expect(url.pathname).toEndWith(".webp");
          } else {
            expect(["http:", "https:", "mailto:"]).toContain(
              url.protocol,
            );
          }
        }
      }

      expect(imageCount).toBeGreaterThan(0);
    });
  }
});
