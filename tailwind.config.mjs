import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'JetBrains Mono Variable'",
          "'Noto Sans TC Variable'",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};
