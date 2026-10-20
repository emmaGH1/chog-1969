"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
type Route="keep"|"burn"|null;
const scenes=[
 {k:"s1",number:"01 / the official history",eyebrow:"VE YRA / CENTRAL ARCHIVE",headline:"HISTORY IS WRITTEN BY THE SURVIVORS.",body:"Two centuries ago, the world survived a terrible catastrophe. The Pale Accord says the Chogs caused it. Every scrap of their history was destroyed.",speaker:"neri",line:"if they're all gone, why are we still hunting them?"},
 {k:"s2",number:"02 / the sealed drawer",eyebrow:"RESTRICTED WING / AFTER DARK",headline:"SOME THINGS ARE NOT SUPPOSED TO BE FOUND.",body:"A discarded ledger points to a locked drawer. The only clue is that the first record reads 19 and the shipment label reads 69.",speaker:"neri",line:"who leaves a puzzle in a room full of forbidden records?"},
 {k:"s3",number:"03 / a familiar stranger",eyebrow:"MEMORY ANOMALY DETECTED",headline:"THE DRAWING JUST MOVED.",body:"The crude creature on the page opens one enormous eye. A splash of impossible violet spills into the monochrome archive.",speaker:"pip",line:"excuse me? i'm a legendary being of unimaginable power."},
 {k:"s4",number:"04 / the redactors",eyebrow:"THE PALE ACCORD / PURSUIT ORDER",headline:"YOU HAVE BEEN MARKED FOR ERASURE.",body:"Captain Sera's soldiers reach the archive. Neri has seconds to choose how to escape.",speaker:"sera",line:"place the drawing on the floor. your life depends on what you do next."},
 {k:"s5",number:"05 / the sealed witness",eyebrow:"ARCHIVE ENTRY / GENESIS",headline:"SOMEONE STILL REMEMBERS.",body:"A second illustrated seal sits beneath the harbor. This time it bears the identity of a real Chog Genesis NFT. Its secrets aren't for the Accord to decide.",speaker:"memory",line:"we ran toward the sea, not away from it. we were trying to close the door."},
 {k:"s6",number:"06 / the photograph",eyebrow:"FREEWAKE HARBOR / DEPARTURE",headline:"THE TRUTH HAS A PRICE.",body:"A smuggler named Rook helps Neri escape and hands her a photograph. Her missing brother stands beside Chog drawings. Someone has been waiting for her.",speaker:"sera",line:"no. but my mother did."},
] as const;
export default function ChapterExperience(){
 const [index,setIndex]=useState(0),[code,setCode]=useState(""),[unlocked,setUnlocked]=useState(false),[wrong,setWrong]=useState(0),[route,setRoute]=useState<Route>(null);
 const [restored,setRestored]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("chog1969:pilot")||"{}");if(typeof saved.index==="number")setIndex(Math.min(Math.max(saved.index,0),5));if(saved.unlocked)setUnlocked(true);if(saved.route==="keep"||saved.route==="burn")setRoute(saved.route);}catch{}setRestored(true);},[]);
 useEffect(()=>{if(restored)localStorage.setItem("chog1969:pilot",JSON.stringify({index,unlocked,route}));},[index,unlocked,route,restored]);
 const scene=scenes[index];
 function next(){if(index<5)setIndex(v=>v+1);}
 function check(){if(code.trim()==="1969"){setUnlocked(true);}else setWrong(v=>v+1);}
 return <section className="chapter-shell">
   <div className="chapter-top"><Link href="/" className="link">← back to cover</Link><div className="progress-meta">CHAPTER 01 <span>{index+1} / 6</span></div><button className="quiet" onClick={()=>{setIndex(0);setCode("");setUnlocked(false);setRoute(null);}}>restart</button></div>
   <div className="progress-track"><div style={{width:((index+1)/6*100)+"%"}}/></div>
   <div className={"manga-stage manga-"+scene.k}>
     <div className="manga-corner">REDACTED HISTORY / ARCHIVE 1969</div>
     <div className="manga-sigil" aria-hidden="true">{index===2?"✺":index===4?"✷":index===5?"≋":"◈"}</div>
     <div className="manga-caption"><small>{scene.eyebrow}</small><h1>{scene.headline}</h1></div>
     {index===2&&<div className="pip-burst" aria-label="Violet appears in the world">✷</div>}
   </div>
   <article className="story-panel">
     <div className="eyebrow">ACT I / {scene.number}</div>
     <p className="story-copy">{scene.body}</p>
     <div className="speech"><span className="speech-speaker">{scene.speaker}</span><p>“{scene.line}”</p></div>
     {index===1&&!unlocked&&<div className="interaction">
       <strong>INSPECT THE DRAWER</strong><p>Place the two record numbers side by side.</p>
       <form onSubmit={e=>{e.preventDefault();check();}} className="puzzle-row">
         <label className="sr-only" htmlFor="drawer-code">Four-digit drawer code</label>
         <input id="drawer-code" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={code} onChange={e=>setCode(e.target.value)} placeholder="••••"/>
         <button className="btn btn-primary">unlock</button>
       </form>
       {wrong>0&&<p role="status">{wrong>1?"hint: put 19 immediately before 69.":"Not quite. The numbers stand side by side."}</p>}
     </div>}
     {index===1&&unlocked&&<p className="unlock-message">✓ The drawer clicks open. An absurd little drawing smiles at you.</p>}
     {index===3&&!route&&<div className="interaction">
       <strong>WHAT DOES NERI DO?</strong>
       <div className="choice-grid"><button onClick={()=>setRoute("keep")} className="choice">Keep the evidence <span>escape through maintenance</span></button><button onClick={()=>setRoute("burn")} className="choice">Burn the records <span>smoke hides your escape</span></button></div>
     </div>}
     {index===3&&route&&<p className="unlock-message">{route==="keep"?"You save the documents, but a guard catches a glimpse of your face.":"The smoke conceals your escape, but an important record about Neri's brother is lost."}</p>}
     {index===4&&<div className="interaction"><strong>A REAL CHOG SEAL</strong><p>The Genesis collection exists on Monad. You can inspect its authentic onchain identity. We will only activate holder decisions after the contract and wallet flow are tested.</p><Link href="/archive" className="link">inspect a real Genesis token ↗</Link></div>}
     {index===5&&<div className="interaction"><strong>END OF CHAPTER ONE</strong><p>Next: the city that never existed.</p><Link href="/archive" className="link">explore the surviving seals ↗</Link></div>}
     {index<5&&<button className="btn btn-primary advance" onClick={next} disabled={(index===1&&!unlocked)||(index===3&&!route)}>continue the story <span>→</span></button>}
   </article>
 </section>;
}
