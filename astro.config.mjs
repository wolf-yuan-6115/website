import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationFocus,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import {
  externalLinks,
  imageFigures,
  sectionizeHeadings,
} from "./src/plugins/markdown.ts";

export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("404/"),
    }),
    icon(),
    mdx(),
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
    processor: satteri({
      hastPlugins: [imageFigures, sectionizeHeadings, externalLinks],
    }),
    shikiConfig: {
      theme: "catppuccin-mocha",
      wrap: false,
      transformers: [
        transformerNotationDiff(),
        transformerNotationFocus(),
      ],
    },
  },
  prefetch: true,
});
