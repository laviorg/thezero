import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Metadata } from "next";
import { articleImages } from "./article-images.ts";
import { readLocalImageSize } from "./image-size.ts";
import { buildPageMetadata } from "./metadata.ts";
import {
  articleSocialImage,
  resolveSocialImage,
  type ImageProbe,
  type SocialImage,
} from "./social-image.ts";

const GEMINI = "/images/posts/gemini-hackeou-tres-empresas-teste/cover.jpg";
const ZEENIX = "/images/posts/zeenix-lite-portatil-barato/cover.webp";
const ZEENIX_JPG = "/images/posts/zeenix-lite-portatil-barato/cover.src.jpg";
const REVIEW_WEBP = "/covers/reviews/notebook-gamer-ate-7-mil-brasil.webp";
const PNG_COVER = "/images/posts/amd-ryzen-z3-vazamento/cover.png";

function files(map: Record<string, { width: number; height: number }>): ImageProbe {
  return (src) => map[src.split("?")[0] ?? src];
}

function must(image: SocialImage | undefined): SocialImage {
  assert.ok(image);
  return image;
}

function ogImage(meta: Metadata) {
  const images = meta.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  assert.ok(first && typeof first === "object" && "url" in first);
  return first;
}

function twitterImage(meta: Metadata) {
  const images = meta.twitter?.images;
  assert.ok(Array.isArray(images));
  const first = images[0];
  assert.ok(first && typeof first === "object" && "url" in first);
  return first;
}

function twitterCard(meta: Metadata) {
  const twitter = meta.twitter;
  return twitter && "card" in twitter ? twitter.card : undefined;
}

describe("resolveSocialImage", () => {
  it("keeps a jpeg cover that is at least 1200px wide", () => {
    const image = must(resolveSocialImage({
      imagePath: "/images/posts/demo/cover.jpg",
      alt: "Legenda da capa",
      fallbackPath: "/noticia/demo/opengraph-image",
    }, files({
      "/images/posts/demo/cover.jpg": { width: 1438, height: 810 },
    })));
    assert.equal(image.path, "/images/posts/demo/cover.jpg");
    assert.equal(image.width, 1438);
    assert.equal(image.height, 810);
    assert.equal(image.type, "image/jpeg");
    assert.equal(image.alt, "Legenda da capa");
  });

  it("keeps a png cover and reports image/png", () => {
    const image = must(resolveSocialImage({
      imagePath: PNG_COVER,
      alt: "Print",
      fallbackPath: "/noticia/png/opengraph-image",
    }, files({
      [PNG_COVER]: { width: 1500, height: 843 },
    })));
    assert.equal(image.path, PNG_COVER);
    assert.equal(image.type, "image/png");
    assert.equal(image.width, 1500);
    assert.equal(image.height, 843);
  });

  it("prefers a same-name jpeg over the webp cover and over cover.src", () => {
    const image = must(resolveSocialImage({
      imagePath: "/images/posts/demo/cover.webp",
      alt: "Capa",
      fallbackPath: "/noticia/demo/opengraph-image",
    }, files({
      "/images/posts/demo/cover.webp": { width: 1200, height: 675 },
      "/images/posts/demo/cover.jpg": { width: 1600, height: 900 },
      "/images/posts/demo/cover.src.jpg": { width: 4000, height: 2000 },
    })));
    assert.equal(image.path, "/images/posts/demo/cover.jpg");
    assert.equal(image.type, "image/jpeg");
    assert.equal(image.width, 1600);
  });

  it("uses cover.src.jpg when the published cover is webp", () => {
    const image = must(resolveSocialImage({
      imagePath: "/images/posts/demo/cover.webp",
      alt: "Capa",
      fallbackPath: "/noticia/demo/opengraph-image",
    }, files({
      "/images/posts/demo/cover.webp": { width: 1200, height: 675 },
      "/images/posts/demo/cover.src.jpg": { width: 1920, height: 1080 },
    })));
    assert.equal(image.path, "/images/posts/demo/cover.src.jpg");
    assert.equal(image.width, 1920);
    assert.equal(image.height, 1080);
    assert.equal(image.type, "image/jpeg");
  });

  it("keeps a wide webp when no jpeg or png qualifies", () => {
    const image = must(resolveSocialImage({
      imagePath: REVIEW_WEBP,
      alt: "Cartaz",
      fallbackPath: "/noticia/review/opengraph-image",
    }, files({
      [REVIEW_WEBP]: { width: 1200, height: 675 },
      "/covers/reviews/notebook-gamer-ate-7-mil-brasil.jpg": { width: 800, height: 450 },
    })));
    assert.equal(image.path, REVIEW_WEBP);
    assert.equal(image.type, "image/webp");
    assert.equal(image.width, 1200);
    assert.equal(image.height, 675);
  });

  it("falls back to the generated card when the cover is missing or under 1200px", () => {
    const narrow = must(resolveSocialImage({
      imagePath: "/images/posts/demo/cover.jpg",
      alt: "Legenda",
      fallbackPath: "/noticia/demo/opengraph-image",
    }, files({
      "/images/posts/demo/cover.jpg": { width: 1199, height: 800 },
      "/images/posts/demo/cover.src.jpg": { width: 2400, height: 1350 },
    })));
    assert.equal(narrow.path, "/noticia/demo/opengraph-image");
    assert.equal(narrow.width, 1200);
    assert.equal(narrow.height, 630);
    assert.equal(narrow.type, "image/png");
    assert.equal(narrow.alt, "Legenda");

    const missing = must(resolveSocialImage({
      alt: "Sem capa",
      fallbackPath: "/noticia/sem-capa/opengraph-image",
    }, files({})));
    assert.equal(missing.path, "/noticia/sem-capa/opengraph-image");
    assert.equal(missing.type, "image/png");
  });

  it("does not replace a narrow webp with a larger jpeg sibling", () => {
    const image = must(resolveSocialImage({
      imagePath: "/images/posts/demo/cover.webp",
      alt: "Capa",
      fallbackPath: "/noticia/demo/opengraph-image",
    }, files({
      "/images/posts/demo/cover.webp": { width: 800, height: 450 },
      "/images/posts/demo/cover.src.jpg": { width: 2400, height: 1350 },
    })));
    assert.equal(image.path, "/noticia/demo/opengraph-image");
  });

  it("keeps the generated card for hub routes", () => {
    const image = must(resolveSocialImage({
      imagePath: "/ia/opengraph-image",
      alt: "IA | The Zero",
    }));
    assert.equal(image.path, "/ia/opengraph-image");
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal(image.type, "image/png");
    assert.equal(image.alt, "IA | The Zero");
  });
});

