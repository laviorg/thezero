import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { injectInArticleAdAfterNthParagraph } from "./article-ads.ts";

const paragraphs = (n: number) =>
  Array.from({ length: n }, (_, i) => `Parágrafo ${i + 1} de prosa corrida.`).join(
    "\n\n",
  );

describe("injectInArticleAdAfterNthParagraph", () => {
  it("inserts the ad after the requested prose paragraph", () => {
    const out = injectInArticleAdAfterNthParagraph(paragraphs(6), 3);
    const blocks = out.split("\n\n");
    assert.equal(blocks[3], "<AdInArticle />");
    assert.ok(blocks[2].startsWith("Parágrafo 3"));
    assert.ok(blocks[4].startsWith("Parágrafo 4"));
  });

  it("ignores headings, lists, images and JSX when counting", () => {
    const source = [
      "## Título",
      "- item de lista",
      "![alt](/images/x.png)",
      "<Fontes>links</Fontes>",
      paragraphs(2),
    ].join("\n\n");
    const out = injectInArticleAdAfterNthParagraph(source, 2);
    const blocks = out.split("\n\n");
    assert.equal(blocks[6], "<AdInArticle />");
  });

  it("does not count fenced code blocks", () => {
    const source = ["```js\nconst a = 1;\n```", paragraphs(3)].join("\n\n");
    const out = injectInArticleAdAfterNthParagraph(source, 2);
    assert.equal(out.split("\n\n")[3], "<AdInArticle />");
  });

  it("returns the source unchanged when there are not enough paragraphs", () => {
    const source = paragraphs(2);
    assert.equal(injectInArticleAdAfterNthParagraph(source, 3), source);
  });
});
