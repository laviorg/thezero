import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toIsoDate } from "./format.ts";
import { articleImages } from "./article-images.ts";
import { parseImageSize, readLocalImageSize } from "./image-size.ts";
import { buildPageMetadata } from "./metadata.ts";
import {
  buildNewsSitemapXml,
  selectRecentPublications,
} from "./news-sitemap.ts";
import { articleAuthorLd } from "./seo.ts";
import { resolveSiteUrl, site } from "./site.ts";

describe("resolveSiteUrl", () => {
  it("keeps www as the only public origin for thezero.com.br", () => {
    assert.equal(resolveSiteUrl(undefined), "https://www.thezero.com.br");
    assert.equal(resolveSiteUrl("https://thezero.com.br"), "https://www.thezero.com.br");
    assert.equal(
      resolveSiteUrl("https://thezero.com.br/"),
      "https://www.thezero.com.br",
    );
    assert.equal(
      resolveSiteUrl("http://www.thezero.com.br"),
      "https://www.thezero.com.br",
    );
    assert.equal(resolveSiteUrl("http://127.0.0.1:43127"), "http://127.0.0.1:43127");
    assert.equal(site.url, resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL));
  });
});

describe("articleAuthorLd", () => {
  it("gives the house author a name and a homepage URL", () => {
    const author = articleAuthorLd("The Zero");
    assert.equal(author["@type"], "Organization");
    assert.equal(author.name, "The Zero");
    assert.equal("url" in author && author.url, site.url);
  });

  it("does not point a named person at the organization page", () => {
    const author = articleAuthorLd("Ada");
    assert.equal(author["@type"], "Person");
    assert.equal(author.name, "Ada");
    assert.equal("url" in author, false);
  });
});

