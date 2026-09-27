import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GOOGLE_ADS_PUB_ID,
  GOOGLE_ADS_TXT_CERT,
  adsenseClientId,
  buildAdsTxt,
  normalizeAdsensePubId,
} from "./adsense.ts";
import { site } from "./site.ts";

describe("normalizeAdsensePubId", () => {
  it("accepts pub- and ca-pub- and lowercases", () => {
    assert.equal(
      normalizeAdsensePubId("ca-pub-1234567890123456"),
      "pub-1234567890123456",
    );
    assert.equal(
      normalizeAdsensePubId("PUB-1234567890123456"),
      "pub-1234567890123456",
    );
  });

  it("rejects empty, short, or invented-looking values", () => {
    assert.equal(normalizeAdsensePubId(""), null);
    assert.equal(normalizeAdsensePubId("   "), null);
    assert.equal(normalizeAdsensePubId(undefined), null);
    assert.equal(normalizeAdsensePubId("pub-123"), null);
    assert.equal(normalizeAdsensePubId("ca-pub-xxxxxxxxxxxxxxxx"), null);
    assert.equal(normalizeAdsensePubId("not-a-pub-id"), null);
  });
});

describe("adsenseClientId", () => {
  it("prefixes ca- for the AdSense script, not ads.txt", () => {
    assert.equal(adsenseClientId("pub-1234567890123456"), "ca-pub-1234567890123456");
  });
});

describe("buildAdsTxt", () => {
  it("lists only the Google seller and the editorial contact", () => {
    const body = buildAdsTxt();
    assert.equal(
      body,
      [
        `google.com, ${GOOGLE_ADS_PUB_ID}, DIRECT, ${GOOGLE_ADS_TXT_CERT}`,
        `CONTACT=mailto:${site.email}`,
        "",
      ].join("\n"),
    );
    assert.equal(GOOGLE_ADS_PUB_ID, "pub-3679376723096233");
    assert.equal(site.email, "hello@thezero.com.br");
    assert.doesNotMatch(body, /^#/m);
    assert.doesNotMatch(body, /OWNERDOMAIN/);
  });
});
