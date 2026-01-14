import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import sectionize from "@hbsnow/rehype-sectionize";
import {
  transformerNotationDiff,
  transformerNotationFocus,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import externalLink from "rehype-external-links";

export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("404/"),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", "zh-tw": "zh-TW" },
      },
    }),
    icon(),
    mdx({
      shikiConfig: {
        theme: "catppuccin-mocha",
        wrap: false,
        transformers: [
          transformerNotationDiff(),
          transformerNotationFocus(),
        ],
      },
    }),
  ],
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-tw"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [sectionize, [externalLink, { target: "_blank" }]],
  },
  prefetch: true,
});
