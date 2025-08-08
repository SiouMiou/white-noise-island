import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  title: string;
  date: string;
  contentHtml: string;
};

export default function NewsPost({ title, date, contentHtml }: Props) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>{title}｜最新消息</title>
        <meta name="description" content={title} />
      </Head>

      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-xs text-gray-500 mb-6">
        {new Date(date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })}
      </p>

      <article className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "posts/news");
  const filenames = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const paths = filenames
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ params: { slug: f.replace(/\.md$/, "") } }));

  return { paths, fallback: false  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "posts/news", `${slug}.md`);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    props: {
      title: data.title ?? slug,
      date: String(data.date ?? ""),
      contentHtml,
    },
  };
};
