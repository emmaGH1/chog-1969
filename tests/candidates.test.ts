import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import test from "node:test";
import sheet from "../public/nft-candidates/provenance.json";
import {GENESIS_CONTRACT} from "../src/lib/monad";

test("Pip shortlist has four traceable original files, no holder addresses and no approved choice",()=>{
 assert.equal(sheet.chainId,143);assert.equal(sheet.collection,GENESIS_CONTRACT);
 assert.deepEqual(sheet.candidates.map(c=>c.tokenId),["1969","969","42","1968"]);
 assert.match(sheet.approvalStatus,/Awaiting/);
 assert.equal(sheet.candidates.find(c=>c.tokenId==="1969")?.metadata.name,"CHOG #1461");
 for(const candidate of sheet.candidates){
  assert.ok(candidate.existenceVerified);assert.match(candidate.tokenURI,/^ipfs:\/\//);
  assert.ok(candidate.metadata.attributes.length>=10);assert.ok(candidate.fictionalFit);
  const art=readFileSync(`public${candidate.localArtwork}`);
  assert.equal(art.subarray(8,12).toString(),"WEBP");
  assert.equal(createHash("sha256").update(art).digest("hex"),candidate.artworkSha256);
 }
 const publicJson=JSON.stringify(sheet);
 assert.equal((publicJson.match(/0x[a-fA-F0-9]{40}/g)??[]).length,1); // Collection only; no holder addresses.
});
