import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONSENT_VERSION,
  parseStoredConsent,
  serializeConsent,
} from "./consent.ts";

describe("parseStoredConsent", () => {
  it("round-trips a v2 consent", () => {
    const raw = serializeConsent(true, false, new Date("2026-10-16T00:00:00Z"));
    const parsed = parseStoredConsent(raw);
    assert.equal(parsed?.version, CONSENT_VERSION);
    assert.equal(parsed?.advertising, true);
    assert.equal(parsed?.analytics, false);
  });

  it("migrates a v1 accept to advertising + analytics", () => {
    const legacy = JSON.stringify({
      version: 1,
      advertising: true,
      updatedAt: "2026-10-01T00:00:00.000Z",
    });
    const parsed = parseStoredConsent(legacy);
    assert.equal(parsed?.version, CONSENT_VERSION);
    assert.equal(parsed?.advertising, true);
    assert.equal(parsed?.analytics, true);
  });

  it("migrates a v1 decline to both off", () => {
    const legacy = JSON.stringify({
      version: 1,
      advertising: false,
      updatedAt: "2026-10-01T00:00:00.000Z",
    });
    const parsed = parseStoredConsent(legacy);
    assert.equal(parsed?.advertising, false);
    assert.equal(parsed?.analytics, false);
  });

  it("rejects malformed or unknown shapes", () => {
    assert.equal(parseStoredConsent(null), null);
    assert.equal(parseStoredConsent("not-json"), null);
    assert.equal(parseStoredConsent("{}"), null);
    assert.equal(
      parseStoredConsent(JSON.stringify({ version: 99, advertising: true, analytics: true, updatedAt: "x" })),
      null,
    );
  });
});
