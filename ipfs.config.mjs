import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import compress from "astro-compress";

import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wolf-yuan.dev",
  root: "./",
  integrations: [mdx(), tailwind(), sitemap(), icon({
    include: {
      "material-symbols": ["arrow-forward-rounded"],
      "simple-icons": ["*"]
    }
  }), compress({
    Exclude: ["_routes.json", "_worker.mjs", "_noop-middleware.mjs", "renderers.mjs"]
  })],
  output: "static",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop"
    }
  },
  prefetch: true
});
