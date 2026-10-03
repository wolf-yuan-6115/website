import type { Locale } from "../i18n/config";

export type LocalizedText = Readonly<Record<Locale, string>>;

interface HomeText {
  seo: {
    title: string;
    openGraphTitle: string;
    description: string;
  };
  hero: {
    greeting: string;
    locationBeforeFlag: string;
    locationAfterFlag: string;
    rolesIntro: string;
  };
  sections: {
    experiences: string;
    skills: string;
    skillsDescription: string;
    projects: string;
    contributions: string;
  };
  contact: {
    title: string;
    prefix: string;
    suffix: string;
  };
}

export interface HeroRole {
  class: string;
  emphasis?: LocalizedText;
  label: LocalizedText;
}

export interface HomeAction {
  href: string;
  localized?: boolean;
  label: LocalizedText;
  icon: string;
  class: string;
  target?: "_blank";
  prefetch?: "load";
}

export interface Experience {
  title: LocalizedText;
  items: Readonly<Record<Locale, readonly string[]>>;
  class: string;
}

export interface Skill {
  icon: string;
  label: string | LocalizedText;
}

export interface SkillGroup {
  title: LocalizedText;
  description?: LocalizedText;
  class: string;
  skills: readonly Skill[];
}

export interface Project {
  title: LocalizedText;
  description: LocalizedText;
  href: string | LocalizedText;
  linkDescription: string;
  class: string;
  icons: string[];
  appearedIn?: LocalizedText;
}

export interface Contribution {
  title: LocalizedText;
  description: LocalizedText;
  href: string;
  changed: LocalizedText;
  class: string;
  icons: string[];
}

const localized = <T>(
  en: T,
  zhTw: T,
): Readonly<Record<Locale, T>> => ({
  en,
  "zh-tw": zhTw,
});

export function getLocalizedText(
  value: string | LocalizedText,
  locale: Locale,
): string {
  return typeof value === "string" ? value : value[locale];
}

export const homeText = {
  en: {
    seo: {
      title: "Homepage",
      openGraphTitle: "I'm Wolf Yuan",
      description:
        "I am a student developer from Taiwan specializing in JavaScript development. I am also skilled in front-end and back-end programming as well as Linux based server management.",
    },
    hero: {
      greeting: "Hello, I'm",
      locationBeforeFlag: "A student from Taiwan",
      locationAfterFlag: "",
      rolesIntro: "I'm also a",
    },
    sections: {
      experiences: "Experiences",
      skills: "Tech cookies",
      skillsDescription:
        "Some of them are scrollable! Hold SHIFT to scroll it if you are on desktop!",
      projects: "Projects",
      contributions: "Contribution",
    },
    contact: {
      title: "Having ideas?",
      prefix: "Chat with me via email at",
      suffix: "",
    },
  },
  "zh-tw": {
    seo: {
      title: "首頁",
      openGraphTitle: "我是 Wolf Yuan",
      description:
        "我是一名來自台灣的學生開發者，專精於 JavaScript 開發。我也擅長前端、後端程式設計和伺服器管理。",
    },
    hero: {
      greeting: "嗨，我是",
      locationBeforeFlag: "一名來自台灣",
      locationAfterFlag: "的學生",
      rolesIntro: "我也是一名",
    },
    sections: {
      experiences: "經驗",
      skills: "經驗值",
      skillsDescription:
        "經驗太多了... 所以有些超出了頁面，別忘了你可以用手去滑動它。在電腦上，你可以按住 SHIFT 並滾動你的滑鼠滾輪來滑動。",
      projects: "專案",
      contributions: "貢獻專案",
    },
    contact: {
      title: "有什麼建議嗎？",
      prefix: "發一個電子郵件到",
      suffix: "吧",
    },
  },
} satisfies Record<Locale, HomeText>;

export const heroRoles: readonly HeroRole[] = [
  {
    class: "text-green-200",
    label: localized("Fullstack Developer", "全端程式設計師"),
  },
  {
    class: "text-blue-200",
    label: localized("JavaScript lover", "JavaScript 愛好者"),
  },
  {
    class: "text-orange-200",
    emphasis: localized("50%", "半個"),
    label: localized("website designer", "網頁設計師"),
  },
  {
    class: "text-yellow-200",
    emphasis: localized("Kinda", "應該算是"),
    label: localized("a Hi-Fi music fan", "音樂的發燒友"),
  },
];

