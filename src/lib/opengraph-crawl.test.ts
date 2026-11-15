import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LINK_PREVIEW_USER_AGENTS,
  OPENGRAPH_HEADER_PATHS,
  OPENGRAPH_ROBOTS_DISALLOW,
  OPENGRAPH_ROBOTS_TAG,
  cloudflareOpenGraphHeaderBlock,
  openGraphRobotsRules,
} from "./opengraph-crawl.ts";

/** Google's robots.txt path match: `*` is any run of characters, `$` anchors the end, otherwise the rule is a prefix. */
function robotsRuleMatches(pattern: string, path: string): boolean {
  let expression = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index] ?? "";
    if (character === "*") {
      expression += ".*";
      continue;
    }
    if (character === "$" && index === pattern.length - 1) {
      expression += "$";
      continue;
    }
    expression += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(expression).test(path);
}

function starGroupAllows(path: string): boolean {
  const rule = openGraphRobotsRules().find((item) => item.userAgent === "*");
  assert.ok(rule);
  const matched = [
    { allow: true, length: rule.allow.length, pattern: rule.allow },
    ...(rule.disallow ?? [])
      .filter((pattern) => robotsRuleMatches(pattern, path))
      .map((pattern) => ({ allow: false, length: pattern.length, pattern })),
  ].filter((item) => item.allow || robotsRuleMatches(item.pattern, path));
  matched.sort((a, b) => b.length - a.length || Number(b.allow) - Number(a.allow));
  return matched[0]?.allow ?? true;
}

const OPENGRAPH_ROUTES = [
  "/opengraph-image",
  "/ia/opengraph-image",
  "/computadores/opengraph-image",
  "/noticia/kabum-ninja-whatsapp-ia-commerce/opengraph-image",
  "/reviews/celulares/opengraph-image",
  "/dispositivos/celulares/opengraph-image",
  "/jogos/consoles/opengraph-image",
];

describe("opengraph robots rules", () => {
  it("disallows the card routes for crawlers and leaves the article alone", () => {
    for (const path of OPENGRAPH_ROUTES) {
      assert.equal(starGroupAllows(path), false, path);
    }
    assert.equal(starGroupAllows("/"), true);
    assert.equal(starGroupAllows("/noticia/kabum-ninja-whatsapp-ia-commerce"), true);
    assert.equal(starGroupAllows("/sitemap.xml"), true);
    assert.equal(starGroupAllows("/news-sitemap.xml"), true);
    assert.equal(starGroupAllows("/busca"), true);
  });

  it("keeps link-preview and ads crawlers on an allow-only group", () => {
    const rules = openGraphRobotsRules();
    const preview = rules.find(
      (rule) =>
        Array.isArray(rule.userAgent) &&
        rule.userAgent.includes("WhatsApp") &&
        rule.userAgent.includes("facebookexternalhit"),
    );
    assert.ok(preview);
    assert.equal(preview.allow, "/");
    assert.equal(preview.disallow, undefined);
    assert.deepEqual([...preview.userAgent], [...LINK_PREVIEW_USER_AGENTS]);

    for (const userAgent of ["Mediapartners-Google", "Google-Display-Ads-Bot"]) {
      const rule = rules.find((item) => item.userAgent === userAgent);
      assert.ok(rule);
      assert.equal(rule.disallow, undefined);
    }
  });

  it("uses the two Disallow paths Google can match across segments", () => {
    assert.deepEqual(OPENGRAPH_ROBOTS_DISALLOW, [
      "/opengraph-image",
      "/*/opengraph-image",
    ]);
  });
});

describe("opengraph response headers", () => {
  it("sets noindex on each depth without a second splat", () => {
    const block = cloudflareOpenGraphHeaderBlock();
    assert.equal(OPENGRAPH_HEADER_PATHS.length, 3);
    for (const path of OPENGRAPH_HEADER_PATHS) {
      assert.equal((path.match(/\*/g) ?? []).length, 0, path);
      assert.match(
        block,
        new RegExp(
          `${path}\n  Content-Type: image/png\n  X-Robots-Tag: ${OPENGRAPH_ROBOTS_TAG}`.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          ),
        ),
      );
    }
    assert.equal(block.includes("/*"), false);
  });

  it("covers every generated card path exactly once", () => {
    function matches(pattern: string, path: string): boolean {
      const expression = `^${pattern.replace(/:[A-Za-z]\w*/g, "[^/]+")}$`;
      return new RegExp(expression).test(path);
    }
    for (const path of OPENGRAPH_ROUTES) {
      const hits = OPENGRAPH_HEADER_PATHS.filter((pattern) => matches(pattern, path));
      assert.deepEqual(hits.length, 1, `${path} -> ${hits.join(", ")}`);
    }
    assert.equal(
      OPENGRAPH_HEADER_PATHS.some((pattern) =>
        matches(pattern, "/noticia/kabum-ninja-whatsapp-ia-commerce"),
      ),
      false,
    );
  });
});