describe("buildPageMetadata", () => {
  it("keeps the feed link and drops a fake canonical on 404", () => {
    const meta = buildPageMetadata({
      title: "Página não encontrada",
      description: "Essa URL não existe.",
      path: "/404",
      brand: "always",
      noIndex: true,
      omitCanonical: true,
    });
    assert.equal(meta.alternates?.canonical, undefined);
    assert.equal(meta.alternates?.languages, undefined);
    assert.equal(meta.alternates?.types?.["application/rss+xml"], "/rss.xml");
    assert.equal(
      meta.robots && typeof meta.robots === "object" && "index" in meta.robots
        ? meta.robots.index
        : undefined,
      false,
    );
  });

  it("puts alt text on the Twitter image", () => {
    const meta = buildPageMetadata({
      title: "IA: ferramentas, modelos e limites",
      description: "Demo antes da promessa.",
      path: "/ia",
      brand: "always",
      imagePath: "/ia/opengraph-image",
      imageAlt: "IA: ferramentas, modelos e limites · The Zero",
    });
    const images = meta.twitter?.images;
    assert.ok(Array.isArray(images));
    const first = images[0];
    assert.equal(typeof first === "object" && first && "alt" in first ? first.alt : "", "IA: ferramentas, modelos e limites · The Zero");
  });

  it("emits an absolute www canonical for article paths", () => {
    const meta = buildPageMetadata({
      title: "Google Gemini invadiu três empresas em teste",
      description: "Teste.",
      path: "/noticia/gemini-hackeou-tres-empresas-teste",
      type: "article",
    });
    assert.equal(
      meta.alternates?.canonical,
      "https://www.thezero.com.br/noticia/gemini-hackeou-tres-empresas-teste",
    );
    const languages = meta.alternates?.languages;
    assert.equal(
      languages && "pt-BR" in languages ? languages["pt-BR"] : "",
      "https://www.thezero.com.br/noticia/gemini-hackeou-tres-empresas-teste",
    );
    assert.equal(String(meta.openGraph?.url), "https://www.thezero.com.br/noticia/gemini-hackeou-tres-empresas-teste");
    assert.doesNotMatch(String(meta.alternates?.canonical), /^https:\/\/thezero\.com\.br\//);
  });
});

describe("toIsoDate", () => {
  it("keeps a date-only value at 08:00 and preserves a real timestamp", () => {
    assert.equal(toIsoDate("2026-09-19"), "2026-09-19T08:00:00-03:00");
    assert.equal(
      toIsoDate("2026-09-23T18:54:06-03:00"),
      "2026-09-23T18:54:06-03:00",
    );
    assert.equal(
      toIsoDate("2026-09-23T21:54:06Z"),
      "2026-09-23T18:54:06-03:00",
    );
  });
});

describe("news sitemap", () => {
  const now = Date.parse("2026-09-23T12:00:00-03:00");

  it("keeps only articles from the last two days", () => {
    const posts = [
      { dateIso: "2026-09-22T08:00:00-03:00", id: "fresh" },
      { dateIso: "2026-09-19T08:00:00-03:00", id: "old" },
      { dateIso: "2026-09-24T08:00:00-03:00", id: "future" },
    ];
    assert.deepEqual(
      selectRecentPublications(posts, now).map((post) => post.id),
      ["fresh"],
    );
  });

  it("escapes titles and lists the cover", () => {
    const xml = buildNewsSitemapXml(
      [
        {
          loc: "https://thezero.com.br/noticia/a&b",
          title: "Preço < R$ 10 & 'ok'",
          publicationDate: "2026-09-22T08:00:00-03:00",
          images: ["https://thezero.com.br/images/cover.jpg"],
        },
      ],
      "The Zero",
    );
    assert.match(xml, /xmlns:news="http:\/\/www.google.com\/schemas\/sitemap-news\/0.9"/);
    assert.match(xml, /xmlns:image="http:\/\/www.google.com\/schemas\/sitemap-image\/1.1"/);
    assert.match(xml, /<news:language>pt<\/news:language>/);
    assert.match(xml, /<loc>https:\/\/thezero.com.br\/noticia\/a&amp;b<\/loc>/);
    assert.match(xml, /<news:title>Preço &lt; R\$ 10 &amp; &apos;ok&apos;<\/news:title>/);
    assert.match(xml, /<image:loc>https:\/\/thezero.com.br\/images\/cover.jpg<\/image:loc>/);
    assert.doesNotMatch(xml, /<news:keywords>/);
  });
});

describe("image size", () => {
  it("reads a PNG header", () => {
    const png = Buffer.alloc(24);
    png.write("\x89PNG\r\n\x1a\n", 0, "binary");
    png.write("IHDR", 12, "ascii");
    png.writeUInt32BE(1200, 16);
    png.writeUInt32BE(630, 20);
    assert.deepEqual(parseImageSize(png), { width: 1200, height: 630 });
  });

  it("reads a local cover without inventing 16:9", () => {
    const size = readLocalImageSize(
      "/images/posts/gemini-hackeou-tres-empresas-teste/cover.jpg",
    );
    assert.deepEqual(size, { width: 2400, height: 1349 });
  });
});

describe("articleImages", () => {
  it("lists the cover before the on-domain card and keeps card dimensions", () => {
    const images = articleImages({
      slug: "gemini-hackeou-tres-empresas-teste",
      title: "Manchete",
      cover: "/images/posts/gemini-hackeou-tres-empresas-teste/cover.jpg",
      coverAlt: "Gemini — cobertura sobre o incidente em teste",
    });
    assert.equal(images.length, 2);
    assert.match(images[0]?.url ?? "", /gemini-hackeou-tres-empresas-teste\/cover\.jpg$/);
    assert.equal(images[0]?.caption, "Gemini — cobertura sobre o incidente em teste");
    assert.ok((images[0]?.width ?? 0) > 0);
    assert.match(images[1]?.url ?? "", /\/noticia\/gemini-hackeou-tres-empresas-teste\/opengraph-image$/);
    assert.equal(images[1]?.width, 1200);
    assert.equal(images[1]?.height, 630);
  });
});
