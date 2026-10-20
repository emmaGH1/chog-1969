"use client";
import {useRef,useState} from "react";
import Link from "next/link";
import type {NftDossier} from "@/lib/nft-dossier";
import styles from "./archive.module.css";

function OriginalArt({urls,name}:{urls:string[];name:string}){
 const [index,setIndex]=useState(0);
 return index<urls.length ? <img className={styles.art} src={urls[index]} alt={name} referrerPolicy="no-referrer" onError={()=>setIndex(i=>i+1)}/> : <div className={styles.noArt}>Original artwork unavailable.<br/>No substitute image is shown.</div>;
}
export default function Archive(){
 const [tokenId,setTokenId]=useState("1969");
 const [loading,setLoading]=useState(false);
 const [data,setData]=useState<NftDossier|null>(null);
 const [error,setError]=useState("");
 const request=useRef(0);
 async function inspect(){
  const sequence=++request.current;
  setError("");setData(null);setLoading(true);
  try {
   const res=await fetch("/api/nft/"+encodeURIComponent(tokenId),{cache:"no-store"});
   const json=await res.json();
   if(!res.ok)throw new Error(json.error||"RPC error");
   if(sequence===request.current)setData(json);
  } catch(e){if(sequence===request.current)setError(e instanceof Error?e.message:"Could not load NFT");}
  finally{if(sequence===request.current)setLoading(false);}
 }
 return <section className="archive-shell">
  <div className="eyebrow">THE FORBIDDEN ARCHIVE / MONAD MAINNET</div>
  <h1>THE <em>1,969</em><br/>SURVIVING SEALS.</h1>
  <p>Read a real Chog Genesis NFT. Enter the <strong>onchain token ID</strong>, not its artwork or marketplace display number. Token 1969 resolves to artwork named CHOG #1461; these numbers are not interchangeable.</p>
  <p><Link className="link" href="/archive/pip-candidates">View four authentic Pip candidates — awaiting your selection ↗</Link></p>
  <form className="lookup" onSubmit={e=>{e.preventDefault();void inspect();}}>
   <label htmlFor="token">onchain token id</label>
   <div className="lookup-row"><input id="token" required inputMode="numeric" pattern="[0-9]+" maxLength={78} value={tokenId} onChange={e=>setTokenId(e.target.value)} placeholder="1969"/>
   <button className="btn btn-primary" disabled={loading}>{loading?"reading chain…":"inspect seal ↗"}</button></div>
  </form>
  <div aria-live="polite" aria-busy={loading}>
   {error&&<p className="error" role="alert">{error}</p>}
   {data&&<article className={styles.dossier}>
    <div>
     <OriginalArt key={data.tokenId+data.checkedAt} urls={data.metadata?.imageUrls??[]} name={data.metadata?.name??`Genesis token ${data.tokenId}`}/>
     <p className="muted">Original collection artwork, loaded from its metadata. Not generated or substituted. External gateways may see your IP address.</p>
    </div>
    <div className={styles.details}>
     <span className="eyebrow">LIVE CHAIN READ / READ-ONLY DOSSIER</span>
     <h2>{data.metadata?.name??"Chog Genesis"}</h2>
     <p><strong>Onchain token ID: {data.tokenId}</strong> · Metadata name above is the artwork/display label.</p>
     {data.metadata?.description&&<p>{data.metadata.description}</p>}
     {data.metadataWarning&&<p role="status">{data.metadataWarning}</p>}
     <dl>
      <dt>network</dt><dd>Monad mainnet · {data.chainId}</dd>
      <dt>holder at block {data.blockNumber}</dt><dd className="break"><a className="link" href={`https://monadvision.com/address/${data.owner}`} target="_blank" rel="noreferrer">{data.owner}</a></dd>
      <dt>collection contract</dt><dd className="break"><a className="link" href={`https://monadvision.com/address/${data.collection}`} target="_blank" rel="noreferrer">{data.collection}</a></dd>
      <dt>onchain metadata URI</dt><dd className="break">{data.tokenURI??"unavailable"}</dd>
      <dt>original artwork URI</dt><dd className="break">{data.metadata?.image??"unavailable"}</dd>
      <dt>read time (UTC)</dt><dd>{data.checkedAt}</dd>
     </dl>
     {data.metadataSource&&<p><a className="link" href={data.metadataSource} target="_blank" rel="noreferrer">inspect source metadata ↗</a></p>}
     <a target="_blank" rel="noreferrer" className="link" href={`https://opensea.io/item/monad/${data.collection}/${data.tokenId}`}>view original NFT on OpenSea ↗</a>
     <p className="muted">Ownership and tokenURI were read at the same Monad block. Ownership can change. Metadata is untrusted collection content delivered by an IPFS gateway; this app does not independently verify its content hash.</p>
     {!!data.metadata?.attributes.length&&<><h3>Collection traits</h3><dl className={styles.traits}>{data.metadata.attributes.map((trait,index)=><div key={index}><dt>{trait.trait_type}</dt><dd>{trait.value}</dd></div>)}</dl></>}
     <section className={styles.memory} aria-label="Canonical memory">
      <h3>Memory awakening</h3>
      {data.memory.status==="not-configured"&&<p>No approved MemoryLedger deployment is configured. Canonical memory status is unknown, not “unawakened.”</p>}
      {data.memory.status==="unavailable"&&<p>MemoryLedger could not be verified or read. No canonical state is assumed.</p>}
      {data.memory.status==="unawakened"&&<p>No memory is recorded for this token at block {data.blockNumber} in the configured ledger.</p>}
      {data.memory.status==="awakened"&&<><p>Permanent choice: <strong>{data.memory.choice}</strong></p><p className="break">Historically awakened by {data.memory.awakenedBy} at Unix timestamp {data.memory.at}. This decision follows the token on transfer; the original signer need not be its current owner.</p></>}
      {data.memory.ledger&&<p className="break">Configured ledger: <a className="link" href={`https://monadvision.com/address/${data.memory.ledger}`} target="_blank" rel="noreferrer">{data.memory.ledger}</a></p>}
      <p className="muted">Owner-only, one-time Reveal or Protect. Local contract tests are not a live awakening. Wallet writes remain disabled pending explicit deployment and transaction approval. No wallet connection, signature, gas payment or transaction has occurred here.</p>
     </section>
    </div>
   </article>}
  </div>
  <Link href="/chapter/1" className="link">← return to chapter one</Link>
 </section>;
}
