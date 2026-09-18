import { OgWatermarkBadge, OgWordmark } from "@/components/brand/og-mark";
import { categoryList, getCategory } from "@/lib/categories";
import { site } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return categoryList.map((category) => ({ category: category.slug }));
}

export default async function CategoryOpenGraphImage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  const label = category?.label ?? site.name;
  const kicker = category?.kicker ?? site.name;

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
          position: "relative",
        }}
      >
        <OgWordmark width={220} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: "#7CFFB2",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 650,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            {label}
          </div>
          <div style={{ display: "flex", color: "#8B8B93", fontSize: 22 }}>
            {site.domain}
          </div>
        </div>
        <OgWatermarkBadge handle={site.social.instagramHandle} />
      </div>
    ),
    { ...size },
  );
}
