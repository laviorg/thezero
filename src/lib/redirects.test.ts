import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { PATH_REDIRECTS } from "./redirects.ts";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

/** Truncated URLs from the 11 Nov 2026 Search Console 404 sample, each with one live post. */
const TRUNCATED_SLUGS: [string, string][] = [
  [
    "/noticia/node-js-corrige-falha-brotli-exe",
    "/noticia/node-js-corrige-falha-brotli-execucao-remota",
  ],
  [
    "/noticia/block-dessa-modelo-voz",
    "/noticia/block-dessa-modelo-voz-local-treinado-so-fala",
  ],
  ["/noticia/claude-duet-", "/noticia/claude-duet-agente-anthropic"],
  [
    "/noticia/openai-decisions-",
    "/noticia/openai-decisions-api-gpt-6-luna-decisoes-rapidas",
  ],
  [
    "/noticia/sidetrack-tiny-trains-desk",
    "/noticia/sidetrack-tiny-trains-desktop-steam",
  ],
  [
    "/noticia/geely-g",
    "/noticia/geely-google-gemini-maps-play-painel-2027",
  ],
  [
    "/noticia/call-of-duty-modern-warfare",
    "/noticia/call-of-duty-modern-warfare-4-acesso-antecipado",
  ],
  [
    "/noticia/honor",
    "/noticia/honor-win2-ventoinhas-bateria-10100-mah",
  ],
];

const AMBIGUOUS_STUBS = [
  "/noticia/ana",
  "/noticia/so",
  "/noticia/d",
  "/n",
  "/not",
  "/no",
  "/notici",
  "/cdn-cgi/l/email-protection",
];

function postSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

function frontmatter(slug: string): string {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, slug);
  return match[1] ?? "";
}

describe("truncated article redirects", () => {
  it("sends each verified stub to the single current post", () => {
    const slugs = postSlugs();
    const sources = new Set(PATH_REDIRECTS.map((rule) => rule.source));

    for (const [source, destination] of TRUNCATED_SLUGS) {
      const rule = PATH_REDIRECTS.find((item) => item.source === source);
      assert.ok(rule, source);
      assert.equal(rule.destination, destination);
      assert.equal(rule.status, 301);
      assert.equal(sources.has(destination), false, destination);

      const stub = source.slice("/noticia/".length);
      const target = destination.slice("/noticia/".length);
      const matches = slugs.filter(
        (slug) => slug === stub || slug.startsWith(stub),
      );
      assert.ok(matches.includes(target), `${source} -> ${matches.join(", ")}`);
      if (source !== "/noticia/call-of-duty-modern-warfare") {
        assert.deepEqual(matches, [target]);
      }
    }
  });

  it("points Modern Warfare at the indexable story, not the noindex announcement", () => {
    const canonical = frontmatter("call-of-duty-modern-warfare-4-acesso-antecipado");
    const announcement = frontmatter("call-of-duty-modern-warfare-4");
    assert.equal(canonical.includes("noindex: true"), false);
    assert.match(announcement, /^noindex: true$/m);
  });

  it("does not invent a target for ambiguous stubs", () => {
    for (const source of AMBIGUOUS_STUBS) {
      assert.equal(
        PATH_REDIRECTS.some((rule) => rule.source === source),
        false,
        source,
      );
    }
  });
});
