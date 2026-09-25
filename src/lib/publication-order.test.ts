import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  comparePublicationRecency,
  selectMostRecentPublication,
  type PublicationOrderItem,
} from "./publication-order.ts";

function post(
  slug: string,
  date: string,
  dateIso = date.includes("T") ? date : `${date}T08:00:00-03:00`,
): PublicationOrderItem {
  return { slug, date, dateIso };
}

describe("selectMostRecentPublication", () => {
  it("picks the later calendar day over an earlier day with a later clock", () => {
    const older = post("noite", "2026-09-24T23:59:00-03:00");
    const newer = post("manha", "2026-09-25T00:10:00-03:00");
    assert.equal(selectMostRecentPublication([older, newer])?.slug, "manha");
    assert.equal(selectMostRecentPublication([newer, older])?.slug, "manha");
  });

  it("breaks a same-day tie with the later explicit timestamp", () => {
    const morning = post("copilot", "2026-09-25T09:00:00-03:00");
    const afternoon = post("anthropic", "2026-09-25T14:00:00-03:00");
    assert.equal(
      selectMostRecentPublication([morning, afternoon])?.slug,
      "anthropic",
    );
  });

  it("does not let a synthetic 08:00 outrank a real morning timestamp", () => {
    const dated = post("so-data", "2026-09-25");
    const early = post("com-hora", "2026-09-25T07:30:00-03:00");
    assert.equal(selectMostRecentPublication([dated, early])?.slug, "com-hora");
  });

  it("ranks any explicit timestamp ahead of a date-only post on the same day", () => {
    const dated = post("ea", "2026-09-25");
    const afternoon = post("anthropic", "2026-09-25T14:00:00-03:00");
    assert.equal(
      selectMostRecentPublication([dated, afternoon])?.slug,
      "anthropic",
    );
  });

  it("uses slug order when the same day has no clock", () => {
    const laterName = post("zeta", "2026-09-18");
    const earlierName = post("alpha", "2026-09-18");
    const picked = selectMostRecentPublication([laterName, earlierName]);
    assert.equal(picked?.slug, "alpha");
  });

  it("uses slug order when timestamps are equal", () => {
    const a = post("beta", "2026-09-25T14:00:00-03:00");
    const b = post("alpha", "2026-09-25T14:00:00-03:00");
    assert.equal(selectMostRecentPublication([a, b])?.slug, "alpha");
  });

  it("does not follow input order", () => {
    const posts = [
      post("zeta", "2026-09-18"),
      post("alpha", "2026-09-18"),
      post("mu", "2026-09-18"),
    ];
    const forward = [...posts].sort(comparePublicationRecency).map((item) => item.slug);
    const backward = [...posts]
      .reverse()
      .sort(comparePublicationRecency)
      .map((item) => item.slug);
    assert.deepEqual(forward, ["alpha", "mu", "zeta"]);
    assert.deepEqual(backward, forward);
  });

  it("returns undefined for an empty list", () => {
    assert.equal(selectMostRecentPublication([]), undefined);
  });
});
