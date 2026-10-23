"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import HolderAwakening from '@/components/HolderAwakening';
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
 const result=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(!data)return;
  result.current?.focus({preventScroll:true});
  result.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
 },[data]);
 async function inspect(id=tokenId){
  const sequence=++request.current;
  setTokenId(id);
  setError("");setData(null);setLoading(true);
  try {
   const res=await fetch("/api/nft/"+encodeURIComponent(id),{cache:"no-store"});
   const json=await res.json();
   if(!res.ok)throw new Error(json.error||"RPC error");
   if(sequence===request.current)setData(json);
  } catch(e){if(sequence===request.current)setError(e instanceof Error?e.message:"Could not load NFT");}
  finally{if(sequence===request.current)setLoading(false);}
 }
 return <section className={styles.archive} aria-label="The Genesis archive">
  <div className={styles.environment} aria-hidden="true"/>
  <header className={styles.header}>
   <Link href="/" className={styles.brand}>CHOG<span>1969</span></Link>
   <nav aria-label="Archive navigation"><Link href="/chapter/1">Return to the story</Link><span>MONAD / GENESIS</span></nav>
  </header>
  <div className={styles.intro}>
   <figure className={styles.featured}>
    <div className={styles.referenceArt}><OriginalArt urls={["/private-review/pip.webp"]} name="Unchanged original CHOG #545, token 1053, in the fictional role of Pip"/></div>
    <figcaption><span>OUTCAST. NOT FORGOTTEN.</span><strong>MEET PIP.</strong><p>Original CHOG #545 · onchain token 1053.<br/>Pip is his role in our fiction, not official collection canon.</p></figcaption>
    <button type="button" className={styles.featureAction} disabled={loading} onClick={()=>void inspect("1053")}>Inspect Pip’s onchain identity</button>
   </figure>
   <div className={styles.heroCopy}>
    <div className={styles.eyebrow}>THE FORBIDDEN ARCHIVE / 1,969 SURVIVING SEALS</div>
    <h1>THE WORLD FORGOT.<br/><em>THEY DIDN’T.</em></h1>
    <p>Not a replacement drawing. Not another erased name. The original CHOGs still have an identity on Monad.</p>
    <p className={styles.readOnly}>Read their records. No wallet required.</p>
  <form className={styles.lookup} onSubmit={e=>{e.preventDefault();void inspect();}}>
   <label htmlFor="token">onchain token id</label>
   <div className={styles.lookupRow}><input id="token" aria-describedby="token-help" required inputMode="numeric" pattern="[0-9]+" maxLength={78} value={tokenId} onChange={e=>setTokenId(e.target.value)} placeholder="1969"/>
   <button className="btn btn-primary" disabled={loading}>{loading?"reading chain…":"inspect seal"}</button></div>
   <p id="token-help">Token ID ≠ artwork number. Token 1969 is CHOG #1461; Pip is token 1053, CHOG #545.</p>
  </form>
   <div className={styles.requestStatus} role="status" aria-busy={loading}>{loading&&"Reading ownership and metadata at one Monad block. No transaction is requested."}</div>
   {error&&<p className={styles.error} role="alert">{error} Try inspecting the seal again.</p>}
   </div>
  </div>
   {data&&<article ref={result} tabIndex={-1} aria-labelledby="record-name" className={styles.dossier}>
    <div>
     <OriginalArt key={data.tokenId+data.checkedAt} urls={data.metadata?.imageUrls??[]} name={data.metadata?.name??`Genesis token ${data.tokenId}`}/>
     <p className="muted">Original collection artwork, loaded from its metadata. Not generated or substituted. External gateways may see your IP address.</p>
    </div>
    <div className={styles.details}>
     <span className={styles.eyebrow}>LIVE CHAIN READ / READ-ONLY DOSSIER</span>
     <h2 id="record-name">{data.metadata?.name??"Chog Genesis"}</h2>
     <p><strong>Onchain token ID: {data.tokenId}</strong> · Metadata name above is the artwork/display label.</p>
     <p className={styles.blockRead}>Monad {data.chainId} / read at block {data.blockNumber}</p>
     {data.metadata?.description&&<p>{data.metadata.description}</p>}
     {data.metadataWarning&&<p role="status">{data.metadataWarning}</p>}
     <details className={styles.sources}><summary>Chain evidence and sources</summary>
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
     </details>
     {!!data.metadata?.attributes.length&&<><h3>Collection traits</h3><dl className={styles.traits}>{data.metadata.attributes.map((trait,index)=><div key={index}><dt>{trait.trait_type}</dt><dd>{trait.value}</dd></div>)}</dl></>}
     <section className={styles.memory} aria-label="Canonical memory">
      <h3>Memory awakening</h3>
      {data.memory.status==="not-configured"&&<p>No approved MemoryLedger deployment is configured. Canonical memory status is unknown, not “unawakened.”</p>}
      {data.memory.status==="unavailable"&&<p>MemoryLedger could not be verified or read. No canonical state is assumed.</p>}
      {data.memory.status==="unawakened"&&<p>No memory is recorded for this token at block {data.blockNumber} in the configured ledger.</p>}
      {data.memory.status==="awakened"&&<><p>Permanent choice: <strong>{data.memory.choice}</strong></p><p className="break">Historically awakened by {data.memory.awakenedBy} at Unix timestamp {data.memory.at}. This decision follows the token on transfer; the original signer need not be its current owner.</p></>}
      {data.memory.ledger&&<p className="break">Configured ledger: <a className="link" href={`https://monadvision.com/address/${data.memory.ledger}`} target="_blank" rel="noreferrer">{data.memory.ledger}</a></p>}
      <p className="muted">Owner-only, one-time Reveal or Protect. Local contract tests are not a live awakening. Holder controls below are feature-gated pending explicit deployment approval and real-holder testing; a connection alone is not ownership proof.</p>
      <HolderAwakening key={data.tokenId} tokenId={data.tokenId} memory={data.memory} onRefresh={async()=>{
       const sequence=++request.current;
       const res=await fetch('/api/nft/'+data.tokenId,{cache:'no-store'});
       if(!res.ok)throw new Error('Dossier refresh failed. Memory status is not refreshed; retry the public read.');
       const refreshed=await res.json();
       if(sequence===request.current)setData(refreshed);
      }}/>
     </section>
    </div>
   </article>}
  <footer className={styles.footer}><Link href="/chapter/1">Return to Chapter One</Link><span>Independent fiction · original collectibles · no official endorsement</span></footer>
 </section>;
}
