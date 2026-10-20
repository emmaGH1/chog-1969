"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import sheet from "../../../../public/nft-candidates/provenance.json";
import styles from "./gallery.module.css";
import {candidates,groups,filterCandidates} from "./casting";
const failures=sheet.verificationFailures as {tokenId:string;reason:string}[];
const collection="https://opensea.io/collection/chog-genesis";

export default function CandidateGallery(){
 const [query,setQuery]=useState("");
 const [activeGroup,setActiveGroup]=useState("All characters");
 const visible=useMemo(()=>filterCandidates(query,activeGroup),[query,activeGroup]);
 function reset(){setQuery("");setActiveGroup("All characters");}
 return <div className={styles.gallery}>
  <header className={styles.hero}>
   <div className={styles.heroTop}><span className={styles.eyebrow}>GENESIS / CASTING ARCHIVE</span><span className={styles.pending}><span aria-hidden="true">○</span> Awaiting your choice</span></div>
   <h1>Twelve originals.<br/>One possible <em>Pip.</em></h1>
   <p className={styles.intro}>Twelve authentic <a href={collection} target="_blank" rel="noreferrer">Chog Genesis</a> characters. Twelve ways to imagine a mischievous Pip. Who might sneak into our story?</p>
   <div className={styles.facts}><span><strong>12</strong> verified originals</span><span><strong>04</strong> fictional archetypes</span><span><strong>00</strong> characters selected</span></div>
   <p className={styles.heroNote}>Original collection art, unchanged. Personality ideas are fictional—not official metadata, holder identities, or a casting decision.</p>
  </header>

  <section className={styles.browser} aria-label="Browse Chog characters">
   <div className={styles.toolbar}>
    <div><p className={styles.eyebrow}>FIND YOUR KIND OF TROUBLE</p><h2>Meet the cast</h2></div>
    <div className={styles.search}><label htmlFor="cast-search">Search token ID, name or trait</label><div><span aria-hidden="true">⌕</span><input id="cast-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try 1969, bubblegum, wizard…" autoComplete="off"/></div></div>
   </div>
   <div className={styles.filters} role="group" aria-label="Filter by fictional archetype">
    <button type="button" aria-pressed={activeGroup==="All characters"} onClick={()=>setActiveGroup("All characters")}>All characters <span>12</span></button>
    {groups.map(group=><button type="button" key={group.name} aria-pressed={activeGroup===group.name} onClick={()=>setActiveGroup(group.name)}>{group.label} <span>{candidates.filter(candidate=>candidate.archetype===group.name).length}</span></button>)}
   </div>
   <div className={styles.resultLine}><p role="status" aria-live="polite">Showing <strong>{visible.length}</strong> of 12 verified characters{activeGroup!=="All characters"?` · ${groups.find(group=>group.name===activeGroup)?.note}`:" · Grouped by story potential, never by price."}</p>{(query||activeGroup!=="All characters")&&<button className={styles.reset} type="button" onClick={reset}>Reset filters ↺</button>}</div>
   <div className={styles.grid}>{visible.map(candidate=>{
    const group=groups.find(item=>item.name===candidate.archetype)!;
    const highlights=candidate.metadata.attributes.filter(trait=>["Eyes","Mouth","Head"].includes(trait.trait_type));
    return <article className={styles.card} id={`token-${candidate.tokenId}`} key={candidate.tokenId} aria-labelledby={`name-${candidate.tokenId}`}>
     <div className={styles.cardTop}><span>ONCHAIN TOKEN <strong>{candidate.tokenId}</strong></span><span className={styles.verified}><span aria-hidden="true">✓</span> Verified</span></div>
     <a className={styles.artLink} href={candidate.localArtwork} target="_blank" rel="noreferrer" aria-label={`Open unaltered ${candidate.metadata.name} artwork, token ${candidate.tokenId}`}><img className={styles.art} src={candidate.localArtwork} alt={`Original ${candidate.metadata.name} artwork, onchain token ${candidate.tokenId}`} width={candidate.artworkWidth} height={candidate.artworkHeight} loading="lazy" decoding="async"/><span className={styles.artCaption}>Unaltered collection artwork <span aria-hidden="true">↗</span></span></a>
     <div className={styles.body}>
      <p className={styles.category}>{group.label} <span>/ fictional role</span></p>
      <h2 id={`name-${candidate.tokenId}`}>{candidate.metadata.name}</h2>
      <p className={styles.identity}>Chog Genesis · token ID <strong>{candidate.tokenId}</strong><br/><span>Metadata display name and token ID are different.</span></p>
      <div className={styles.highlights} aria-label="Selected original collection traits">{highlights.map(trait=><span key={trait.trait_type}><small>{trait.trait_type}</small>{trait.value}</span>)}</div>
      <section className={styles.personality} aria-label={`Fictional personality for token ${candidate.tokenId}`}><h3>IF THIS WERE PIP…</h3><p>{candidate.fictionalFit}</p></section>
      <details className={styles.details}><summary>All {candidate.metadata.attributes.length} original traits <span aria-hidden="true">＋</span></summary><p className={styles.description}>{candidate.metadata.description}</p><dl className={styles.traits}>{candidate.metadata.attributes.map((trait,index)=><div key={index}><dt>{trait.trait_type}</dt><dd>{trait.value}</dd></div>)}</dl></details>
      <details className={styles.details}><summary>Metadata & provenance <span aria-hidden="true">＋</span></summary><dl className={styles.sources}><dt>Original tokenURI</dt><dd>{candidate.tokenURI}</dd><dt>Original artwork URI</dt><dd>{candidate.metadata.image}</dd><dt>Artwork file</dt><dd>{candidate.artworkMime} · {candidate.artworkWidth} × {candidate.artworkHeight}</dd><dt>Artwork SHA-256</dt><dd>{candidate.artworkSha256}</dd><dt>Raw metadata SHA-256</dt><dd>{candidate.metadataSha256}</dd></dl><nav className={styles.sourceLinks} aria-label={`Token ${candidate.tokenId} source files`}><a href={candidate.localMetadata} target="_blank" rel="noreferrer">Frozen raw JSON ↗</a><a href={candidate.metadataSource} target="_blank" rel="noreferrer">Metadata gateway ↗</a><a href={candidate.imageSource} target="_blank" rel="noreferrer">Artwork gateway ↗</a></nav></details>
      <a className={styles.marketLink} href={`https://opensea.io/item/monad/${sheet.collection}/${candidate.tokenId}`} target="_blank" rel="noreferrer">View original token <span aria-hidden="true">↗</span></a>
     </div>
    </article>;
   })}</div>
   {visible.length===0&&<div className={styles.empty}><span aria-hidden="true">⌕</span><h3>No characters found.</h3><p>Try an onchain ID, a metadata name, or a trait like “smile”.</p><button type="button" onClick={reset}>Show all twelve ↗</button></div>}
  </section>

  <section className={styles.proof} aria-label="Gallery verification record">
   <div><span className={styles.eyebrow}>COLLECTION ORIGINALS / VERIFIED SNAPSHOT</span><h2>Real characters.<br/>Transparent sources.</h2><p>All {sheet.candidates.length} requested candidates passed at one Monad block. {failures.length} unresolved failures. This is a dated, read-only record—not a live ownership claim.</p></div>
   <div><dl className={styles.proofList}><div><dt>Network</dt><dd>Monad mainnet · {sheet.chainId}</dd></div><div><dt>Verification block</dt><dd>{sheet.blockNumber}</dd></div><div><dt>Verified at (UTC)</dt><dd>{sheet.verifiedAt}</dd></div><div><dt>Canonical collection</dt><dd><a href={`https://monadvision.com/address/${sheet.collection}`} target="_blank" rel="noreferrer">{sheet.collection} ↗</a></dd></div></dl>
   <details className={styles.details}><summary>How verification works <span aria-hidden="true">＋</span></summary><p>Token existence and tokenURI were read at the same block; holder addresses were discarded. Original metadata and artwork were retrieved through fixed IPFS gateways and saved unchanged. File hashes identify these copies; this app does not independently validate IPFS CIDs.</p><p className={styles.hash}>Block hash: {sheet.blockHash}</p>{failures.map(failure=><p key={failure.tokenId}>Token {failure.tokenId} excluded: {failure.reason}</p>)}<div className={styles.sourceLinks}><a href="/nft-candidates/provenance.json">Complete verification packet ↗</a><a href="https://github.com/emmaGH1/chog-1969/blob/feat/nft-memory/docs/PIP_ROUND2_RECHECK.json" target="_blank" rel="noreferrer">Additional eight: independent recheck ↗</a></div></details></div>
  </section>
  <footer className={styles.note}><span className={styles.eyebrow}>THE NEXT CHAPTER IS YOUR CALL</span><h2>Who could become Pip?</h2><p>Tell us an <strong>onchain token ID</strong> when you’re ready—or keep exploring. Nothing here selects, buys, renames or awakens an NFT.</p><p className={styles.disclaimer}>Pip is a fictional nickname. No project endorsement or artwork license is implied. Adaptations require selection and rights review. No wallet connection, signature, deployment or transaction is involved. External source links may share your IP with those services.</p><div className={styles.footerLinks}><Link href="/archive">← Live NFT archive</Link><a href={collection} target="_blank" rel="noreferrer">Explore Genesis collection ↗</a></div></footer>
 </div>;
}
