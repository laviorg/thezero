import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isEvergreenFormat,
  isNewsFormat,
  isReviewArchiveFormat,
  parsePostFormat,
} from "./post-format.ts";

describe("parsePostFormat", () => {
  it("defaults a missing format to noticia", () => {
    assert.equal(parsePostFormat(undefined, "slug"), "noticia");
    assert.equal(parsePostFormat("", "slug"), "noticia");
  });

  it("accepts review, guia, comparativo, vale-a-pena and tutorial", () => {
    assert.equal(parsePostFormat("review", "slug"), "review");
    assert.equal(parsePostFormat("guia", "slug"), "guia");
    assert.equal(parsePostFormat("comparativo", "slug"), "comparativo");
    assert.equal(parsePostFormat("vale-a-pena", "slug"), "vale-a-pena");
    assert.equal(parsePostFormat("tutorial", "slug"), "tutorial");
  });

  it("rejects an unknown format", () => {
    assert.throws(
      () => parsePostFormat("analise", "teclado"),
      /format deve ser noticia\|review\|guia\|comparativo\|vale-a-pena\|tutorial/,
    );
  });
});

describe("format helpers", () => {
  it("treats omitted format as news", () => {
    assert.equal(isNewsFormat({}), true);
    assert.equal(isEvergreenFormat({}), false);
    assert.equal(isNewsFormat({ format: "noticia" }), true);
    assert.equal(isEvergreenFormat({ format: "noticia" }), false);
  });

  it("treats review, guia, comparativo, vale-a-pena and tutorial as evergreen", () => {
    for (const format of [
      "review",
      "guia",
      "comparativo",
      "vale-a-pena",
      "tutorial",
    ] as const) {
      assert.equal(isNewsFormat({ format }), false);
      assert.equal(isEvergreenFormat({ format }), true);
    }
  });

  it("keeps vale-a-pena and tutorial out of the review archive", () => {
    assert.equal(isReviewArchiveFormat({ format: "review" }), true);
    assert.equal(isReviewArchiveFormat({ format: "guia" }), true);
    assert.equal(isReviewArchiveFormat({ format: "comparativo" }), true);
    assert.equal(isReviewArchiveFormat({ format: "vale-a-pena" }), false);
    assert.equal(isReviewArchiveFormat({ format: "tutorial" }), false);
    assert.equal(isReviewArchiveFormat({ format: "noticia" }), false);
  });
});
