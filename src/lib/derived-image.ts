/**
 * Caminhos dos derivados WebP gerados por scripts/derive-covers.mjs.
 * Só vale para imagens locais em /images/posts/; o resto volta como veio.
 */
export type CoverRatio = "16x9" | "4x3" | "1x1";

export function derivedImagePath(src: string | undefined, ratio?: CoverRatio) {
  if (!src || !src.startsWith("/images/posts/")) return undefined;
  const stem = src.replace(/^\/images\/posts\//, "").replace(/\.[^./]+$/, "");
  return `/images/derived/posts/${stem}${ratio ? `.${ratio}` : ""}.webp`;
}
