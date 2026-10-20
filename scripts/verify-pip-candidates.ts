// Read-only, fixed shortlist. Never persists or prints holder addresses.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {parseAbi} from "viem";
import {rpc,GENESIS_CONTRACT,ERC721_READ} from "../src/lib/monad";
import {loadMetadata,normalizeMetadata} from "../src/lib/nft-metadata";

async function main(){
 if(await rpc.getChainId()!==143)throw new Error("Wrong chain");
 const blockNumber=await rpc.getBlockNumber({cacheTime:0});
 const block=await rpc.getBlock({blockNumber});
 if(!block.hash)throw new Error("Missing verification block hash");
 const code=await rpc.getCode({address:GENESIS_CONTRACT,blockNumber});
 if(!code || code==="0x")throw new Error("No collection code");
 const collectionName=await rpc.readContract({address:GENESIS_CONTRACT,blockNumber,abi:parseAbi(["function name() view returns(string)"]),functionName:"name"});
 const fits:Record<number,string>={
  1969:"The Smirk, Bubblegum and Coin traits suggest a cheeky Pip who pockets an archive clue, blows a bubble, and pretends nothing happened.",
  969:"The Round Tear eyes, normal smile and Cream Tuxedo could give a mischievous Pip an innocent-looking disguise for elaborate pranks and mock-apologetic escapes.",
  42:"The Plumber headwear, BTC Coin and dark jacket could make Pip a sly gadget-tinkerer who rigs a harmless distraction before slipping through a secret exit.",
  1968:"The Demon Horn, Burning Aura and Red Round Eye traits could suit a mischievous Pip who stages theatrical jump scares, then turns the fright into a joke.",
 };
 const directory="public/nft-candidates";
 await mkdir(directory,{recursive:true});
 const candidates=[];
 for(const tokenId of [1969,969,42,1968]){
  const contractArgs={address:GENESIS_CONTRACT,abi:ERC721_READ,args:[BigInt(tokenId)] as const,blockNumber};
  await rpc.readContract({...contractArgs,functionName:"ownerOf"}); // Existence only. Discard address.
  const tokenURI=await rpc.readContract({...contractArgs,functionName:"tokenURI"});
  const result=await loadMetadata(tokenURI);
  if(!result.metadata || !result.metadataSource || !result.metadata.imageUrls.length)throw new Error(`Metadata missing: ${tokenId}`);
  const rawResponse=await fetch(result.metadataSource,{redirect:"error",signal:AbortSignal.timeout(10000)});
  if(!rawResponse.ok)throw new Error(`Raw metadata unavailable: ${tokenId}`);
  const rawMetadata=Buffer.from(await rawResponse.arrayBuffer());
  if(rawMetadata.length>256*1024)throw new Error("Metadata too large");
  if(JSON.stringify(normalizeMetadata(JSON.parse(rawMetadata.toString("utf8"))))!==JSON.stringify(result.metadata))throw new Error("Metadata changed during verification");
  const localMetadata=`/nft-candidates/token-${tokenId}.json`;
  await writeFile(`public${localMetadata}`,rawMetadata);
  let bytes:Buffer|undefined;let imageSource="";
  for(const url of result.metadata.imageUrls){
   try {
    const response=await fetch(url,{redirect:"error",signal:AbortSignal.timeout(15000)});
    if(!response.ok || !response.headers.get("content-type")?.includes("image/webp"))throw new Error("Not original WebP");
    bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length>10*1024*1024 || bytes.subarray(8,12).toString()!=="WEBP")throw new Error("Invalid artwork");
    imageSource=url;break;
   } catch {bytes=undefined;}
  }
  if(!bytes)throw new Error(`Artwork unavailable: ${tokenId}`);
  // These original files use a simple VP8 WebP frame; fail rather than invent dimensions.
  if(bytes.subarray(12,16).toString()!=="VP8 " || bytes.subarray(23,26).toString("hex")!=="9d012a")throw new Error("Unsupported WebP header");
  const artworkWidth=bytes.readUInt16LE(26)&0x3fff;
  const artworkHeight=bytes.readUInt16LE(28)&0x3fff;
  const localArtwork=`/nft-candidates/token-${tokenId}.webp`;
  await writeFile(`public${localArtwork}`,bytes); // No conversion, crop or re-encoding.
  candidates.push({tokenId:String(tokenId),tokenURI,collectionName,existenceVerified:true,...result,localMetadata,metadataSha256:createHash("sha256").update(rawMetadata).digest("hex"),localArtwork,imageSource,artworkMime:"image/webp",artworkWidth,artworkHeight,artworkSha256:createHash("sha256").update(bytes).digest("hex"),fictionalFit:fits[tokenId]});
 }
 const sheet={chainId:143,collection:GENESIS_CONTRACT,blockNumber:String(blockNumber),blockHash:block.hash,blockTimestamp:block.timestamp.toString(),verifiedAt:new Date().toISOString(),approvalStatus:"Awaiting user selection; no candidate approved",candidates};
 await writeFile(`${directory}/provenance.json`,JSON.stringify(sheet,null,2)+"\n");
 console.log(`Verified ${candidates.length} candidates at Monad block ${blockNumber}. No owner addresses stored; no candidate chosen.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
