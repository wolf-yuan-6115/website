import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import {
  transformerNotationDiff,
  transformerNotationFocus,
} from "@shikijs/transformers";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { remarkCreatedTime } from "./src/utils/remarkCreatedTime.js";
import { remarkModifiedTime } from "./src/utils/remarkMofifiedTime.js";

export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [
    tailwind(),
    sitemap(),
    icon(),
    mdx({
      shikiConfig: {
        theme: "catppuccin-mocha",
        wrap: false,
        transformers: [
          transformerNotationDiff(),
          transformerNotationFocus(),
          {
            preprocess(code) {
              if (code.endsWith("\n")) {
                code = code.slice(0, -1);
              }
              code = code.trim();

              return code;
            },
          },
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
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkModifiedTime, remarkCreatedTime],
  },
});
