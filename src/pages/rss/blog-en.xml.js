import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("en");

  return rss({
    title: "Wolf Yuan",
    description:
      "These are blog posts written by me, hope you like it! These posts are in English, for Chinese version, please subscribe /rss/blog-zh.xml",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.sorting - a.data.sorting)
      .map((post) => {
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.publishDate,
          categories: post.data.tags,
          link: `/blog/${post.id}`,
        };
      }),
    customData: "<language>en-us</language>",
  });
}
