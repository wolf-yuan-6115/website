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
          "Lato",
          "'PingFang TC'",
          "'Helvetica Neue'",
          "Helvetica",
          "微軟正黑體",
          "新細明體",
          "Arial",
          "sans-serif",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};
