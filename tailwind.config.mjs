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
          ...defaultTheme.fontFamily.mono,
        ],
      },
      maxWidth: {
        blog: "68rem",
      },
      colors: {
        "catppuccin-blue": "#89b4fa",
      },
    },
  },
  plugins: [],
};
