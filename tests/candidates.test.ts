import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import test from "node:test";
import sheet from "../public/nft-candidates/provenance.json";
import {GENESIS_CONTRACT} from "../src/lib/monad";
import {normalizeMetadata} from "../src/lib/nft-metadata";

test("Pip round-two sheet accounts for all 12 IDs with traceable originals, no holders and no approved choice",()=>{
 assert.equal(sheet.chainId,143);assert.equal(sheet.collection,GENESIS_CONTRACT);
 const requested=["1969","969","42","1968","1552","1053","1428","846","1848","467","512","1620"];
 assert.deepEqual(sheet.requestedTokenIds,requested);
 const failures=sheet.verificationFailures as {tokenId:string;stage:string;reason:string}[];
 const accounted=[...sheet.candidates.map(c=>c.tokenId),...failures.map(f=>f.tokenId)];
 assert.deepEqual(accounted.slice().sort(),requested.slice().sort());
 assert.equal(new Set(accounted).size,12);
 assert.equal(new Set(sheet.candidates.map(c=>c.artworkSha256)).size,sheet.candidates.length);
 for(const failed of failures){assert.ok(failed.stage);assert.match(failed.reason,/excluded/);}
 assert.equal(sheet.candidates.length,12); // Current snapshot: all requested IDs succeeded.
 assert.match(sheet.approvalStatus,/Awaiting/);
 assert.match(sheet.blockHash,/^0x[0-9a-f]{64}$/);
 assert.ok(BigInt(sheet.blockTimestamp)>BigInt(0));
 assert.equal(sheet.candidates.find(c=>c.tokenId==="1969")?.metadata.name,"CHOG #1461");
 for(const candidate of sheet.candidates){
  assert.ok(candidate.existenceVerified);assert.match(candidate.tokenURI,/^ipfs:\/\//);
  assert.ok(candidate.metadata.attributes.length>=10);assert.ok(candidate.fictionalFit);
  assert.ok(candidate.fictionalFit.length>50);
  assert.ok(["Playful adventure companion","Mystery / secret-keeper","Dry comic relief","Dangerous-looking ally"].includes(candidate.archetype));
  const raw=readFileSync(`public${candidate.localMetadata}`);
  assert.equal(createHash("sha256").update(raw).digest("hex"),candidate.metadataSha256);
  assert.deepEqual(normalizeMetadata(JSON.parse(raw.toString("utf8"))),candidate.metadata);
  assert.equal(candidate.artworkMime,"image/webp");
  assert.equal(candidate.artworkWidth,1000);assert.equal(candidate.artworkHeight,1000);
  const art=readFileSync(`public${candidate.localArtwork}`);
  assert.equal(art.subarray(8,12).toString(),"WEBP");
  assert.equal(createHash("sha256").update(art).digest("hex"),candidate.artworkSha256);
 }
 const publicJson=JSON.stringify(sheet);
 assert.equal((publicJson.match(/0x[a-fA-F0-9]{40}(?![a-fA-F0-9])/g)??[]).length,1); // Collection only; no holder addresses.
});