export const homeActions: readonly HomeAction[] = [
  {
    href: "/blog",
    localized: true,
    label: localized("Take a look at my blog", "來逛逛我的部落格"),
    icon: "material-symbols:newspaper-rounded",
    class:
      "border-indigo-400 hover:bg-indigo-400 hover:shadow-indigo-400 md:hover:translate-x-2 md:hover:scale-105",
    prefetch: "load",
  },
  {
    href: "https://w.wolf-yuan.dev/gitlab",
    label: localized(
      "Explore my projects on GitLab",
      "看看我於 GitLab 上的開源專案",
    ),
    icon: "simple-icons:gitlab",
    class:
      "border-orange-400 hover:bg-orange-400 hover:shadow-orange-500 md:hover:translate-x-2 md:hover:scale-105",
    target: "_blank",
  },
  {
    href: "https://w.wolf-yuan.dev/github",
    label: localized(
      "Or check out my GitHub profile",
      "或是去看看我的 GitHub 個人檔案",
    ),
    icon: "simple-icons:github",
    class:
      "border-violet-400 hover:bg-violet-400 hover:shadow-violet-400 md:hover:translate-x-2 md:hover:scale-105",
    target: "_blank",
  },
];

export const experiences: readonly Experience[] = [
  {
    title: localized("Currently:", "現今"),
    items: localized(
      [
        "~6 years in backend development",
        "~6 years in Discord bot development",
        "~6 years in frontend development",
        "~5 years being a Linux user",
        "~3 years of Linux server management",
        "~2 years of self hosting experience",
        "Moderator @ Yeecord Community",
        "Technical Team @ SCINT",
        "Webmaster @ THJCC CTF",
      ],
      [
        "約 6 年的後端開發經驗",
        "約 6 年的 Discord 機器人開發經驗",
        "約 6 年的前端開發經驗",
        "5 年的 Linux 使用經驗",
        "3 年的伺服器管理經驗",
        "2 年的自架經驗",
        "YEE 式機器龍 Discord 社群管理員",
        "SCINT 北台灣學生資訊社群技術組",
        "THJCC CTF 網管組",
      ],
    ),
    class: "border-indigo-400",
  },
  {
    title: localized("2026", "2026"),
    items: localized(
      [
        "Editor @ SITCON 2026",
        "Camp counselor lead @ SITCON Camp 2026",
        "Scored 970 in TOEIC again",
      ],
      [
        "SITCON 2026 編輯組",
        "SITCON Camp 2026 隊輔組長",
        "再次不小心得到多益 970 分",
      ],
    ),
    class: "border-gray-500",
  },
  {
    title: localized("2025", "2025"),
    items: localized(
      [
        "Operations team @ SITCON 2025",
        "Camp counselors & IT team @ SITCON Camp 2025",
        "Staff @ Hack Club Scrapyard Taiwan",
        "Club leader @ Hack Club",
        "Technology team @ HackIt",
        "Scored 930 in TOEIC",
      ],
      [
        "SITCON 2025 場務組",
        "SITCON Camp 2025 隊輔 + 資訊組",
        "Hack Club Scrapyard Taiwan 工作人員",
        "在 Hack Club 裡面擔任社團領導人",
        "HackIt 資訊科技部",
        "不小心得到多益 930 分",
      ],
    ),
    class: "border-gray-500",
  },
  {
    title: localized("2024", "2024"),
    items: localized(
      [
        "Student @ SITCON Camp 2024",
        "Attendance @ SITCON Hackathon 2024",
        "Attendance @ SITCON 2024",
        "Attendance @ g0v Summit 2024 Conference",
        "Finalist Team @ g0v sch001 4th",
        "Attendance @ g0v hackath61n",
      ],
      [
        "SITCON Camp 2024 學員",
        "SITCON Hackathon 2024 參賽團隊",
        "SITCON 2024 聽眾",
        "g0v Summit 2024 Conference 聽眾",
        "g0v sch001 4th 決賽入圍團隊",
        "參與 g0v hackath61n",
      ],
    ),
    class: "border-gray-500",
  },
  {
    title: localized("2023", "2023"),
    items: localized(
      ["Attendance @ COSCUP 2023", "Attendance @ g0v hackath59n"],
      ["COSCUP 2023 聽眾", "參與 g0v hackath59n"],
    ),
    class: "border-gray-500",
  },
  {
    title: localized("2020", "2020"),
    items: localized(
      ["Created Black Cat Discord music bot (~2022)"],
      ["建立黑貓 Discord 音樂機器人 (~2022)"],
    ),
    class: "border-gray-500",
  },
];

