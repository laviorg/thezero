import { mdxComponents } from "@/components/mdx/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { remarkFontes } from "@/lib/remark-fontes";

export async function ArticleBody({ source }: { source: string }) {
  return (
    <div className="article-body">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkFontes],
          },
        }}
      />
    </div>
  );
}
