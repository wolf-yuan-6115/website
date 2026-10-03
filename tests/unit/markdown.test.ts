import { describe, expect, test } from "bun:test";
import { load } from "cheerio";
import { markdownToHtml } from "satteri";

import {
  externalLinks,
  imageFigures,
  sectionizeHeadings,
} from "../../src/plugins/markdown";

function renderMarkdown(source: string) {
  const { html } = markdownToHtml(source, {
    hastPlugins: [imageFigures, sectionizeHeadings, externalLinks],
  });

  return load(html, undefined, false);
}

describe("Satteri Markdown plugins", () => {
  test("turns image-only paragraphs into sibling figures", () => {
    const $ = renderMarkdown(
      "![First image](first.png)\n![Second image](second.png)",
    );
    const figures = $("figure");

    expect(figures).toHaveLength(2);
    expect($(figures[0]).find("img").attr("src")).toBe("first.png");
    expect($(figures[0]).find("figcaption").text()).toBe(
      "First image",
    );
    expect($(figures[1]).find("img").attr("src")).toBe("second.png");
    expect($("p > figure")).toHaveLength(0);
  });

  test("leaves inline images inside their paragraphs", () => {
    const $ = renderMarkdown(
      "Text before ![Inline image](inline.png) text after.",
    );

    expect($("figure")).toHaveLength(0);
    expect($("p > img")).toHaveLength(1);
  });

  test("groups heading content into nested sections", () => {
    const $ = renderMarkdown(`Introduction.

## First

First body.

### Nested

Nested body.

## Second

Second body.`);
    const rootSections = $.root().children("section");

    expect(rootSections).toHaveLength(2);
    expect($(rootSections[0]).attr("data-heading-rank")).toBe("2");
    expect($(rootSections[0]).children("h2").text()).toBe("First");
    expect($(rootSections[0]).children("section")).toHaveLength(1);
    expect($(rootSections[1]).children("h2").text()).toBe("Second");
  });

  test("secures only external HTTP links", () => {
    const $ = renderMarkdown(
      "[External](https://example.com) [Internal](/about/) [Email](mailto:me@example.com)",
    );
    const links = $("a").toArray();

    expect($(links[0]).attr("target")).toBe("_blank");
    expect($(links[0]).attr("rel")).toBe("noopener noreferrer");
    expect($(links[1]).attr("target")).toBeUndefined();
    expect($(links[2]).attr("target")).toBeUndefined();
  });
});
