import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://wolf-yuan.dev",
  integrations: [mdx(), tailwind(), react(), sitemap(), prefetch()],
  adapter: cloudflare(),
  output: "server",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
});
