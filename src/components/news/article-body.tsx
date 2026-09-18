import { mdxComponents } from "@/components/mdx/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export async function ArticleBody({ source }: { source: string }) {
  return (
    <div className="article-body">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
