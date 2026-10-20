import assert from "node:assert/strict";
import test from "node:test";
import {getDossier, parseTokenId} from "../src/lib/nft-dossier";
import {GENESIS_CONTRACT,rpc} from "../src/lib/monad";
import {GET} from "../src/app/api/nft/[tokenId]/route";

test("uint256 IDs are canonicalized, never remapped to artwork numbers",()=>{
 assert.equal(parseTokenId("01969"),BigInt(1969));
 assert.equal(parseTokenId((BigInt(2)**BigInt(256)-BigInt(1)).toString()),BigInt(2)**BigInt(256)-BigInt(1));
 for(const value of ["-1","1.0","1e3","0x1","", " 1",(BigInt(2)**BigInt(256)).toString()]) assert.throws(()=>parseTokenId(value));
});
test("dossier pins ownership/URI/memory to one block and fails closed on wrong chain",async(t)=>{
 const old=process.env.MEMORY_LEDGER_ADDRESS;
 delete process.env.MEMORY_LEDGER_ADDRESS;
 try {
  t.mock.method(rpc,"getChainId",async()=>143);
  t.mock.method(rpc,"getBlockNumber",async()=>BigInt(123));
  t.mock.method(rpc,"readContract",async(args:{blockNumber:bigint;functionName:string;args:bigint[]})=>{
   assert.equal(args.blockNumber,BigInt(123));assert.equal(args.args[0],BigInt(1969));
   return args.functionName==="ownerOf"?"0xCF722e123205986Ed1967779119B269a87344b32":null;
  });
  const dossier=await getDossier(BigInt(1969));
  assert.equal(dossier.chainId,143);assert.equal(dossier.blockNumber,"123");assert.equal(dossier.memory.status,"not-configured");assert.equal(dossier.metadata,null);
  t.mock.method(rpc,"getChainId",async()=>1);
  await assert.rejects(getDossier(BigInt(1969)),/not Monad/);
 } finally {if(old===undefined)delete process.env.MEMORY_LEDGER_ADDRESS;else process.env.MEMORY_LEDGER_ADDRESS=old;t.mock.restoreAll();}
});
test("configured memory is read only for the expected Genesis collection",async(t)=>{
 const old=process.env.MEMORY_LEDGER_ADDRESS;
 process.env.MEMORY_LEDGER_ADDRESS="0x1111111111111111111111111111111111111111";
 let wrongCollection=false;let choice=1;
 try {
  t.mock.method(rpc,"getChainId",async()=>143);
  t.mock.method(rpc,"getBlockNumber",async()=>BigInt(123));
  t.mock.method(rpc,"readContract",async(args:{functionName:string;blockNumber:bigint})=>{
   assert.equal(args.blockNumber,BigInt(123));
   switch(args.functionName){
    case "ownerOf":return "0xCF722e123205986Ed1967779119B269a87344b32";
    case "tokenURI":throw new Error("unavailable");
    case "genesis":return wrongCollection?"0x2222222222222222222222222222222222222222":GENESIS_CONTRACT;
    case "memoryOf":return {choice,awakenedBy:"0x3333333333333333333333333333333333333333",at:BigInt(100)};
   }
  });
  assert.equal((await getDossier(BigInt(1969))).memory.choice,"Reveal");
  choice=2;assert.equal((await getDossier(BigInt(1969))).memory.choice,"Protect");
  choice=0;assert.equal((await getDossier(BigInt(1969))).memory.status,"unawakened");
  wrongCollection=true;assert.equal((await getDossier(BigInt(1969))).memory.status,"unavailable");
 } finally {if(old===undefined)delete process.env.MEMORY_LEDGER_ADDRESS;else process.env.MEMORY_LEDGER_ADDRESS=old;t.mock.restoreAll();}
});
test("API rejects malformed IDs and reports RPC failures without secrets",async(t)=>{
 const invalid=await GET(new Request("https://example.test"),{params:Promise.resolve({tokenId:"-1"})});
 assert.equal(invalid.status,400);
 t.mock.method(rpc,"getChainId",async()=>{throw new Error("secret RPC credentials");});
 try {
  const response=await GET(new Request("https://example.test"),{params:Promise.resolve({tokenId:"1969"})});
  assert.equal(response.status,502);assert.doesNotMatch(await response.text(),/credentials/);
 } finally {t.mock.restoreAll();}
});
