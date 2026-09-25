import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isEvergreenFormat,
  isNewsFormat,
  parsePostFormat,
} from "./post-format.ts";

describe("parsePostFormat", () => {
  it("defaults a missing format to noticia", () => {
    assert.equal(parsePostFormat(undefined, "slug"), "noticia");
    assert.equal(parsePostFormat("", "slug"), "noticia");
  });

  it("accepts review, guia and comparativo", () => {
    assert.equal(parsePostFormat("review", "slug"), "review");
    assert.equal(parsePostFormat("guia", "slug"), "guia");
    assert.equal(parsePostFormat("comparativo", "slug"), "comparativo");
  });

  it("rejects an unknown format", () => {
    assert.throws(
      () => parsePostFormat("analise", "teclado"),
      /format deve ser noticia\|review\|guia\|comparativo/,
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

  it("treats review, guia and comparativo as evergreen", () => {
    for (const format of ["review", "guia", "comparativo"] as const) {
      assert.equal(isNewsFormat({ format }), false);
      assert.equal(isEvergreenFormat({ format }), true);
    }
  });
});
