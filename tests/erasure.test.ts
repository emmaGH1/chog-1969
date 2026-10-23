import assert from "node:assert/strict";
import {test} from "node:test";
import {testimony,erasureStage,isWordErased} from "../src/components/chapter/erasure";

test("testimony is readable initially, then loses whole key words at eight-second intervals",()=>{
  assert.equal(erasureStage(40,true),0);
  assert.equal(erasureStage(32.01,true),0);
  assert.equal(erasureStage(32,true),1);
  assert.equal(erasureStage(24,true),2);
  assert.equal(erasureStage(0,true),4);
  assert.deepEqual(testimony.flat().filter(w=>isWordErased(w,2,null)),["CAUSE.","BROTHER"]);
  assert.equal(erasureStage(0,false),0);
});

test("Keep restores all words and Burn conceals them without changing source testimony",()=>{
  assert.ok(testimony.flat().every(w=>!isWordErased(w,4,"keep")));
  assert.ok(testimony.flat().every(w=>isWordErased(w,0,"burn")));
  assert.equal(testimony.flat().join(" "),"WE WERE NOT THE CAUSE. WE WERE TRYING TO CLOSE THE DOOR. HER BROTHER WAS THERE.");
});
