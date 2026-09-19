import { OgWatermarkBadge, OgWordmark } from "@/components/brand/og-mark";
import { site } from "@/lib/site";
import { ogPalette } from "@/lib/theme";
import { ImageResponse } from "next/og";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: ogPalette.bg,
          color: ogPalette.fg,
          gap: 36,
          position: "relative",
        }}
      >
        <OgWordmark width={640} />
        <div style={{ display: "flex", color: ogPalette.muted, fontSize: 20 }}>
          {site.domain}
        </div>
        <OgWatermarkBadge handle={site.social.instagramHandle} />
      </div>
    ),
    { ...size },
  );
}
