import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGaMeasurementId,
  normalizeGaMeasurementId,
} from "./analytics.ts";

describe("normalizeGaMeasurementId", () => {
  it("accepts a real GA4 G- id and uppercases", () => {
    assert.equal(normalizeGaMeasurementId("G-3H0Z0NNQ1J"), "G-3H0Z0NNQ1J");
    assert.equal(normalizeGaMeasurementId("  g-3h0z0nnq1j  "), "G-3H0Z0NNQ1J");
  });

  it("rejects empty, UA, GTM, or malformed values", () => {
    assert.equal(normalizeGaMeasurementId(""), null);
    assert.equal(normalizeGaMeasurementId("   "), null);
    assert.equal(normalizeGaMeasurementId(undefined), null);
    assert.equal(normalizeGaMeasurementId("UA-123456-1"), null);
    assert.equal(normalizeGaMeasurementId("GTM-ABCDEF"), null);
    assert.equal(normalizeGaMeasurementId("G-"), null);
    assert.equal(normalizeGaMeasurementId("not-a-ga-id"), null);
  });
});

describe("getGaMeasurementId", () => {
  it("reads the supplied raw value the same way as the env helper", () => {
    assert.equal(getGaMeasurementId("G-3H0Z0NNQ1J"), "G-3H0Z0NNQ1J");
    assert.equal(getGaMeasurementId(undefined), null);
    assert.equal(getGaMeasurementId(""), null);
  });
});
