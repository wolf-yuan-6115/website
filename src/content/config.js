import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const enBlogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/en" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    ogImage: z.string(),
    tags: z.array(z.string()),
    sorting: z.number(),
    publishDate: z.coerce.date(),
    modifiedDate: z.coerce.date(),
  }),
});
const zhBlogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/zh" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    ogImage: z.string(),
    tags: z.array(z.string()),
    sorting: z.number(),
    publishDate: z.coerce.date(),
    modifiedDate: z.coerce.date(),
  }),
});

export const collections = {
  en: enBlogCollection,
  zh: zhBlogCollection,
};
