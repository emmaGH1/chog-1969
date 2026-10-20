import { NextResponse } from "next/server";
import { ERC721_READ, GENESIS_CONTRACT, rpc } from "@/lib/monad";
export const dynamic = "force-dynamic";
export async function GET(_: Request, ctx: {params: Promise<{tokenId:string}>}){
  const {tokenId} = await ctx.params;
  if(!/^\d{1,6}$/.test(tokenId)) return NextResponse.json({error:"Invalid token ID"}, {status:400});
  const id=BigInt(tokenId);
  try{
    const [owner,tokenURI]=await Promise.all([
      rpc.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:"ownerOf",args:[id]}),
      rpc.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:"tokenURI",args:[id]}).catch(()=>null),
    ]);
    return NextResponse.json({tokenId:id.toString(), owner, tokenURI, chainId:143, collection:GENESIS_CONTRACT},{headers:{"Cache-Control":"public, s-maxage=30, stale-while-revalidate=120"}});
  }catch(e){
    return NextResponse.json({error:"Token could not be read. Check the ID or retry when the public RPC is available."},{status:502});
  }
}
