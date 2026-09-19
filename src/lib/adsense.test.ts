import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
  it("never invents a google.com seller line", () => {
    const body = buildAdsTxt(null);
    assert.match(body, /^# ads\.txt for thezero\.com\.br/u);
    assert.match(body, /OWNERDOMAIN=thezero\.com\.br/u);
    assert.match(body, new RegExp(`CONTACT=mailto:${site.email}`));
    assert.doesNotMatch(body, /^google\.com,/mu);
    assert.doesNotMatch(body, /pub-\d{16}/u);
  });

  it("emits the IAB Google line only with a real pub id", () => {
    const body = buildAdsTxt("pub-1234567890123456");
    assert.match(
      body,
      new RegExp(
        `^google\\.com, pub-1234567890123456, DIRECT, ${GOOGLE_ADS_TXT_CERT}$`,
        "m",
      ),
    );
  });
});
