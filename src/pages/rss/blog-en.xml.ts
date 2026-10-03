import type { APIRoute } from "astro";

import { createBlogFeed } from "../../lib/rss";

export const GET: APIRoute = createBlogFeed("en");
