"use client";
import {useState} from "react";
import Link from "next/link";
type NftData={tokenId:string;owner:string;tokenURI:string|null;chainId:number;collection:string};
export default function Archive(){
 const [tokenId,setTokenId]=useState("1969");
 const [loading,setLoading]=useState(false);
 const [data,setData]=useState<NftData|null>(null);
 const [error,setError]=useState("");
 async function inspect(){
   setError("");setData(null);setLoading(true);
   try{const res=await fetch("/api/nft/"+encodeURIComponent(tokenId),{cache:"no-store"});const json=await res.json();if(!res.ok)throw new Error(json.error||"RPC error");setData(json);}
   catch(e){setError(e instanceof Error?e.message:"Could not load NFT");}finally{setLoading(false);}
 }
 return <section className="archive-shell">
   <div className="eyebrow">THE FORBIDDEN ARCHIVE / MONAD MAINNET</div>
   <h1>THE <em>1,969</em><br/>SURVIVING SEALS.</h1>
   <p>Every token is a real Chog Genesis NFT. Search by the <strong>onchain token ID</strong>, which may not match a marketplace's displayed Chog number.</p>
   <form className="lookup" onSubmit={e=>{e.preventDefault();void inspect();}}>
     <label htmlFor="token">onchain token id</label>
     <div className="lookup-row"><input id="token" inputMode="numeric" pattern="[0-9]+" value={tokenId} onChange={e=>setTokenId(e.target.value)} placeholder="1969"/>
     <button className="btn btn-primary" disabled={loading}>{loading?"reading chain…":"inspect seal ↗"}</button></div>
   </form>
   {error&&<p className="error" role="alert">{error}</p>}
   {data&&<article className="seal-result">
      <div className="seal-glyph" aria-hidden="true">✷</div>
      <div><span className="eyebrow">AUTHENTIC CHAIN DATA / NOT AWAKENED</span>
       <h2>GENESIS TOKEN #{data.tokenId}</h2>
       <dl><dt>network</dt><dd>Monad · {data.chainId}</dd><dt>current holder</dt><dd className="break">{data.owner}</dd><dt>contract</dt><dd className="break">{data.collection}</dd><dt>metadata URI</dt><dd className="break">{data.tokenURI||"unavailable"}</dd></dl>
       <a target="_blank" rel="noreferrer" className="link" href={"https://opensea.io/item/monad/"+data.collection+"/"+data.tokenId}>view original NFT ↗</a>
       <p className="muted">This is a verified read-only lookup. Artwork loading, holder awakening, and canonical memory decisions are next in development. No wallet or transaction has been simulated.</p>
      </div>
     </article>}
   <Link href="/chapter/1" className="link">← return to chapter one</Link>
 </section>
}
