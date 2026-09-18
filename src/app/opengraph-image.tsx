import { OgWordmark } from "@/components/brand/og-mark";
import { site } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = `${site.name} — ${site.tagline}`;
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
          background: "#0A0A0B",
          color: "#F4F4F5",
          gap: 36,
        }}
      >
        <OgWordmark width={640} />
        <div
          style={{
            color: "#7CFFB2",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {site.tagline}
        </div>
        <div style={{ color: "#8B8B93", fontSize: 20 }}>{site.domain}</div>
      </div>
    ),
    { ...size },
  );
}
