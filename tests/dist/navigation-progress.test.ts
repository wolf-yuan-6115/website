import { expect, test } from "bun:test";
import { load } from "cheerio";

import { EXPECTED_HTML_ROUTES, readHtml } from "./helpers";

test("all routes replace the blocking overlay with a localized, indeterminate bar", async () => {
  for (const route of EXPECTED_HTML_ROUTES) {
    const $ = load(await readHtml(route));
    const bar = $("#navigation-progress");
    expect($("#loader-overlay"), route).toHaveLength(0);
    expect(bar, route).toHaveLength(1);
    expect(bar.attr("role"), route).toBe("progressbar");
    expect(bar.attr("aria-hidden"), route).toBe("true");
    // Estimated visual progress must not announce a fictitious percentage.
    expect(bar.attr("aria-valuenow"), route).toBeUndefined();
    expect(bar.attr("aria-label"), route).toBe(
      route.startsWith("/zh-tw/") ? "載入中" : "Loading",
    );
    expect(
      bar.attr("data-astro-transition-persist"),
      route,
    ).toBeTruthy();
    expect(bar.hasClass("pointer-events-none"), route).toBe(true);
    const fill = bar.find("[data-progress-fill]");
    expect(fill, route).toHaveLength(1);
    expect(bar.find("progress"), route).toHaveLength(0);
    expect(
      fill.hasClass("w-[var(--navigation-progress,0%)]"),
      route,
    ).toBe(true);
    expect(fill.attr("data-reset"), route).toBe("true");
    expect(fill.attr("aria-hidden"), route).toBe("true");
  }
});
