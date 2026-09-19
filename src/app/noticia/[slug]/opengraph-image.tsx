import { OgWatermarkBadge, OgWordmark } from "@/components/brand/og-mark";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { assetUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { ogPalette } from "@/lib/theme";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

async function ogCoverSrc(cover?: string) {
  if (!cover) return undefined;
  if (cover.toLowerCase().endsWith(".webp")) return undefined;
  if (/^https?:\/\//i.test(cover)) return cover;

  const filePath = path.join(process.cwd(), "public", cover.replace(/^\//, ""));
  try {
    const buf = await readFile(filePath);
    const mime = cover.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return assetUrl(cover);
  }
}

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const kicker =
    post?.kicker ??
    post?.subcategoryLabel ??
    post?.categoryLabel ??
    "The Zero";
  const title = post?.title ?? site.name;
  const cover = await ogCoverSrc(post?.cover);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ogPalette.bg,
          color: ogPalette.fg,
          padding: "72px",
          position: "relative",
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        ) : null}
        {cover ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              background:
                "linear-gradient(180deg, rgba(12,18,32,0.35) 0%, rgba(12,18,32,0.15) 40%, rgba(12,18,32,0.82) 100%)",
            }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              color: ogPalette.accent,
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
          {!cover ? <OgWordmark width={168} /> : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: title.length > 70 ? 52 : 64,
              fontWeight: 650,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", color: ogPalette.muted, fontSize: 22 }}>
            {site.domain}
          </div>
        </div>
        <OgWatermarkBadge handle={site.social.instagramHandle} />
      </div>
    ),
    { ...size },
  );
}
