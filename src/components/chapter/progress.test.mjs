import assert from "node:assert/strict";
import {test} from "node:test";
import {advanceProgress, canAdvance, INITIAL_PROGRESS, parseProgress} from "./progress.ts";

test("corrupt, null and unsupported saves start safely", () => {
  for (const raw of [null, "{", "null", "[]", '"oops"', '{"version":2}', '{"index":1.2}']) {
    assert.deepEqual(parseProgress(raw), INITIAL_PROGRESS);
  }
});
test("legacy saves migrate; string booleans cannot skip the drawer", () => {
  assert.equal(parseProgress('{"index":5,"unlocked":"yes","route":"keep"}').index, 1);
  assert.equal(parseProgress('{"index":5,"unlocked":true}').index, 3);
  assert.deepEqual(parseProgress('{"index":5,"unlocked":true,"route":"burn"}'),
    {version: 1, index: 5, unlocked: true, route: "burn"});
});
test("integer indices are clamped and non-integers rejected", () => {
  for (const index of [-20, 99, 1.5, "2"]) {
    const p = parseProgress(JSON.stringify({index, unlocked: true, route: "keep"}));
    assert.ok(Number.isInteger(p.index) && p.index >= 0 && p.index <= 5);
  }
});
test("both escape routes play through all six scenes and stop at the ending", () => {
  for (const route of ["keep", "burn"]) {
    let p = advanceProgress({...INITIAL_PROGRESS});
    assert.equal(p.index, 1);
    assert.equal(canAdvance(p), false);
    assert.equal(advanceProgress(p), p);
    p = advanceProgress({...p, unlocked: true});
    p = advanceProgress(p);
    assert.equal(p.index, 3);
    assert.equal(canAdvance(p), false);
    p = advanceProgress({...p, route});
    p = advanceProgress(p);
    assert.equal(p.index, 5);
    assert.equal(canAdvance(p), false);
    assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  }
});
