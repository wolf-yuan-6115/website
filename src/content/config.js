import { defineCollection, z } from "astro:content";

const enBlogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publish: z.date(),
    modify: z.date(),
    image: z.string(),
    ogImage: z.string(),
    authors: z.array(z.string()),
    tags: z.array(z.string()),
  }),
});
const zhBlogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publish: z.date(),
    modify: z.date(),
    image: z.string(),
    ogImage: z.string(),
    authors: z.array(z.string()),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  en: enBlogCollection,
  zh: zhBlogCollection,
};
