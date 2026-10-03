import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

function generateBlogId({
  entry,
  data,
}: {
  entry: string;
  data: Record<string, unknown>;
}): string {
  const normalizedEntry = entry.replaceAll("\\", "/");
  const [locale, ...pathParts] = normalizedEntry.split("/");
  const fileSlug = pathParts.join("/").replace(/\.mdx$/, "");
  const slug = typeof data.slug === "string" ? data.slug : fileSlug;

  return `${locale}/${slug}`;
}

const blogCollection = defineCollection({
  loader: glob({
    pattern: ["en/**/[^_]*.mdx", "zh-tw/**/[^_]*.mdx"],
    base: "./src/content",
    generateId: generateBlogId,
  }),
  schema: ({ image }) =>
    z.object({
      translationKey: z.string().trim().min(1),
      slug: z.string().trim().min(1).optional(),
      title: z.string(),
      description: z.string(),
      image: image(),
      ogImage: z.string(),
      tags: z.array(z.string()),
      hiddenTags: z.array(z.string()).optional(),
      publishDate: z.coerce.date(),
      modifiedDate: z.coerce.date(),
    }),
});

export const collections = {
  blog: blogCollection,
};
