import { OgSplitO } from "@/components/brand/og-mark";
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
          background: "#0A0A0B",
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
