import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publish: z.date(),
    modify: z.date(),
    image: z.string(),
    authors: z.array(z.string()),
    tags: z.array(z.string())
  })
});

export const collections = {
  blog: blogCollection,
};
