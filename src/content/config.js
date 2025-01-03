import { defineCollection, z } from "astro:content";

const enBlogCollection = defineCollection({
  type: "content",
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
  type: "content",
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
