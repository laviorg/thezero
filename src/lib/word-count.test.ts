import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPostBySlug } from "./posts.ts";

function countBodyWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

describe("wordCount", () => {
  it("matches the body count and stays above 500 on the Spotify audiobooks post", () => {
    const post = getPostBySlug("spotify-audiolivros-brasil-12-horas-premium");
    assert.ok(post, "post spotify-audiolivros-brasil-12-horas-premium precisa existir");
    const expected = countBodyWords(post.content);
    assert.equal(post.wordCount, expected);
    assert.ok(
      post.wordCount > 500,
      `wordCount esperado > 500, veio ${post.wordCount}`,
    );
  });
});
