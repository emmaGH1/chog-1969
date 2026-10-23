import assert from "node:assert/strict";
import {test} from "node:test";
import {consequence} from "../src/components/chapter/consequences";
import {parseProgress} from "../src/components/chapter/progress";

test("legacy route saves retain distinct evidence and pursuit outcomes",()=>{
  const keep=consequence(parseProgress('{"index":5,"unlocked":true,"route":"keep"}').route)!;
  const burn=consequence(parseProgress('{"index":5,"unlocked":true,"route":"burn"}').route)!;
  assert.match(keep.memory,/platform 19\. tide 69/);
  assert.match(keep.aftermath,/Neri and Pip are circled/);
  assert.match(burn.memory,/LOST WITH THE RECORD/);
  assert.doesNotMatch(burn.memory,/platform 19/);
  assert.match(burn.notice,/UNIDENTIFIED/);
  assert.doesNotMatch(burn.aftermath,/circled/);
  assert.notEqual(keep.inscription,burn.inscription);
  assert.equal(consequence(null),null);
});
