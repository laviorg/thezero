import {
  MARK_PATH,
  MARK_VIEWBOX,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";

const [, , viewW, viewH] = WORDMARK_VIEWBOX.split(" ").map(Number);

export function ogWordmarkSize(width: number) {
  return { width, height: Math.round((width * viewH) / viewW) };
}

export function OgWordmark({
  width,
  color = "#F4F4F5",
}: {
  width: number;
  color?: string;
}) {
  const { height } = ogWordmarkSize(width);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={WORDMARK_VIEWBOX}
    >
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  );
}

export function OgSplitO({
  size,
  color = "#F4F4F5",
}: {
  size: number;
  color?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
    >
      <path d={MARK_PATH} fill={color} />
    </svg>
  );
}
