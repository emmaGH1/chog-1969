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
  1552:"The XD eyes, Smile and Heart accessory could make Pip an exuberant prankster whose Army Vest cannot hide a soft spot for Neri.",
  1053:"The Happy eyes, Smile and Stripes could suit a cheerful Pip who turns every forbidden passage into a mischievous adventure.",
  1428:"The Tired eyes and Clown Nose could make Pip a deadpan trickster who insists the latest absurd distraction was entirely intentional.",
  846:"The Wizard Hat, Gold Tooth and Dead eyes could frame Pip as a sly old secret-keeper who punctures ominous warnings with terrible jokes.",
  1848:"The Crown, Bubblegum and Squid Game Guard outfit could suit a secretive Pip who mischievously impersonates authority to sneak Neri past a checkpoint.",
  467:"The Green laser eyes, Drooling and Orange Bucket Cap could make Pip a chaotic-looking ally whose ridiculous diversions hide surprisingly useful clues.",
  512:"The Chog Viper eyes, Choggie Beanie and Mon coin could suit a sly archive thief whose coin obsession turns clue-hunting into mischief.",
  1620:"The Dead eyes, Gray Bucket Cap and Black Trackset could suit a dryly comic Pip who delivers one unimpressed remark while quietly orchestrating a prank.",
 };
 const archetypes:Record<number,string>={1969:"Playful adventure companion",969:"Playful adventure companion",42:"Mystery / secret-keeper",1968:"Dangerous-looking ally",1552:"Playful adventure companion",1053:"Playful adventure companion",1428:"Dry comic relief",846:"Mystery / secret-keeper",1848:"Mystery / secret-keeper",467:"Dangerous-looking ally",512:"Mystery / secret-keeper",1620:"Dry comic relief"};
 const requestedTokenIds=[1969,969,42,1968,1552,1053,1428,846,1848,467,512,1620];
 const directory="public/nft-candidates";
 await mkdir(directory,{recursive:true});
 const candidates=[];
 const verificationFailures:{tokenId:string;stage:string;reason:string}[]=[];
 const seenArtwork=new Set<string>();
 for(const tokenId of new Set(requestedTokenIds)){
  let stage="NFT existence / ownerOf";
  try {
  const contractArgs={address:GENESIS_CONTRACT,abi:ERC721_READ,args:[BigInt(tokenId)] as const,blockNumber};
  await rpc.readContract({...contractArgs,functionName:"ownerOf"}); // Existence only. Discard address.
  stage="onchain tokenURI";
  const tokenURI=await rpc.readContract({...contractArgs,functionName:"tokenURI"});
  stage="metadata gateway retrieval / validation";
  let result=await loadMetadata(tokenURI);
  if(!result.metadata)result=await loadMetadata(tokenURI); // One bounded retry after both fixed gateways.
  if(!result.metadata || !result.metadataSource || !result.metadata.imageUrls.length)throw new Error(`Metadata missing: ${tokenId}`);
  stage="raw metadata retrieval / consistency";
  const rawResponse=await fetch(result.metadataSource,{redirect:"error",signal:AbortSignal.timeout(10000)});
  if(!rawResponse.ok)throw new Error(`Raw metadata unavailable: ${tokenId}`);
  const rawMetadata=Buffer.from(await rawResponse.arrayBuffer());
  if(rawMetadata.length>256*1024)throw new Error("Metadata too large");
  if(JSON.stringify(normalizeMetadata(JSON.parse(rawMetadata.toString("utf8"))))!==JSON.stringify(result.metadata))throw new Error("Metadata changed during verification");
  const localMetadata=`/nft-candidates/token-${tokenId}.json`;
  await writeFile(`public${localMetadata}`,rawMetadata);
  stage="original artwork retrieval / validation";
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
  const artworkSha256=createHash("sha256").update(bytes).digest("hex");
  stage="artwork deduplication";
  if(seenArtwork.has(artworkSha256))throw new Error("Duplicate artwork");
  seenArtwork.add(artworkSha256);
  const localArtwork=`/nft-candidates/token-${tokenId}.webp`;
  await writeFile(`public${localArtwork}`,bytes); // No conversion, crop or re-encoding.
  candidates.push({tokenId:String(tokenId),tokenURI,collectionName,existenceVerified:true,...result,localMetadata,metadataSha256:createHash("sha256").update(rawMetadata).digest("hex"),localArtwork,imageSource,artworkMime:"image/webp",artworkWidth,artworkHeight,artworkSha256,archetype:archetypes[tokenId],fictionalFit:fits[tokenId]});
  } catch {
   verificationFailures.push({tokenId:String(tokenId),stage,reason:`Could not complete ${stage}; excluded from verified gallery. Retry or investigate before using media.`});
   console.log(`Token ${tokenId}: FAILED ${stage}`);
  }
 }
 const sheet={chainId:143,collection:GENESIS_CONTRACT,blockNumber:String(blockNumber),blockHash:block.hash,blockTimestamp:block.timestamp.toString(),verifiedAt:new Date().toISOString(),approvalStatus:"Awaiting user selection; no candidate approved",requestedTokenIds:requestedTokenIds.map(String),verificationFailures,candidates};
 await writeFile(`${directory}/provenance.json`,JSON.stringify(sheet,null,2)+"\n");
 console.log(`Verified ${candidates.length}/${requestedTokenIds.length} candidates at Monad block ${blockNumber}; ${verificationFailures.length} failures. No owner addresses stored; no candidate chosen.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
