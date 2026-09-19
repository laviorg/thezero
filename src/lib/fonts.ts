import { Fraunces, Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";

/**
 * Open newsroom pairing via next/font (self-hosted at build — no hotlinked
 * foundry files, no proprietary Verge faces such as Tiempos).
 *
 * Chosen so article pages are obviously not generic UI sans:
 *
 * - Fraunces (Undercase Type): DISPLAY. Soft-serif with optical size, SOFT and
 *   WONK axes. Magazine headline presence for story titles, section heads,
 *   pullquotes, and byline names. Distinct from the previous Bricolage
 *   Grotesque stack and from Inter/system UI.
 * - Source Serif 4 (Adobe): BODY. High-contrast newsroom text face for the
 *   reading column and story dek. latin-ext for pt-BR.
 * - Source Sans 3 (Adobe): UI. Nav, footer, chips, kickers, captions, chrome.
 * - Geist Mono: code only.
 */
export const fontDisplay = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const fontSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fontSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
