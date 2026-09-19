import { OgSplitO } from "@/components/brand/og-mark";
import { ogPalette } from "@/lib/theme";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: ogPalette.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OgSplitO size={132} />
      </div>
    ),
    { ...size },
  );
}
