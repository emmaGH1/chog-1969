import {test} from "node:test";
import assert from "node:assert/strict";
import {INITIAL_OPENING, parseOpening} from "../src/components/chapter/opening-progress";

test("opening save rejects malformed and future versions", () => {
  for (const raw of [null, "{", "null", '{"version":2,"opened":true}']) {
    assert.deepEqual(parseOpening(raw), INITIAL_OPENING);
  }
});
test("drawer cannot be restored open without both inspected clues and alignment", () => {
  assert.equal(parseOpening('{"version":1,"opened":true}').opened, false);
  assert.equal(parseOpening('{"version":1,"record":true,"shipment":true,"opened":true}').opened, false);
  assert.equal(parseOpening('{"version":1,"record":true,"shipment":true,"aligned":true,"opened":true}').opened, true);
});
