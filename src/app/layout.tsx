import { newsRobots } from "@/lib/seo";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { GoogleAnalyticsScript } from "@/components/analytics/ga-script";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/news/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { adsenseClientId, getAdsensePubId } from "@/lib/adsense";
import { getActiveReviewBuckets, getActiveSubcategories } from "@/lib/posts";
import { categoryMenus } from "@/lib/site-nav";
import { site } from "@/lib/site";
import { themeColor } from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { fontDisplay, fontMono, fontSans, fontSerif } from "@/lib/fonts";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: themeColor.dark },
  ],
};

const adsensePubId = getAdsensePubId();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "The Zero",
    "tech",
    "tecnologia",
    "IA",
    "computadores",
    "componentes",
    "periféricos",
    "dispositivos",
    "celulares",
    "aplicativos",
    "consoles",
    "jogos",
    "Brasil",
    "notícias de tecnologia",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: newsRobots,
  other: {
    "p:domain_verify": "1ce869a72360f9b03b5e8023bb72a9b2",
    ...(adsensePubId
      ? { "google-adsense-account": adsenseClientId(adsensePubId) }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const activeSubs = getActiveSubcategories();
  // Menu de topo: 5 itens. Subcategorias ficam dentro de cada seção.
  const sections = [
    {
      id: "noticias",
      href: "/",
      label: "Notícias",
      menuLabel: "Editorias",
      links: categoryMenus(activeSubs).map((category) => ({
        href: category.href,
        label: category.label,
      })),
    },
    {
      id: "reviews",
      href: "/reviews",
      label: "Reviews",
      menuLabel: "Por produto",
      links: [
        ...getActiveReviewBuckets().map((bucket) => ({
          href: bucket.href,
          label: bucket.label,
        })),
        { href: "/vale-a-pena", label: "Vale a pena?" },
      ],
    },
    {
      id: "guias",
      href: "/tutoriais",
      label: "Guias",
      menuLabel: "Guias",
      links: [
        { href: "/tutoriais", label: "Tutoriais" },
        { href: "/vale-a-pena", label: "Vale a pena?" },
        { href: "/glossario", label: "Glossário" },
        { href: "/como-testamos", label: "Como testamos" },
      ],
    },
    {
      id: "ofertas",
      href: "/menor-preco",
      label: "Ofertas",
      menuLabel: "Compras",
      links: [
        { href: "/menor-preco", label: "Menor preço do dia" },
        { href: "/black-friday", label: "Black Friday 2026" },
        { href: "/11-11", label: "11.11" },
        { href: "/prime-day", label: "Prime Day" },
      ],
    },
    {
      id: "ferramentas",
      href: "/ferramentas",
      label: "Ferramentas",
      menuLabel: "Calculadoras",
      links: [
        { href: "/ferramentas/meu-pc-roda", label: "Meu PC roda?" },
        { href: "/ferramentas/calculadora-de-fonte", label: "Calculadora de fonte" },
        { href: "/ferramentas/montar-pc", label: "Montar PC" },
      ],
    },
  ];

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <meta name="lomadee" content="2324685" />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-fg">
        <ThemeProvider>
          <ConsentProvider>
            <OrganizationJsonLd />
            <WebsiteJsonLd />
            <a href="#conteudo" className="skip-link">
              Ir para o conteúdo
            </a>
            <SiteHeader sections={sections} />
            <main id="conteudo" className="min-w-0 flex-1">
              {children}
            </main>
            <SiteFooter />
            <CookieBanner />
            <AdSenseScript />
            <GoogleAnalyticsScript />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