export const skillGroups: readonly SkillGroup[] = [
  {
    title: localized("Linux ❤️", "Linux ❤️"),
    description: localized(
      "This is a small list of Linux related software or distribution I've tried before",
      "這裡列出了幾個我在 Linux 上用過的程式或是使用過的 Linux 發行版",
    ),
    class: "border-teal-400",
    skills: [
      { icon: "simple-icons:archlinux", label: "Arch" },
      { icon: "simple-icons:fedora", label: "Fedora" },
      { icon: "simple-icons:hyprland", label: "Hyprland" },
      { icon: "simple-icons:gnome", label: "Gnome" },
      { icon: "simple-icons:manjaro", label: "Manjaro" },
      { icon: "simple-icons:debian", label: "Debian" },
      { icon: "simple-icons:ubuntu", label: "Ubuntu" },
      { icon: "simple-icons:zorin", label: "Zorin" },
      { icon: "simple-icons:deepin", label: "Deepin" },
      {
        icon: "simple-icons:nixos",
        label: localized("NixOS (gave up)", "NixOS (已放棄)"),
      },
    ],
  },
  {
    title: localized("Language & frameworks", "程式語言與框架"),
    class: "border-violet-400",
    skills: [
      { icon: "simple-icons:astro", label: "Astro" },
      { icon: "simple-icons:javascript", label: "JavaScript" },
      { icon: "simple-icons:typescript", label: "TypeScript" },
      { icon: "simple-icons:nodedotjs", label: "Node.js" },
      { icon: "simple-icons:python", label: "Python" },
      { icon: "simple-icons:html5", label: "HTML5 & CSS & JS" },
      { icon: "simple-icons:gnubash", label: "Bash Script" },
    ],
  },
  {
    title: localized("Application & network related", "應用與網路類"),
    class: "border-cyan-400",
    skills: [
      { icon: "simple-icons:docker", label: "Docker & Podman" },
      { icon: "simple-icons:nginx", label: "nginx" },
      {
        icon: "simple-icons:cloudflare",
        label: "Cloudflare & Pages",
      },
    ],
  },
  {
    title: localized("Hardware related engineering", "硬體設計相關"),
    class: "border-fuchsia-400",
    skills: [
      { icon: "simple-icons:kicad", label: "KiCad" },
      { icon: "simple-icons:qmk", label: "QMK" },
    ],
  },
  {
    title: localized("Learning :L", "正在學習 :L"),
    class: "border-amber-400",
    skills: [
      { icon: "simple-icons:rust", label: "Rust" },
      { icon: "simple-icons:react", label: "React" },
      { icon: "simple-icons:cplusplus", label: "C++" },
      { icon: "simple-icons:autodesk", label: "Autodesk Fusion" },
    ],
  },
];

