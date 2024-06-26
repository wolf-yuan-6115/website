import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compress from "@playform/compress";
import { transformerNotationFocus } from "@shikijs/transformers";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [
    tailwind(),
    sitemap(),
    icon({
      include: {
        "material-symbols": [
          "arrow-forward-rounded",
          "translate-rounded",
        ],
        "simple-icons": ["*"],
      },
    }),
    ,
    mdx({
      shikiConfig: {
        theme: "catppuccin-mocha",
        wrap: false,
        transformers: [transformerNotationFocus],
      },
    }),
    compress({
      CSS: { lightningcss: {}, csso: null },
    }),
  ],
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  output: "hybrid",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-tw"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  prefetch: true,
});
