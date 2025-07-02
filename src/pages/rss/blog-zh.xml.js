import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("zh");

  return rss({
    title: "Wolf 的文章",
    description:
      "這裡是我寫的部落格文章，希望你會喜歡！這裡是中文的文章，若要英文版本請訂閱 /rss/blog-en.xml",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.sorting - a.data.sorting)
      .map((post) => {
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.publishDate,
          categories: post.data.tags,
          link: `/zh-tw/blog/${post.id}`,
          content: sanitize(parser.render(post.body), {
            allowedTags: sanitize.defaults.allowedTags.concat([
              "img",
            ]),
          }),
        };
      }),
    customData: "<language>zh-tw</language>",
  });
}
