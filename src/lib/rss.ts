import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { load } from "cheerio";
import sanitize from "sanitize-html";

import RssImage from "../components/rss/Image.astro";
import type { Locale } from "../i18n/config";
import { getBlogPostPath, getPosts } from "./blog";

interface FeedMetadata {
  title: string;
  description: string;
  language: string;
}

const feedMetadata = {
  en: {
    title: "Wolf's blog",
    description:
      "These are blog posts written by me, hope you like it! These posts are in English, for Chinese version, please subscribe /rss/blog-zh.xml",
    language: "en-us",
  },
  "zh-tw": {
    title: "Wolf 的小小部落格",
    description:
      "這裡是我寫的部落格文章，希望你會喜歡！這裡是中文的文章，若要英文版本請訂閱 /rss/blog-en.xml",
    language: "zh-tw",
  },
} satisfies Record<Locale, FeedMetadata>;

function absolutizeUrls(html: string, baseUrl: URL): string {
  const $ = load(html, undefined, false);

  for (const attribute of ["href", "src"] as const) {
    $(`[${attribute}]`).each((_index, element) => {
      const value = $(element).attr(attribute);

      if (!value) return;

      try {
        $(element).attr(attribute, new URL(value, baseUrl).href);
      } catch {
        // Sanitization below removes unsafe or malformed URLs.
      }
    });
  }

  return $.html();
}

function sanitizeContent(html: string, articleUrl: URL): string {
  return sanitize(absolutizeUrls(html, articleUrl), {
    allowedTags: [...sanitize.defaults.allowedTags, "img"],
  });
}

export function createBlogFeed(locale: Locale): APIRoute {
  return async ({ site }) => {
    if (!site) {
      throw new Error(
        "The Astro site URL is required to generate RSS feeds.",
      );
    }

    const metadata = feedMetadata[locale];
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const posts = await getPosts(locale);

    const items: RSSFeedItem[] = [];

    for (const post of posts) {
      const articleUrl = new URL(getBlogPostPath(post), site);
      const { Content } = await render(post);
      const html = await container.renderToString(Content, {
        props: { components: { img: RssImage } },
        request: new Request(articleUrl),
      });

      items.push({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        categories: post.data.tags,
        link: getBlogPostPath(post),
        content: sanitizeContent(html, articleUrl),
      });
    }

    return rss({
      title: metadata.title,
      description: metadata.description,
      site,
      items,
      customData: `<language>${metadata.language}</language>`,
    });
  };
}
