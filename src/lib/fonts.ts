import { Geist, Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";

/**
 * Open newsroom pairing via next/font (self-hosted at build — no hotlinked
 * foundry files, no proprietary Verge faces such as Tiempos / GT America).
 *
 * Article pages use a three-role stack (inspiration: contemporary review
 * sites — heavy sans display + serif reading column + small UI sans):
 *
 * - Geist (Vercel): DISPLAY. Neo-grotesque with a true ExtraBold/Black.
 *   Story headlines, in-article headings, drop cap, and other display
 *   type. Tight tracking and weight 800 do the “thick modern sans” job —
 *   not a serif display (Fraunces) and not a copy of Verge’s licensed faces.
 *   latin-ext for pt-BR. Pairs with Geist Mono already in the stack.
 * - Source Serif 4 (Adobe): BODY. High-contrast newsroom text face for the
 *   reading column. latin-ext for pt-BR.
 * - Source Sans 3 (Adobe): UI / META. Kickers, tags, bylines, credits, nav,
 *   footer, chips. Small, clean, high x-height.
 * - Geist Mono: code only.
 */
export const fontDisplay = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
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