describe("articleSocialImage", () => {
  it("points a real jpeg article at the cover and the caption", () => {
    const image = articleSocialImage({
      slug: "gemini-hackeou-tres-empresas-teste",
      title: "Manchete",
      cover: GEMINI,
      coverAlt: "Gemini — cobertura sobre o incidente em teste",
    });
    assert.equal(image.path, GEMINI);
    assert.deepEqual(
      { width: image.width, height: image.height },
      readLocalImageSize(GEMINI),
    );
    assert.equal(image.width, 2400);
    assert.equal(image.height, 1349);
    assert.equal(image.type, "image/jpeg");
    assert.equal(image.alt, "Gemini — cobertura sobre o incidente em teste");
  });

  it("points a webp product cover at the original jpeg", () => {
    const image = articleSocialImage({
      slug: "zeenix-lite-portatil-barato",
      title: "Zeenix",
      cover: ZEENIX,
      coverAlt: "O portátil sobre a mesa",
    });
    assert.equal(image.path, ZEENIX_JPG);
    assert.equal(image.type, "image/jpeg");
    assert.deepEqual(
      { width: image.width, height: image.height },
      readLocalImageSize(ZEENIX_JPG),
    );
    assert.ok(image.width >= 1200);
    assert.equal(image.alt, "O portátil sobre a mesa");
  });

  it("keeps a branded webp review cover when that is the only file", () => {
    const image = articleSocialImage({
      slug: "notebook-gamer-ate-7-mil-brasil",
      title: "Notebook",
      cover: REVIEW_WEBP,
      coverAlt: "Cartaz do guia",
    });
    assert.equal(image.path, REVIEW_WEBP);
    assert.equal(image.type, "image/webp");
    assert.equal(image.width, 1200);
    assert.equal(image.height, 675);
  });

  it("keeps a png article cover", () => {
    const image = articleSocialImage({
      slug: "amd-ryzen-z3-vazamento",
      title: "Ryzen",
      cover: PNG_COVER,
      coverAlt: "Chip na placa",
    });
    assert.equal(image.path, PNG_COVER);
    assert.equal(image.type, "image/png");
    assert.equal(image.width, 1500);
    assert.equal(image.height, 843);
  });

  it("uses the generated card and the cover caption when the cover is narrow", () => {
    const image = articleSocialImage({
      slug: "estreita",
      title: "Manchete longa",
      cover: "/images/posts/estreita/cover.jpg",
      coverAlt: "Legenda da capa",
    }, () => ({ width: 640, height: 360 }));
    assert.equal(image.path, "/noticia/estreita/opengraph-image");
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal(image.type, "image/png");
    assert.equal(image.alt, "Legenda da capa");
  });

  it("uses the title when the cover has no caption", () => {
    const image = articleSocialImage({
      slug: "sem-alt",
      title: "Título da matéria",
    }, () => undefined);
    assert.equal(image.path, "/noticia/sem-alt/opengraph-image");
    assert.equal(image.alt, "Título da matéria");
  });
});

