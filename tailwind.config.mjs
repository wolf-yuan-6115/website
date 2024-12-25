export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'JetBrains Mono Variable'",
          "ui-monospace",
          "'SFMono-Regular'",
          "'Menlo'",
          "'Monaco'",
          "'Consolas'",
          "'Liberation Mono'",
          "'Courier New'",
          "LiHei Pro",
          "黑體-繁",
          "微軟正黑體",
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
