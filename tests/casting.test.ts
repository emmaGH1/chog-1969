import assert from "node:assert/strict";
import test from "node:test";
import {candidates,groups,filterCandidates} from "../src/app/archive/pip-candidates/casting";

test("one gallery contains twelve unique originals in four fictional groups",()=>{
 assert.equal(candidates.length,12);
 assert.equal(new Set(candidates.map(candidate=>candidate.tokenId)).size,12);
 assert.deepEqual(groups.map(group=>filterCandidates("",group.name).length),[4,4,2,2]);
});
test("search distinguishes onchain IDs from metadata names and finds actual traits",()=>{
 assert.deepEqual(filterCandidates("1969").map(c=>c.tokenId),["1969"]);
 assert.deepEqual(filterCandidates("CHOG #1461").map(c=>c.tokenId),["1969"]);
 assert.deepEqual(filterCandidates("  BuBbLeGuM  ").map(c=>c.tokenId),["1969","1848"]);
 assert.deepEqual(filterCandidates("wizard gold").map(c=>c.tokenId),["846"]);
});
test("filters combine with search without changing underlying verified data",()=>{
 const before=JSON.stringify(candidates);
 assert.deepEqual(filterCandidates("bubblegum","Mystery / secret-keeper").map(c=>c.tokenId),["1848"]);
 assert.equal(filterCandidates("bubblegum","Dry comic relief").length,0);
 assert.equal(filterCandidates("no-such-chog").length,0);
 assert.equal(filterCandidates("   ").length,12);
 assert.equal(JSON.stringify(candidates),before);
});
