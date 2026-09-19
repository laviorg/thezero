import { Bricolage_Grotesque, Geist_Mono, Source_Sans_3 } from "next/font/google";

/**
 * Open newsroom pairing via next/font (self-hosted at build — no hotlinked
 * foundry files, no proprietary Verge faces).
 *
 * - Bricolage Grotesque: display. Tight, slightly quirky grotesque for
 *   headlines, kickers, and section titles — the “strong display” role in a
 *   contemporary review stack.
 * - Source Sans 3: text + UI. High x-height, newsroom-readable, latin-ext
 *   for pt-BR. Used for body, dek, bylines, nav, and captions.
 * - Geist Mono: code only.
 */
export const fontDisplay = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
