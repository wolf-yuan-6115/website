import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [mdx(), tailwind(), react(), sitemap(), icon()],
  adapter: cloudflare(),
  output: "hybrid",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
});
