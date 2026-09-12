import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSmsLinkShorteningEnabled } from "./short-links";

describe("isSmsLinkShorteningEnabled", () => {
  it("is off when unset, false, or 0", () => {
    assert.equal(isSmsLinkShorteningEnabled(undefined), false);
    assert.equal(isSmsLinkShorteningEnabled(""), false);
    assert.equal(isSmsLinkShorteningEnabled("false"), false);
    assert.equal(isSmsLinkShorteningEnabled("0"), false);
  });

  it("is on for true and 1", () => {
    assert.equal(isSmsLinkShorteningEnabled("true"), true);
    assert.equal(isSmsLinkShorteningEnabled("1"), true);
  });
});