describe("buildPageMetadata social image", () => {
  it("emits the cover as an absolute www og:image and twitter:image", () => {
    const meta = buildPageMetadata({
      title: "Google Gemini invadiu três empresas em teste",
      description: "Teste.",
      path: "/noticia/gemini-hackeou-tres-empresas-teste",
      type: "article",
      imagePath: GEMINI,
      imageAlt: "Gemini — cobertura sobre o incidente em teste",
    });
    const og = ogImage(meta);
    const twitter = twitterImage(meta);
    const expected = "https://www.thezero.com.br/images/posts/gemini-hackeou-tres-empresas-teste/cover.jpg";
    assert.equal(String(og.url), expected);
    assert.equal(og.width, 2400);
    assert.equal(og.height, 1349);
    assert.equal(og.type, "image/jpeg");
    assert.equal(og.alt, "Gemini — cobertura sobre o incidente em teste");
    assert.equal(twitterCard(meta), "summary_large_image");
    assert.equal(String(twitter.url), expected);
    assert.equal(twitter.alt, "Gemini — cobertura sobre o incidente em teste");
  });

  it("leaves the generated card on hub paths", () => {
    const meta = buildPageMetadata({
      title: "IA: ferramentas, modelos e limites",
      description: "Demo antes da promessa.",
      path: "/ia",
      brand: "always",
      imagePath: "/ia/opengraph-image",
      imageAlt: "IA: ferramentas, modelos e limites | The Zero",
    });
    const og = ogImage(meta);
    assert.equal(String(og.url), "https://www.thezero.com.br/ia/opengraph-image");
    assert.equal(og.width, 1200);
    assert.equal(og.height, 630);
    assert.equal(og.type, "image/png");
    assert.equal(twitterCard(meta), "summary_large_image");
  });

  it("describes a guide png with its real size", () => {
    const meta = buildPageMetadata({
      title: "Consoles portáteis",
      description: "Guia.",
      path: "/guias/consoles-portateis",
      imagePath: "/images/pages/consoles-portateis.png",
      imageAlt: "Consoles portáteis",
    });
    const og = ogImage(meta);
    assert.equal(
      String(og.url),
      "https://www.thezero.com.br/images/pages/consoles-portateis.png",
    );
    assert.equal(og.width, 1200);
    assert.equal(og.height, 630);
    assert.equal(og.type, "image/png");
    assert.equal(og.alt, "Consoles portáteis");
  });
});

describe("article JSON-LD stays on the cover list", () => {
  it("still lists the cover, the derived crops, and the generated card", () => {
    const images = articleImages({
      slug: "gemini-hackeou-tres-empresas-teste",
      title: "Manchete",
      cover: GEMINI,
      coverAlt: "Gemini — cobertura sobre o incidente em teste",
    });
    assert.equal(images.length, 5);
    assert.match(images[0]?.url ?? "", /\/cover\.jpg$/);
    assert.match(images[1]?.url ?? "", /\/cover\.16x9\.webp$/);
    assert.match(images[4]?.url ?? "", /\/opengraph-image$/);
    const social = articleSocialImage({
      slug: "gemini-hackeou-tres-empresas-teste",
      title: "Manchete",
      cover: GEMINI,
      coverAlt: "Gemini — cobertura sobre o incidente em teste",
    });
    assert.equal(social.path, GEMINI);
    assert.notEqual(social.path, "/noticia/gemini-hackeou-tres-empresas-teste/opengraph-image");
  });
});
