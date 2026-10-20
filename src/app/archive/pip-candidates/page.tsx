import Link from "next/link";
import sheet from "../../../../public/nft-candidates/provenance.json";
import styles from "./gallery.module.css";

export default function PipCandidates(){
 return <main className={styles.gallery}>
  <header><p className="eyebrow">CHOG / 1969 · CAST APPROVAL SHEET</p>
   <h1>Who could Pip be?</h1>
   <p className={styles.intro}>Four authentic Chog Genesis candidates. <strong>No candidate has been selected.</strong> Pip would be a fictional nickname—not an official metadata rename, project endorsement, or claim about a holder.</p>
   <p className={styles.provenance}>Monad mainnet {sheet.chainId} · block {sheet.blockNumber} · verified {sheet.verifiedAt}<br/>
    Collection: <a href={`https://monadvision.com/address/${sheet.collection}`} target="_blank" rel="noreferrer">{sheet.collection}</a><br/>
    Token existence and tokenURI were read at this block. This is a dated read-only snapshot; no holder addresses are published.</p>
  </header>
  <div className={styles.grid}>{sheet.candidates.map(candidate=><article className={styles.card} key={candidate.tokenId}>
   <div className={styles.label}>ONCHAIN TOKEN {candidate.tokenId} <span>AWAITING APPROVAL</span></div>
   <img className={styles.art} src={candidate.localArtwork} alt={`Original ${candidate.metadata.name} artwork, onchain token ${candidate.tokenId}`} width={1000} height={1000}/>
   <div className={styles.body}>
    <p className="eyebrow">{candidate.collectionName} / ORIGINAL METADATA</p>
    <h2>{candidate.metadata.name}</h2>
    <p className={styles.id}>Onchain ID <strong>{candidate.tokenId}</strong> ≠ artwork/display label above.</p>
    <p>{candidate.metadata.description}</p>
    <div className={styles.fit}><h3>Fictional character fit</h3><p>{candidate.fictionalFit}</p><small>Story interpretation only; not a metadata trait or an approved casting decision.</small></div>
    <h3>Original collection traits</h3>
    <dl className={styles.traits}>{candidate.metadata.attributes.map((trait,index)=><div key={index}><dt>{trait.trait_type}</dt><dd>{trait.value}</dd></div>)}</dl>
    <details><summary>Source URIs & file provenance</summary>
     <dl className={styles.sources}><dt>Onchain tokenURI</dt><dd>{candidate.tokenURI}</dd><dt>Original artwork URI</dt><dd>{candidate.metadata.image}</dd><dt>Local original file SHA-256</dt><dd>{candidate.artworkSha256}</dd></dl>
     <p>Artwork bytes were downloaded unchanged from the linked gateway, with no crop, recolor or generated replacement. SHA-256 identifies this local copy; it is not independent verification of the IPFS CID.</p>
    </details>
    <nav className={styles.links} aria-label={`Token ${candidate.tokenId} sources`}>
     <a href={candidate.metadataSource} target="_blank" rel="noreferrer">Metadata JSON ↗</a>
     <a href={candidate.imageSource} target="_blank" rel="noreferrer">Original artwork ↗</a>
     <a href={`https://opensea.io/item/monad/${sheet.collection}/${candidate.tokenId}`} target="_blank" rel="noreferrer">OpenSea token ↗</a>
    </nav>
   </div>
  </article>)}</div>
  <footer className={styles.note}><h2>Your approval comes first.</h2><p>Reply with an <strong>onchain token ID</strong> if you want to cast one of these as Pip—or request another shortlist. No purchase, wallet connection, transaction, or owner permission is implied by this gallery. NFT ownership is not a copyright license; confirm collection artwork usage rights before publication.</p><p>Metadata and art are collection content obtained through third-party IPFS gateways. Links may expose your IP to those services. No contract was deployed and no transaction was submitted.</p><p><a href="/nft-candidates/provenance.json">Download the verification sheet</a> · <Link href="/archive">Return to live archive</Link></p></footer>
 </main>;
}
