import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [mdx(), tailwind(), react(), sitemap(), icon({
    include: {
      "material-symbols": ["arrow-forward-rounded"]
    }
  })],
  adapter: cloudflare(),
  output: "server",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop"
    }
  }
});