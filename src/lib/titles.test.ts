import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABOUT_TITLE,
  CONTACT_TITLE,
  HOME_TITLE,
  PRIVACY_TITLE,
  TERMS_TITLE,
  TITLE_HARD_MAX,
  TITLE_SOFT_MAX,
  articlePageTitle,
  composePageTitle,
  contactPageTitle,
  fitTitle,
  homePageTitle,
  privacyPageTitle,
  searchPageTitle,
  termsPageTitle,
  titleLength,
} from "./titles.ts";

describe("composePageTitle", () => {
  it("appends brand on short hub cores", () => {
    assert.equal(composePageTitle("Ferramentas de IA", "always"), "Ferramentas de IA · The Zero");
  });

  it("does not double the brand", () => {
    assert.equal(homePageTitle(), HOME_TITLE);
    assert.equal(composePageTitle(ABOUT_TITLE, "always"), ABOUT_TITLE);
  });

  it("omits brand on long article cores so the claim survives", () => {
    const core =
      "Cursor não é IA que escreve código. É autocomplete que entende o repo";
    const composed = composePageTitle(core, "auto");
    assert.equal(composed.includes("The Zero"), false);
    assert.ok(titleLength(composed) <= TITLE_HARD_MAX);
  });

  it("keeps brand when the composed title still fits the soft max", () => {
    const composed = composePageTitle("AMD encarece GPU de IA em 10%. Ryzen escapou", "auto");
    assert.equal(composed, "AMD encarece GPU de IA em 10%. Ryzen escapou · The Zero");
    assert.ok(titleLength(composed) <= TITLE_SOFT_MAX);
  });
});

describe("fitTitle", () => {
  it("cuts on a word boundary, not mid-token", () => {
    const fitted = fitTitle(
      "The Walking Dead: Streets of Survival troca drama arrastado por porrada pixelada de R$ 67",
      70,
    );
    assert.ok(titleLength(fitted) <= 70);
    assert.equal(/\s$/u.test(fitted), false);
    assert.doesNotMatch(fitted, /porrad$/u);
    assert.match(fitted, /Survival|Walking Dead|R\$ 67/u);
  });

  it("prefers the first sentence when it already names the entity", () => {
    assert.equal(
      fitTitle(
        "O KaBuM enfiou um vendedor de IA no WhatsApp. Sem menu numérico, sem cerimônia",
        70,
      ),
      "O KaBuM enfiou um vendedor de IA no WhatsApp",
    );
  });
});

describe("articlePageTitle", () => {
  it("uses seoTitle when present", () => {
    assert.equal(
      articlePageTitle({
        title: "Manchete editorial longa demais para caber na SERP com a marca no fim",
        seoTitle: "KaBuM enfiou um vendedor de IA no WhatsApp",
      }),
      "KaBuM enfiou um vendedor de IA no WhatsApp · The Zero",
    );
  });
});

describe("legal page titles", () => {
  it("keeps brand inside the core and stays under the hard max", () => {
    assert.equal(privacyPageTitle(), PRIVACY_TITLE);
    assert.equal(contactPageTitle(), CONTACT_TITLE);
    assert.equal(termsPageTitle(), TERMS_TITLE);
    assert.ok(titleLength(PRIVACY_TITLE) <= TITLE_HARD_MAX);
    assert.ok(titleLength(CONTACT_TITLE) <= TITLE_HARD_MAX);
    assert.ok(titleLength(TERMS_TITLE) <= TITLE_HARD_MAX);
    assert.equal(new Set([HOME_TITLE, ABOUT_TITLE, PRIVACY_TITLE, CONTACT_TITLE, TERMS_TITLE]).size, 5);
  });
});

describe("searchPageTitle", () => {
  it("keeps the empty hub stable and caps a long query", () => {
    assert.equal(searchPageTitle(), "Busca no newsroom · The Zero");
    const long = searchPageTitle("a".repeat(120));
    assert.ok(titleLength(long) <= TITLE_HARD_MAX);
    assert.match(long, /^Busca: /u);
    assert.match(long, /The Zero$/u);
  });
});
