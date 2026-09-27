import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import matter from "gray-matter";
import { parseImageSize } from "./image-size.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const POSTS = path.join(ROOT, "content", "posts");
const EVERGREEN = new Set(["review", "guia", "comparativo"]);

const PHOTO_COVERS: Record<string, string> = {
  "steam-deck-oled-brasil-preco-doi":
    "/images/posts/steam-deck-oled-brasil-preco-doi/cover.jpg",
  "switch-2-hype-vs-frame-rate":
    "/images/posts/switch-2-hype-vs-frame-rate/cover.jpg",
  "teclado-caro-atalhos-baratos":
    "/images/posts/teclado-caro-atalhos-baratos/cover.jpg",
};

type Row = {
  slug: string;
  format: string;
  cover: string;
  coverAlt: string;
  coverCredit: string;
  featured: boolean;
  content: string;
};

function rows(): Row[] {
  return fs
    .readdirSync(POSTS)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const parsed = matter(fs.readFileSync(path.join(POSTS, file), "utf8"));
      return {
        slug,
        format: typeof parsed.data.format === "string" ? parsed.data.format : "noticia",
        cover: typeof parsed.data.cover === "string" ? parsed.data.cover : "",
        coverAlt: typeof parsed.data.coverAlt === "string" ? parsed.data.coverAlt : "",
        coverCredit:
          typeof parsed.data.coverCredit === "string" ? parsed.data.coverCredit : "",
        featured: Boolean(parsed.data.featured),
        content: parsed.content,
      };
    });
}

describe("evergreen covers", () => {
  const posts = rows();
  const evergreen = posts.filter((post) => EVERGREEN.has(post.format));
  const slugs = new Set(posts.map((post) => post.slug));

  it("gives every evergreen a local cover and alt", () => {
    assert.ok(evergreen.length >= 119);
    for (const post of evergreen) {
      assert.equal(post.featured, false, post.slug);
      assert.match(post.cover, /^\//, post.slug);
      assert.notEqual(post.coverAlt.trim(), "", post.slug);
      const file = path.join(ROOT, "public", post.cover.replace(/^\//, ""));
      assert.equal(fs.existsSync(file), true, post.slug);
    }
  });

  it("keeps photographic covers and serves branded webp for the rest", () => {
    for (const post of evergreen) {
      const photo = PHOTO_COVERS[post.slug];
      if (photo) {
        assert.equal(post.cover, photo, post.slug);
        continue;
      }
      assert.equal(post.cover, `/covers/reviews/${post.slug}.webp`, post.slug);
      const file = path.join(ROOT, "public", post.cover.replace(/^\//, ""));
      const buf = fs.readFileSync(file);
      assert.ok(buf.length < 250 * 1024, `${post.slug} ${buf.length}`);
      assert.deepEqual(parseImageSize(buf), { width: 1200, height: 675 });
    }
  });

  it("serves photo covers for vale a pena and branded webp for tutorials", () => {
    const series = posts.filter((post) => post.format === "vale-a-pena");
    const tutorials = posts.filter((post) => post.format === "tutorial");
    assert.ok(series.length >= 4);
    assert.ok(tutorials.length >= 5);

    for (const post of series) {
      assert.equal(post.featured, false, post.slug);
      assert.match(post.cover, /^\/images\/posts\//, post.slug);
      assert.notEqual(post.coverAlt.trim(), "", post.slug);
      assert.notEqual(post.coverCredit.trim(), "", post.slug);
      const file = path.join(ROOT, "public", post.cover.replace(/^\//, ""));
      const buf = fs.readFileSync(file);
      const size = parseImageSize(buf);
      assert.ok(size && size.width >= 1200, post.slug);
    }

    for (const post of tutorials) {
      assert.equal(post.featured, false, post.slug);
      assert.equal(post.cover, `/covers/tutoriais/${post.slug}.webp`, post.slug);
      assert.notEqual(post.coverAlt.trim(), "", post.slug);
      const file = path.join(ROOT, "public", post.cover.replace(/^\//, ""));
      const buf = fs.readFileSync(file);
      assert.ok(buf.length < 250 * 1024, `${post.slug} ${buf.length}`);
      assert.deepEqual(parseImageSize(buf), { width: 1200, height: 675 });
    }
  });

  it("only links noticia slugs that exist, with a short Leia também block", () => {
    for (const post of posts) {
      for (const match of post.content.matchAll(/\]\(\/noticia\/([^)#\s]+)\)/g)) {
        const target = match[1]?.replace(/\/$/, "") ?? "";
        assert.equal(slugs.has(target), true, `${post.slug} → ${target}`);
      }
      const section = post.content.split("## Leia também")[1];
      if (!section) continue;
      const block = section.split(/\n## /)[0] ?? "";
      const links = [...block.matchAll(/\]\(\/noticia\//g)];
      assert.ok(links.length >= 1 && links.length <= 4, post.slug);
    }
  });
});
