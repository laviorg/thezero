import { BuscaClient } from "./busca-client";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { searchPageTitle } from "@/lib/titles";
import type { Metadata } from "next";

export const dynamic = "force-static";

const pageMetadata = buildPageMetadata({
  title: searchPageTitle(),
  description: "Busca no newsroom do The Zero. Título, trecho, editoria.",
  path: "/busca",
  brand: "never",
  noIndex: true,
  imagePath: "/opengraph-image",
  imageAlt: site.name,
});

export const metadata: Metadata = {
  ...pageMetadata,
  robots: { index: false, follow: true, nocache: true },
};

export default function CloudflareSearchPage() {
  return <BuscaClient />;
}
