import { OgWordmark } from "@/components/brand/og-mark";
import { getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const kicker = post?.kicker ?? post?.categoryLabel ?? "The Zero";
  const title = post?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0B",
          color: "#F4F4F5",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "#7CFFB2",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
          <OgWordmark width={168} />
        </div>
        <div
          style={{
            fontSize: title.length > 70 ? 52 : 64,
            fontWeight: 650,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ color: "#8B8B93", fontSize: 22 }}>{site.domain}</div>
      </div>
    ),
    { ...size },
  );
}