export const projects: readonly Project[] = [
  {
    title: localized("Cha Bike", "查 Bike"),
    description: localized(
      "A website that shows real-time and historical data for YouBike station",
      "一個可以查詢 YouBike 站點即時資料與歷史資料的網頁",
    ),
    href: localized(
      "https://youbike.wolf-yuan.dev/en",
      "https://youbike.wolf-yuan.dev/",
    ),
    linkDescription: "youbike.wolf-yuan.dev",
    class: "border-emerald-400 hover:bg-emerald-400",
    appearedIn: localized(
      "HackClub Summer Of Making",
      "HackClub Summer Of Making",
    ),
    icons: [
      "simple-icons:supabase",
      "simple-icons:astro",
      "simple-icons:cloudflareworkers",
      "simple-icons:tailwindcss",
    ],
  },
  {
    title: localized("Ordersphere", "Ordersphere"),
    description: localized(
      "Ordersphere is a order management system that helps you to manage your orders. Originally created for a booth in a school event.",
      "Ordersphere 是一個訂單管理系統，它可以讓您輕鬆的管理您的訂單",
    ),
    href: "https://w.wolf-yuan.dev/project/ordersphere",
    linkDescription: "gitlab.com/wolf-yuan/ordersphere",
    class: "border-yellow-400 hover:bg-yellow-400",
    appearedIn: localized(
      "CLHS School Anniversary 84th",
      "中壢高中第 84 屆校慶",
    ),
    icons: [
      "simple-icons:nextdotjs",
      "simple-icons:typescript",
      "simple-icons:supabase",
      "simple-icons:shadcnui",
    ],
  },
  {
    title: localized("Presentations", "Presentations"),
    description: localized(
      "A collection with all presentation made with Slidev, homepage is made with Astro. Repository is a monorepo method, uses turborepo to optimize build time",
      "一些我使用 Slidev 製作的簡報，主頁使用 Astro。這個網站背後使用了 monorepo 以及 turborepo 來管理儲存庫",
    ),
    href: "https://presentation.wolf-yuan.dev",
    linkDescription: "presentation.wolf-yuan.dev",
    class: "border-fuchsia-400 hover:bg-fuchsia-400",
    icons: [
      "simple-icons:astro",
      "simple-icons:vuedotjs",
      "simple-icons:tailwindcss",
      "simple-icons:turborepo",
    ],
  },
  {
    title: localized("Dolphin Container", "Dolphin Container"),
    description: localized(
      "Dolphin container image is a container image that helps you to deploy your code to vaiorus hosting provider with ease.",
      "Dolphin 是一個 Docker 映像檔，讓你以輕鬆的方式部署您的程式至各大託管商",
    ),
    href: "https://w.wolf-yuan.dev/projects/dolphin",
    linkDescription: "gitlab.com/wolf-yuan/dolphin",
    class: "border-cyan-400 hover:bg-cyan-400",
    icons: [
      "simple-icons:docker",
      "material-symbols:construction-rounded",
    ],
  },
  {
    title: localized("Black Cat", "Black Cat"),
    description: localized(
      "Black cat is a Discord music bot written in TypeScript and Discord.js.",
      "黑貓是一個以 TypeScript 與 Discord.js 撰寫而成的 Discord 音樂機器人",
    ),
    href: "https://w.wolf-yuan.dev/projects/blackcat",
    linkDescription: "gitlab.com/wolf-yuan/blackcat",
    class: "border-gray-50 hover:bg-gray-50 hover:text-gray-600",
    icons: [
      "simple-icons:nodedotjs",
      "simple-icons:typescript",
      "simple-icons:discord",
      "material-symbols:construction-rounded",
    ],
  },
  {
    title: localized("Rep0rter", "Rep0rter"),
    description: localized(
      "Rep0rter is a g0v project, it collects information and sends weekly newsletter.",
      "Rep0rter 是一個 g0v 可以收集各大平臺的動態並傳送每週電子報的專案",
    ),
    href: "https://w.wolf-yuan.dev/projects/rep0rter",
    linkDescription: "github.com/rep0rter",
    class: "border-red-400 hover:bg-red-400",
    appearedIn: localized("g0v sch001 4th", "g0v sch001 4th"),
    icons: [
      "simple-icons:nodedotjs",
      "simple-icons:googlegemini",
      "simple-icons:typescript",
      "material-symbols:construction-rounded",
    ],
  },
  {
    title: localized("Droppler", "Droppler"),
    description: localized(
      "Droppler is a LINE bot, it will automatically warn group members if the message is suspicious by using the Google Gemini API.",
      "Droppler 是一個使用 Google Gemini 的 LINE 事實查核機器人，它可以即時的在 LINE 群組中提醒其他成員此訊息可能為假訊息",
    ),
    href: "https://w.wolf-yuan.dev/projects/droppler",
    linkDescription: "github.com/LanCoCafe/droppler",
    class: "border-green-400 hover:bg-green-400",
    appearedIn: localized(
      "SITCON Hackathon 2024",
      "SITCON Hackathon 2024",
    ),
    icons: [
      "simple-icons:python",
      "simple-icons:googlegemini",
      "simple-icons:line",
      "material-symbols:construction-rounded",
    ],
  },
  {
    title: localized("Busify", "Busify"),
    description: localized(
      "Busify is a concept Telegram bot providing real-time bus information. It will notify you when you need to get on or off the bus.",
      "Busify 是一個 Telegram 機器人，它可以提供公車將在何時到達，並發送通知提醒您",
    ),
    href: "https://w.wolf-yuan.dev/projects/busify",
    linkDescription: "gitlab.com/wolf-yuan/busify",
    class: "border-blue-400 hover:bg-blue-400",
    appearedIn: localized("SITCON Camp 2024", "SITCON Camp 2024"),
    icons: [
      "simple-icons:python",
      "simple-icons:telegram",
      "material-symbols:construction-rounded",
    ],
  },
  {
    title: localized("LightWolf", "LightWolf"),
    description: localized(
      "LightWolf is a series of RP2350 based hardware I've made. It's sponsored by Hack Club to make those boards happen. Currently it has two boards: One is RP2350 based development board, another one is PCM5102A based USB headphone DAC",
      "LightWolf 是一個我做使用 RP2350 晶片 DIY 電路板的系列，都由 Hack Club 贊助。目前有兩個板子：一個是一片小小的開發板，另外一個是用 PCM5102A 的 USB DAC",
    ),
    href: "https://w.wolf-yuan.dev/projects/lightwolf",
    linkDescription: "github.com/wolf-yuan-6115/lightwolf",
    class: "border-gray-400 hover:bg-gray-400",
    icons: ["simple-icons:raspberrypi", "simple-icons:kicad"],
  },
];

