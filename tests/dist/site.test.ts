import { describe, expect, test } from "bun:test";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";

import {
  BLOG_SLUGS,
  builtTargetExists,
  EXPECTED_HTML_ROUTES,
  getBuiltHtmlRoutes,
  normalizeRoute,
  readDistFile,
  readHtml,
  SITE_URL,
} from "./helpers";

describe("production site output", () => {
  test("emits the complete route set", async () => {
    expect(await getBuiltHtmlRoutes()).toEqual(EXPECTED_HTML_ROUTES);
    expect(EXPECTED_HTML_ROUTES).toHaveLength(24);
  });

  test("uses locale-correct language and canonical metadata", async () => {
    for (const route of EXPECTED_HTML_ROUTES) {
      const $ = load(await readHtml(route));
      const expectedLanguage = route.startsWith("/zh-tw/")
        ? "zh-Hant"
        : "en";
      const canonical = new URL(
        $("link[rel=canonical]").attr("href") ?? "",
      );

      expect($("html").attr("lang"), route).toBe(expectedLanguage);
      expect(canonical.origin, route).toBe(SITE_URL.origin);
      expect(normalizeRoute(canonical.pathname), route).toBe(route);
    }
  });

  test("emits article dates, absolute social images, and translation alternates", async () => {
    const route = "/blog/srecuit/";
    const $ = load(await readHtml(route));
    const alternates = new Map(
      $("link[rel=alternate][hreflang]")
        .toArray()
        .map((element) => [
          $(element).attr("hreflang"),
          $(element).attr("href"),
        ]),
    );

    expect($("meta[property='og:type']").attr("content")).toBe(
      "article",
    );
    expect(
      $("meta[property='article:published_time']").attr("content"),
    ).toBe("2026-01-14T23:40:00.000Z");
    expect(
      $("meta[property='article:modified_time']").attr("content"),
    ).toBe("2026-02-27T17:45:00.000Z");
    expect($("meta[property='og:image']").attr("content")).toBe(
      "https://wolf-yuan.dev/opengraph/images/blog/srecuit.png",
    );
    expect($("meta[name='twitter:image']").attr("content")).toBe(
      "https://wolf-yuan.dev/opengraph/images/blog/srecuit.png",
    );
    expect(alternates).toEqual(
      new Map([
        ["en", "https://wolf-yuan.dev/blog/srecuit/"],
        ["zh-TW", "https://wolf-yuan.dev/zh-tw/blog/srecuit/"],
        ["x-default", "https://wolf-yuan.dev/blog/srecuit/"],
      ]),
    );
  });

  test("all article translations expose only the available locale URLs", async () => {
    for (const slug of BLOG_SLUGS) {
      for (const prefix of ["", "/zh-tw"] as const) {
        const route = `${prefix}/blog/${slug}/`;
        const $ = load(await readHtml(route));
        const alternates = $("link[rel=alternate][hreflang]")
          .toArray()
          .map((element) => $(element).attr("hreflang"))
          .sort();

        expect(alternates, route).toEqual([
          "en",
          "x-default",
          "zh-TW",
        ]);
      }
    }
  });

  test("all internal document links resolve to built output", async () => {
    const failures: string[] = [];

    for (const route of EXPECTED_HTML_ROUTES) {
      const $ = load(await readHtml(route));

      for (const element of $("a[href]").toArray()) {
        const href = $(element).attr("href");
        if (!href || href.startsWith("#")) continue;

        let target: URL;
        try {
          target = new URL(href, new URL(route, SITE_URL));
        } catch {
          failures.push(`${route} has malformed link ${href}`);
          continue;
        }

        if (!["http:", "https:"].includes(target.protocol)) continue;
        if (target.origin !== SITE_URL.origin) continue;
        if (target.pathname.startsWith("/en/")) {
          failures.push(
            `${route} links to forbidden default-locale prefix ${href}`,
          );
          continue;
        }
        if (!(await builtTargetExists(target.pathname))) {
          failures.push(`${route} links to missing target ${href}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("sitemap contains every indexable page and excludes 404 routes", async () => {
    const indexXml = await readDistFile("sitemap-index.xml");
    const index = new XMLParser().parse(indexXml) as {
      sitemapindex: { sitemap: { loc: string } | { loc: string }[] };
    };
    const sitemapEntries = Array.isArray(index.sitemapindex.sitemap)
      ? index.sitemapindex.sitemap
      : [index.sitemapindex.sitemap];
    const sitemapPaths = sitemapEntries.map(
      ({ loc }) => new URL(loc).pathname,
    );

    expect(sitemapPaths.length).toBeGreaterThan(0);

    const pageUrls = new Set<string>();
    for (const sitemapPath of sitemapPaths) {
      const xml = await readDistFile(sitemapPath.replace(/^\//, ""));
      // Page metadata pairs translations by translationKey; sitemap path heuristics cannot.
      expect(xml).not.toContain("<xhtml:link");
      const parsed = new XMLParser().parse(xml) as {
        urlset: { url: { loc: string } | { loc: string }[] };
      };
      const urls = Array.isArray(parsed.urlset.url)
        ? parsed.urlset.url
        : [parsed.urlset.url];
      urls.forEach(({ loc }) =>
        pageUrls.add(normalizeRoute(new URL(loc).pathname)),
      );
    }

    for (const route of EXPECTED_HTML_ROUTES.filter(
      (candidate) => !candidate.endsWith("/404/"),
    )) {
      expect(pageUrls.has(route), route).toBe(true);
    }
    expect(pageUrls.has("/404/")).toBe(false);
    expect(pageUrls.has("/zh-tw/404/")).toBe(false);
  });

  test("Markdown images produce semantic figures and responsive candidates", async () => {
    const expectedSizes =
      "(min-width: 1280px) 735px, (min-width: 768px) calc(60vw - 2.1rem), calc(85vw - 2.975rem)";
    const figureHtml = await readHtml("/blog/astro/");
    const $ = load(figureHtml);
    const figures = $(".markdown-content figure");
    const rootSections = $(
      ".markdown-content > section.heading[data-heading-rank='2']",
    );

    expect(figures.length).toBeGreaterThanOrEqual(2);
    expect(
      figures.filter(
        (_, figure) => $(figure).find("figcaption").length !== 1,
      ),
    ).toHaveLength(0);
    expect(figures.find("picture").length).toBeGreaterThanOrEqual(2);
    expect(figureHtml).not.toMatch(/<p(?:\s[^>]*)?>\s*<figure/i);
    expect(rootSections.length).toBeGreaterThan(1);
    expect(
      $(
        ".markdown-content section[data-heading-rank='2'] section[data-heading-rank='2']",
      ),
    ).toHaveLength(0);

    const externalLink = $(
      "a[href='https://docs.astro.build/en/reference/modules/astro-assets/#widths']",
    );
    expect(externalLink.attr("target")).toBe("_blank");
    expect(externalLink.attr("rel")).toBe("noopener noreferrer");

    const responsiveHtml = await readHtml("/blog/hyprland/");
    const responsivePage = load(responsiveHtml);
    const firstPicture = responsivePage(
      ".markdown-content picture",
    ).first();

    expect(firstPicture.find("source").attr("sizes")).toBe(
      expectedSizes,
    );
    expect(firstPicture.find("img").attr("sizes")).toBe(
      expectedSizes,
    );

    for (const element of firstPicture
      .find("source, img")
      .toArray()) {
      const srcset = responsivePage(element).attr("srcset");
      if (!srcset) continue;
      const widths = srcset
        .split(",")
        .map((candidate) => candidate.trim().split(/\s+/).at(-1));
      expect(widths).toEqual([
        "320w",
        "480w",
        "640w",
        "735w",
        "1080w",
        "1470w",
      ]);
    }

    expect(responsiveHtml).not.toMatch(/\bmax(?:Viewport|Width)=/i);
  });

  test("404 pages are noindex and return to the correct locale home", async () => {
    for (const [route, expectedHome] of [
      ["/404/", "/"],
      ["/zh-tw/404/", "/zh-tw/"],
    ] as const) {
      const $ = load(await readHtml(route));
      expect($("meta[name=robots]").attr("content"), route).toContain(
        "noindex",
      );
      expect(
        $(`a[href='${expectedHome}']`).length,
        route,
      ).toBeGreaterThan(0);
    }
  });
});
