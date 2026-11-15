import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  aboutPageJsonLd,
  homeWebPageJsonLd,
  organizationJsonLd,
  publisherJsonLd,
  websiteJsonLd,
} from "./entity-jsonld.ts";
import { site } from "./site.ts";
import { ABOUT_DESCRIPTION, ABOUT_TITLE, HOME_TITLE } from "./titles.ts";

const HOME = "https://www.thezero.com.br/";

describe("home entity JSON-LD", () => {
  it("uses the served home URL on WebSite, Organization and the home WebPage", () => {
    const website = websiteJsonLd();
    const organization = organizationJsonLd();
    const home = homeWebPageJsonLd();

    assert.equal(website.url, HOME);
    assert.equal(website["@id"], `${HOME}#website`);
    assert.deepEqual(website.alternateName, ["TheZero", "thezero.com.br"]);
    assert.equal(website.name, "The Zero");

    assert.equal(organization.url, HOME);
    assert.equal(organization["@id"], `${HOME}#organization`);
    assert.deepEqual(organization.sameAs, [
      site.social.instagram,
      site.social.youtube,
      site.social.threads,
      site.social.x,
      site.social.pinterest,
    ]);
    assert.equal(publisherJsonLd.url, HOME);
    assert.equal(publisherJsonLd["@id"], organization["@id"]);

    assert.equal(home.url, HOME);
    assert.equal(home["@id"], `${HOME}#webpage`);
    assert.equal(home.name, HOME_TITLE);
    assert.equal(home.description, site.description);
  });

  it("keeps /sobre on its own URL and on the page-purpose title", () => {
    const about = aboutPageJsonLd(ABOUT_DESCRIPTION);
    assert.equal(about.url, "https://www.thezero.com.br/sobre");
    assert.equal(about["@id"], "https://www.thezero.com.br/sobre#webpage");
    assert.equal(about.name, ABOUT_TITLE);
    assert.equal(about.description, ABOUT_DESCRIPTION);
    assert.notEqual(about.description, site.description);
    assert.notEqual(about.name, HOME_TITLE);
  });
});

describe("brand anchors", () => {
  it("points the header logo at / with the accessible name The Zero", () => {
    const header = readFileSync(
      new URL("../components/layout/site-header.tsx", import.meta.url),
      "utf8",
    );
    assert.match(header, /href="\/"[\s\S]{0,180}aria-label="The Zero"/u);
    assert.equal(header.includes('aria-label="The Zero — newsroom"'), false);
    assert.match(header, /href="\/sobre"[\s\S]{0,160}>\s*Sobre\s*</u);
  });

  it("keeps the footer Sobre label and links The Zero in the about lead", () => {
    const footer = readFileSync(
      new URL("../components/layout/site-footer.tsx", import.meta.url),
      "utf8",
    );
    assert.match(footer, /href="\/"[\s\S]{0,120}aria-label="The Zero"/u);
    assert.match(footer, /href="\/sobre"[\s\S]{0,80}>\s*Sobre\s*</u);

    const about = readFileSync(new URL("../app/sobre/page.tsx", import.meta.url), "utf8");
    assert.match(about, /<Link href="\/"[^>]*>The Zero<\/Link>/u);

    const sitemap = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
    assert.match(sitemap, /url:\s*absoluteUrl\("\/"\)/u);
    assert.equal(sitemap.includes("url: site.url,"), false);

    const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
    assert.match(home, /<link rel="canonical" href=\{absoluteUrl\("\/"\)\} \/>/u);
    assert.match(home, /<meta property="og:url" content=\{absoluteUrl\("\/"\)\} \/>/u);
    assert.match(home, /\{HOME_H1\}/u);
  });
});
