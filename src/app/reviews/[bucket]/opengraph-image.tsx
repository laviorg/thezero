import { OgWatermarkBadge, OgWordmark } from "@/components/brand/og-mark";
import { getActiveReviewBuckets } from "@/lib/posts";
import { getReviewBucket } from "@/lib/review-buckets";
import { site } from "@/lib/site";
import { ogPalette } from "@/lib/theme";
import { ImageResponse } from "next/og";

export const alt = "Reviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getActiveReviewBuckets().map((bucket) => ({ bucket: bucket.slug }));
}

export default async function ReviewBucketOpenGraphImage({
  params,
}: {
  params: Promise<{ bucket: string }>;
}) {
  const { bucket: slug } = await params;
  const bucket = getReviewBucket(slug);
  const label = bucket?.label ?? "Reviews";
  const fontSize = [...label].length > 14 ? 60 : 72;

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
        <OgWordmark width={220} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: ogPalette.accent,
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Reviews
          </div>
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 650,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              maxWidth: 1040,
            }}
          >
            {label}
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
