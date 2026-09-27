import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import matter from "gray-matter";
import { categoryList, subcategoryList } from "./categories.ts";
import {
  REVIEW_BUCKET_LIST,
  assignReviewBucket,
  type ReviewBucketInput,
  type ReviewBucketSlug,
} from "./review-buckets.ts";

const POSTS = path.resolve(import.meta.dirname, "../../content/posts");

const REQUIRED = [
  "consoles",
  "consoles-portateis",
  "notebooks",
  "pcs",
  "celulares",
  "acessorios",
] as const;

/**
 * Evergreen that the map deliberately leaves on `/reviews` only.
 * A new guia in a known subcategory should not land here.
 */
const UNBUCKETED = [
  "action-cam-barata-vs-celular-estabilizado",
  "como-ler-um-patch-day",
  "fibra-500-mb-vs-1-gb",
  "garantia-estendida-quando-recusar",
  "pre-venda-de-jogo-desconto-depois",
];

const CASES: Record<string, ReviewBucketSlug | null> = {
  "switch-2-hype-vs-frame-rate": "consoles",
  "switch-2-vs-steam-deck-oled-preco-brasil": "consoles",
  "ps5-slim-vale-a-pena-2026-brasil": "consoles",
  "controle-original-vs-generico-console": "consoles",
  "ssd-no-ps5-upgrade": "consoles",
  "steam-deck-oled-brasil-preco-doi": "consoles-portateis",
  "legion-go-vs-rog-ally": "consoles-portateis",
  "rog-ally-x-brasil-preco-desempenho": "consoles-portateis",
  "zeenix-lite-portatil-barato": "consoles-portateis",
  "windows-no-handheld-vs-steamos": "consoles-portateis",
  "acessorios-steam-deck-dock-case-sd": "acessorios",
  "power-bank-pc-portatil-wattagem": "acessorios",
  "ultrabook-faculdade-bateria-tela-teclado": "notebooks",
  "macbook-air-m3-vs-notebook-windows-8-mil": "notebooks",
  "rtx-3050-vs-4050-notebook": "notebooks",
  "ram-soldada-notebook-arrependimento": "notebooks",
  "pc-gamer-ate-4-mil-2026": "pcs",
  "mini-pc-quando-substitui-o-desktop": "pcs",
  "all-in-one-escritorio-pequeno": "pcs",
  "ddr4-vs-ddr5-ainda-vale-montar": "pcs",
  "fonte-650w-80-plus-o-que-nao-economizar": "pcs",
  "galaxy-s25-vs-iphone-16-pra-quem": "celulares",
  "capinha-e-pelicula-o-que-protege": "celulares",
  "carregador-usb-c-rapido-sem-fritar-bateria": "celulares",
  "fone-tws-ate-300-audio-e-microfone": "acessorios",
  "teclado-mecanico-ate-400-abnt": "acessorios",
  "cadeira-gamer-vs-escritorio-ate-1500": "acessorios",
  "monitor-144hz-full-hd-vs-1440p": "acessorios",
  "dock-usb-c-notebook-o-que-nao-economizar": "acessorios",
  "usb-c-cabo-errado-2026": "acessorios",
  "carregamento-sem-fio-calor-e-bateria": "acessorios",
  "segunda-tela-vertical-codigo": "acessorios",
  "tablet-ate-1500-estudar-e-netflix": "tablets",
  "ipad-10-vs-tablet-android-gap-de-apps": "tablets",
  "smartwatch-barato-o-que-medir": "vestiveis",
  "tv-55-4k-ate-2500-o-que-nao-cair": "tv-e-streaming",
  "tomada-inteligente-economia-ou-hype": "casa-conectada",
  "roteador-wifi-6-barato-modem-operadora": "casa-conectada",
  "vs-code-vs-cursor-para-quem-comeca": "software-e-servicos",
  "windows-11-pc-fraco-o-que-desligar": "software-e-servicos",
  "chatgpt-vs-gemini-no-celular": "ia",
  "game-pass-ultimate-vs-comprar-jogo": "lojas-e-assinaturas",
  "steam-vs-epic-vs-xbox-pc-preco": "lojas-e-assinaturas",
  "como-ler-um-patch-day": null,
  "garantia-estendida-quando-recusar": null,
  "xiaomi-18-pro-max-china": null,
};

function loadPosts(): ReviewBucketInput[] {
  return fs
    .readdirSync(POSTS)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const parsed = matter(fs.readFileSync(path.join(POSTS, file), "utf8"));
      const data = parsed.data as Record<string, unknown>;
      return {
        slug,
        title: typeof data.title === "string" ? data.title : "",
        category: typeof data.category === "string" ? data.category : "",
        subcategory:
          typeof data.subcategory === "string" ? data.subcategory : undefined,
        format: typeof data.format === "string" ? data.format : undefined,
      };
    });
}

describe("review buckets", () => {
  it("keeps the required product lines first, off the editoria routes", () => {
    assert.deepEqual(
      REVIEW_BUCKET_LIST.slice(0, REQUIRED.length).map((bucket) => bucket.slug),
      [...REQUIRED],
    );
    assert.deepEqual(
      REVIEW_BUCKET_LIST.slice(0, REQUIRED.length).map((bucket) => bucket.label),
      [
        "Consoles",
        "Consoles portáteis",
        "Notebooks",
        "PCs",
        "Celulares",
        "Acessórios",
      ],
    );

    const editoriaHrefs = new Set([
      ...categoryList.map((category) => category.href),
      ...subcategoryList.map((subcategory) => subcategory.href),
    ]);
    for (const bucket of REVIEW_BUCKET_LIST) {
      assert.equal(bucket.href, `/reviews/${bucket.slug}`);
      assert.equal(editoriaHrefs.has(bucket.href), false, bucket.href);
    }
  });

  it("assigns the archive from subcategory, with the documented title cuts", () => {
    const posts = loadPosts();
    const bySlug = new Map(posts.map((post) => [post.slug, post]));

    for (const [slug, expected] of Object.entries(CASES)) {
      const post = bySlug.get(slug);
      assert.ok(post, `missing ${slug}`);
      assert.equal(assignReviewBucket(post), expected, slug);
    }

    for (const post of posts) {
      if ((post.format ?? "noticia") === "noticia") {
        assert.equal(assignReviewBucket(post), null, post.slug);
      }
      if (post.format === "vale-a-pena" || post.format === "tutorial") {
        assert.equal(assignReviewBucket(post), null, post.slug);
      }
    }

    const evergreen = posts.filter(
      (post) =>
        post.format === "review" ||
        post.format === "guia" ||
        post.format === "comparativo",
    );
    const counts = new Map<ReviewBucketSlug, number>();
    const unbucketed: string[] = [];
    for (const post of evergreen) {
      const assigned = assignReviewBucket(post);
      if (!assigned) {
        unbucketed.push(post.slug);
        continue;
      }
      counts.set(assigned, (counts.get(assigned) ?? 0) + 1);
    }

    assert.deepEqual(unbucketed.sort(), [...UNBUCKETED].sort());
    const assignedTotal = [...counts.values()].reduce((sum, count) => sum + count, 0);
    assert.equal(assignedTotal + unbucketed.length, evergreen.length);

    for (const slug of REQUIRED) {
      assert.ok((counts.get(slug) ?? 0) >= 1, slug);
    }
    for (const bucket of REVIEW_BUCKET_LIST) {
      if ((REQUIRED as readonly string[]).includes(bucket.slug)) continue;
      const count = counts.get(bucket.slug) ?? 0;
      assert.ok(count >= 2, `${bucket.slug} has ${count}`);
    }
  });
});
