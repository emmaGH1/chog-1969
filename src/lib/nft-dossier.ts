import { BaseError, ContractFunctionRevertedError, isAddress } from "viem";
import { ERC721_READ, GENESIS_CONTRACT, MEMORY_READ, rpc } from "./monad";
import { loadMetadata } from "./nft-metadata";

export type MemoryStatus = {
 status:"not-configured"|"unavailable"|"unawakened"|"awakened";
 ledger:string|null; choice?:"Reveal"|"Protect"; awakenedBy?:string; at?:string;
};
export class MissingTokenError extends Error {}
export function parseTokenId(input:string):bigint {
 if(!/^\d{1,78}$/.test(input)) throw new Error("Invalid token ID");
 const id=BigInt(input);
 if(id>=BigInt(2)**BigInt(256)) throw new Error("Invalid token ID");
 return id;
}
async function memoryAt(id:bigint,blockNumber:bigint):Promise<MemoryStatus> {
 const address=process.env.MEMORY_LEDGER_ADDRESS;
 if(!address) return {status:"not-configured",ledger:null};
 if(!isAddress(address)) return {status:"unavailable",ledger:null};
 try {
  const genesis=await rpc.readContract({address,abi:MEMORY_READ,functionName:"genesis",blockNumber});
  if(genesis.toLowerCase()!==GENESIS_CONTRACT) throw new Error("Wrong collection");
  const memory=await rpc.readContract({address,abi:MEMORY_READ,functionName:"memoryOf",args:[id],blockNumber});
  if(memory.choice===0) return {status:"unawakened",ledger:address};
  if(memory.choice!==1 && memory.choice!==2) throw new Error("Invalid choice");
  return {status:"awakened",ledger:address,choice:memory.choice===1?"Reveal":"Protect",awakenedBy:memory.awakenedBy,at:memory.at.toString()};
 } catch { return {status:"unavailable",ledger:address}; }
}
export async function getDossier(id:bigint){
 if(await rpc.getChainId()!==143) throw new Error("RPC is not Monad mainnet");
 const blockNumber=await rpc.getBlockNumber({cacheTime:0});
 let owner:string;
 try {owner=await rpc.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:"ownerOf",args:[id],blockNumber});}
 catch(error){
  if(error instanceof BaseError && error.walk(cause=>cause instanceof ContractFunctionRevertedError) instanceof ContractFunctionRevertedError) throw new MissingTokenError("ownerOf reverted");
  throw error;
 }
 const tokenURI=await rpc.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:"tokenURI",args:[id],blockNumber}).catch(()=>null);
 const [metadata,memory]=await Promise.all([loadMetadata(tokenURI),memoryAt(id,blockNumber)]);
 return {tokenId:id.toString(),owner,tokenURI,chainId:143,collection:GENESIS_CONTRACT,blockNumber:blockNumber.toString(),checkedAt:new Date().toISOString(),...metadata,memory};
}
export type NftDossier = Awaited<ReturnType<typeof getDossier>>;
