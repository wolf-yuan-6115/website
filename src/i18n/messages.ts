import { type Locale, resolveLocale } from "./config";

export interface Messages {
  nav: {
    imageAlt: string;
    blogTitle: string;
    switchLanguage: string;
  };
  loader: {
    loading: string;
    receiving: string;
  };
  footer: {
    madeWith: string;
    and: string;
    following: string;
  };
  card: {
    link: string;
    appeared: string;
    appearedAfter: string;
  };
  noscript: {
    title: string;
    description: string;
    additional: string;
  };
  blog: {
    created: string;
    modified: string;
    toc: string;
    chatWithMe: string;
    sendAnEmail: string;
    noPosts: string;
  };
}

export const messages = {
  en: {
    nav: {
      imageAlt: "Click here to go back to the homepage",
      blogTitle: "Blog",
      switchLanguage: "Switch language",
    },
    loader: {
      loading: "Loading",
      receiving: "Receiving radio waves...",
    },
    footer: {
      madeWith: "Made with",
      and: "and",
      following: "",
    },
    card: {
      link: "Click here to go to",
      appeared: "Appeared in",
      appearedAfter: "",
    },
    noscript: {
      title: "JavaScript is disabled",
      description:
        "JavaScript is disabled on this website, some feature or styling might break.",
      additional:
        "This site uses Google Analysis with Cloudflare Zaraz, consider using extensions like uBlock Origin to block tracking instead disabling script.",
    },
    blog: {
      created: "Created at: ",
      modified: "Last modified: ",
      toc: "Table of contents",
      chatWithMe: "Wants to chat with me?",
      sendAnEmail: "Fire an email to",
      noPosts: "No posts have been published yet.",
    },
  },
  "zh-tw": {
    nav: {
      imageAlt: "點擊這裡來回到首頁",
      blogTitle: "部落格",
      switchLanguage: "切換語言",
    },
    loader: {
      loading: "載入中",
      receiving: "正在接收無線電波...",
    },
    footer: {
      madeWith: "使用",
      and: "和",
      following: "製作而成",
    },
    card: {
      link: "點選這裡來前往",
      appeared: "在",
      appearedAfter: "中發表",
    },
    noscript: {
      title: "JavaScript 已停用",
      description:
        "JavaScript 已在這個網頁上停用，部分功能或是樣式可能會無法成功顯示",
      additional:
        "我的網站使用 Cloudflare Zaraz 與 Google Analysis，您可以嘗試使用類似 uBlock Origin 的擴充功能封鎖追蹤，而不是停用 JavaScript",
    },
    blog: {
      created: "最初建立於: ",
      modified: "最後編輯: ",
      toc: "目錄",
      chatWithMe: "想跟我聊聊嗎？",
      sendAnEmail: "發一個電子郵件到",
      noPosts: "目前還沒有已發布的文章。",
    },
  },
} satisfies Record<Locale, Messages>;

export function getMessages(locale: string | undefined): Messages {
  return messages[resolveLocale(locale)];
}
