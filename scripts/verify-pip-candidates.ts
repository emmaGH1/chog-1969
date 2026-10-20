// Read-only, fixed shortlist. Never persists or prints holder addresses.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {parseAbi} from "viem";
import {rpc,GENESIS_CONTRACT,ERC721_READ} from "../src/lib/monad";
import {loadMetadata} from "../src/lib/nft-metadata";

async function main(){
 if(await rpc.getChainId()!==143)throw new Error("Wrong chain");
 const blockNumber=await rpc.getBlockNumber({cacheTime:0});
 const code=await rpc.getCode({address:GENESIS_CONTRACT,blockNumber});
 if(!code || code==="0x")throw new Error("No collection code");
 const collectionName=await rpc.readContract({address:GENESIS_CONTRACT,blockNumber,abi:parseAbi(["function name() view returns(string)"]),functionName:"name"});
 const fits:Record<number,string>={
  1969:"A smirking, bubblegum-chewing archive scout could give Pip a playful mask for moments of real danger.",
  969:"The tearful eyes and cream tuxedo could make Pip a tender-hearted keeper of memories who finds courage beside Neri.",
  42:"The plumber headwear and dark jacket could frame Pip as a practical escape-route tinkerer with an eye for hidden mechanisms.",
  1968:"The red palette, horns and burning aura could make Pip an intimidating-looking guardian whose loyalty surprises Neri.",
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
  const localArtwork=`/nft-candidates/token-${tokenId}.webp`;
  await writeFile(`public${localArtwork}`,bytes); // No conversion, crop or re-encoding.
  candidates.push({tokenId:String(tokenId),tokenURI,collectionName,existenceVerified:true,...result,localArtwork,imageSource,artworkSha256:createHash("sha256").update(bytes).digest("hex"),fictionalFit:fits[tokenId]});
 }
 const sheet={chainId:143,collection:GENESIS_CONTRACT,blockNumber:String(blockNumber),verifiedAt:new Date().toISOString(),approvalStatus:"Awaiting user selection; no candidate approved",candidates};
 await writeFile(`${directory}/provenance.json`,JSON.stringify(sheet,null,2)+"\n");
 console.log(`Verified ${candidates.length} candidates at Monad block ${blockNumber}. No owner addresses stored; no candidate chosen.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
