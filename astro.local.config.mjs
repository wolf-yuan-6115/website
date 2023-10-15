import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), react()],
  output: "static",
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
});
