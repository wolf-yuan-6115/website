import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const DIST_DIR = resolve(
  fileURLToPath(new URL("../..", import.meta.url)),
  "dist",
);
export const SITE_URL = new URL("https://wolf-yuan.dev");
export const BLOG_SLUGS = [
  "astro",
  "astro-two-years",
  "cha-bike",
  "docker-multistage",
  "free-cloud",
  "hackit-problem",
  "hyprland",
  "srecuit",
  "zenbook",
] as const;

export const EXPECTED_HTML_ROUTES = [
  "/",
  "/404/",
  "/blog/",
  ...BLOG_SLUGS.map((slug) => `/blog/${slug}/`),
  "/zh-tw/",
  "/zh-tw/404/",
  "/zh-tw/blog/",
  ...BLOG_SLUGS.map((slug) => `/zh-tw/blog/${slug}/`),
].sort();

export function normalizeRoute(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function routeToHtmlPath(route: string): string {
  if (route === "/") return join(DIST_DIR, "index.html");

  const relativeRoute = route.replace(/^\//, "").replace(/\/$/, "");

  if (relativeRoute === "404") return join(DIST_DIR, "404.html");

  return join(DIST_DIR, relativeRoute, "index.html");
}

export async function readHtml(route: string): Promise<string> {
  return readFile(routeToHtmlPath(route), "utf8");
}

export async function readDistFile(path: string): Promise<string> {
  return readFile(join(DIST_DIR, path), "utf8");
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );

  return nested.flat();
}

export async function getBuiltHtmlRoutes(): Promise<string[]> {
  const files = (await walk(DIST_DIR)).filter((file) =>
    file.endsWith(".html"),
  );

  return files
    .map((file) => relative(DIST_DIR, file).split(sep).join("/"))
    .map((file) => {
      if (file === "index.html") return "/";
      if (file === "404.html") return "/404/";
      if (file.endsWith("/index.html")) {
        return `/${file.slice(0, -"index.html".length)}`;
      }
      if (file.endsWith("/404.html")) {
        return `/${file.slice(0, -".html".length)}/`;
      }
      return `/${file}`;
    })
    .sort();
}

export async function builtTargetExists(
  pathname: string,
): Promise<boolean> {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath.replace(/^\//, "");
  const candidates =
    decodedPath === "/404/"
      ? [join(DIST_DIR, "404.html")]
      : decodedPath.endsWith("/")
        ? [join(DIST_DIR, relativePath, "index.html")]
        : [
            join(DIST_DIR, relativePath),
            join(DIST_DIR, relativePath, "index.html"),
            join(DIST_DIR, `${relativePath}.html`),
          ];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {
      // Try the next static-output form.
    }
  }

  return false;
}