export const contributions: readonly Contribution[] = [
  {
    title: localized("Yeecord Website", "Yeecord 網站"),
    description: localized(
      "Yeecord is a multi function Discord bot, serving more than 250,000 Discord servers.",
      "Yeecord 是一個多功能的 Discord 機器人，目前在超過 250,000 個伺服器中服務",
    ),
    href: "https://yeecord.com",
    class: "border-[#9cca95] hover:bg-[#9cca95]",
    changed: localized(
      "Fixed several UI glitches",
      "修復了數個 UI 問題",
    ),
    icons: ["simple-icons:typescript", "simple-icons:nextdotjs"],
  },
  {
    title: localized("Lava", "Lava"),
    description: localized(
      "Lava is a open source Discord music bot driven by Lavalink. ",
      "Lava 是一個使用 Lavalink 的 Discord 音樂機器人",
    ),
    href: "https://github.com/Nat1anWasTaken/Lava",
    class: "border-red-400 hover:bg-red-400",
    changed: localized(
      "Docker support, introduced Docker bake file, s6overlay support",
      "新增 Docker 支援，使用 Docker bake 檔案，使用 s6overlay 來管理容器",
    ),
    icons: [
      "simple-icons:python",
      "simple-icons:docker",
      "simple-icons:discord",
    ],
  },
  {
    title: localized("Easy Effects", "Easy Effects"),
    description: localized(
      "Audio effects for Pipewire applications.",
      "給 PipeWire 應用程式使用的音效程式",
    ),
    href: "https://github.com/wwmm/easyeffects",
    class: "border-blue-400 hover:bg-blue-400",
    changed: localized(
      "Added Chinese Traditional translation",
      "新增中文繁體翻譯",
    ),
    icons: ["simple-icons:cplusplus", "simple-icons:linux"],
  },
  {
    title: localized("Cavalier", "Cavalier"),
    description: localized(
      "Visualize audio with CAVA.",
      "使用 CAVA 的音樂視覺化程式",
    ),
    href: "https://github.com/NickvisionApps/Cavalier",
    class: "border-orange-500 hover:bg-orange-500",
    changed: localized(
      "Added Chinese Traditional translation",
      "新增中文繁體翻譯",
    ),
    icons: ["simple-icons:csharp", "simple-icons:linux"],
  },
  {
    title: localized("EvoBot", "EvoBot"),
    description: localized(
      "EvoBot is a Discord music bot written in TypeScript and Discord.js.",
      "EvoBot 是一個使用 TypeScript 和 Discord.js 撰寫的 Discord 音樂機器人",
    ),
    href: "https://github.com/eritislami/evobot",
    class:
      "border-zinc-400 hover:border-zinc-600 hover:bg-zinc-600 hover:text-zinc-100",
    changed: localized(
      "Contributed to the project at project early stage",
      "於專案早期階段貢獻",
    ),
    icons: ["simple-icons:typescript", "simple-icons:discord"],
  },
];
