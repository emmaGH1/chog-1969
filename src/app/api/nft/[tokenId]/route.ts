import { NextResponse } from "next/server";
import { getDossier, MissingTokenError, parseTokenId } from "@/lib/nft-dossier";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_: Request, ctx: {params: Promise<{tokenId:string}>}) {
 const {tokenId}=await ctx.params;
 let id:bigint;
 try {id=parseTokenId(tokenId);} catch {return NextResponse.json({error:"Invalid token ID: enter an unsigned uint256 decimal integer."},{status:400});}
 try {
  return NextResponse.json(await getDossier(id),{headers:{"Cache-Control":"no-store"}});
 } catch(error){
  if(error instanceof MissingTokenError) return NextResponse.json({error:"ownerOf reverted for this onchain token ID. It may not exist. Marketplace artwork numbers are not token IDs; no alternate ID was substituted."},{status:404});
  return NextResponse.json({error:"Monad RPC lookup failed or returned the wrong network. Retry later; no ownership or memory status was assumed."},{status:502});
 }
}
