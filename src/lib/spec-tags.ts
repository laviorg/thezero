/** Tags técnicas detectadas no texto, para filtrar na paleta Ctrl+K. */
const RULES: [string, RegExp][] = [
  ["OLED", /\bOLED\b/],
  ["TDP", /\bTDP\b/],
  ["API", /\bAPI\b/],
  ["Wh", /\b\d+(,\d+)? ?Wh\b/],
  ["Ryzen", /\bRyzen\b/],
  ["Snapdragon", /\bSnapdragon\b/],
  ["Core Ultra", /\bCore Ultra\b/],
  ["Apple M", /\bM[1-6]( Pro| Max| Ultra)?\b(?= )/],
  ["RTX", /\bRTX ?\d{4}/],
  ["Radeon", /\bRadeon\b/],
  ["Tensor", /\bTensor G\d/],
  ["Dimensity", /\bDimensity\b/],
];

export function specTags(text: string) {
  return RULES.filter(([, re]) => re.test(text)).map(([tag]) => tag);
}
