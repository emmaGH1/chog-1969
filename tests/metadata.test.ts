import assert from "node:assert/strict";
import test from "node:test";
import { imageUrls, ipfsPath, loadMetadata, normalizeMetadata } from "../src/lib/nft-metadata";
const cid="bafybeid4ybujnscdipkno7ps5utqelp5ry5ryreqhay3zhgk3a6x4jruqu";
const uri=`ipfs://${cid}/1461.json`;

test("IPFS URI validation rejects traversal, escapes, arbitrary hosts and queries",()=>{
 assert.equal(ipfsPath(uri),`${cid}/1461.json`);
 assert.equal(ipfsPath(`ipfs://ipfs/${cid}/1461.json`),`${cid}/1461.json`);
 for(const value of [`ipfs://${cid}/../secret`,`ipfs://${cid}/%2e%2e/secret`,`ipfs://${cid}/x?q=1`,"http://127.0.0.1/","https://evil.test/","data:application/json,{}"]){assert.equal(ipfsPath(value),null);}
});
test("metadata is bounded plain text, not executable HTML",()=>{
 const metadata=normalizeMetadata({name:"<script>alert(1)</script>",description:"x".repeat(5000),image:"javascript:alert(1)",attributes:[{trait_type:"Tier",value:"Rare"},{trait_type:"Rank",value:3},{trait_type:"Bad",value:{}},null]});
 assert.equal(metadata.name,"<script>alert(1)</script>"); // React renders text, never innerHTML.
 assert.equal(metadata.description?.length,4000);
 assert.deepEqual(metadata.imageUrls,[]);
 assert.deepEqual(metadata.attributes,[{trait_type:"Tier",value:"Rare"},{trait_type:"Rank",value:"3"}]);
 assert.throws(()=>normalizeMetadata([]));
 for(const value of ["http://example.com/a.png","https://127.0.0.1/a.png","https://user:pass@example.com/a.png","https://example.com/a.svg","data:image/svg+xml,test","file:///tmp/a.png"]){assert.deepEqual(imageUrls(value),[]);}
 assert.equal(imageUrls(`ipfs://${cid}/a.webp`).length,2);
});
test("metadata fallback uses fixed gateways and disallows redirects",async()=>{
 const calls:string[]=[];
 const fetcher:typeof fetch=async(input,init)=>{
  calls.push(String(input)); assert.equal(init?.redirect,"error");assert.ok(init?.signal);
  return calls.length===1?new Response("rate limited",{status:429}):Response.json({name:"CHOG #1461",image:`ipfs://${cid}/1461.webp`});
 };
 const result=await loadMetadata(uri,fetcher);
 assert.equal(calls.length,2);assert.equal(result.metadata?.name,"CHOG #1461");
 assert.equal(result.metadataSource,`https://ipfs.filebase.io/ipfs/${cid}/1461.json`);
});
test("unsupported metadata never triggers server-side fetch",async()=>{
 const result=await loadMetadata("https://127.0.0.1/secrets",async()=>{throw new Error("must not fetch");});
 assert.equal(result.metadata,null);assert.match(result.metadataWarning!,/unsupported/);
});
test("invalid, redirected, oversized or unreachable metadata degrades safely",async()=>{
 for(const fetcher of [
  async()=>new Response("<html>not JSON</html>"),
  async()=>new Response("{}",{headers:{"content-length":"999999"}}),
  async()=>new Response(" ".repeat(262145)),
  async()=>{throw new Error("redirect or timeout");},
 ]){
  const result=await loadMetadata(uri,fetcher);
  assert.equal(result.metadata,null);assert.match(result.metadataWarning!,/unavailable/);
 }
});
