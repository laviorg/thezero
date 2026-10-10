/** Same split used by `toPost`. Do not change without a proven bug. */
export function countPostWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}
