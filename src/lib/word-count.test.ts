import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import matter from "gray-matter";
import { countPostWords } from "./word-count.ts";

const SLUG = "spotify-audiolivros-brasil-12-horas-premium";

describe("wordCount", () => {
  it("matches the body count and stays above 500 on the Spotify audiobooks post", () => {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content", "posts", `${SLUG}.mdx`),
      "utf8",
    );
    const { content } = matter(raw);
    const wordCount = countPostWords(content);
    assert.equal(wordCount, content.trim().split(/\s+/).filter(Boolean).length);
    assert.ok(wordCount > 500, `wordCount esperado > 500, veio ${wordCount}`);
  });
});
