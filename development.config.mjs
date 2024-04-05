import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import compress from "astro-compress";
import { transformerNotationFocus } from "@shikijs/transformers"
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [tailwind(), sitemap(), icon({
    include: {
      "material-symbols": ["arrow-forward-rounded", "translate-rounded"],
      "simple-icons": ["*"]
    }
  }), compress({
    Exclude: ["_routes.json", "_worker.mjs", "_noop-middleware.mjs", "renderers.mjs"]
  }), mdx({
    shikiConfig: {
      theme: "catppuccin-mocha",
      wrap: false,
      transformers: [transformerNotationFocus]
    }
  })],
  image: {
    service: {
      entrypoint: "astro/assets/services/noop"
    }
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-tw"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  prefetch: true
});
