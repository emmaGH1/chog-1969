"use client";
import {useEffect,useRef,useState} from "react";
import {DrawerEvidence, EscapePlan} from "./chapter/ChapterInteractions";
import styles from "./chapter/chapter.module.css";
import {advanceProgress, canAdvance, INITIAL_PROGRESS, parseProgress, SAVE_KEY} from "./chapter/progress";
import Link from "next/link";
const scenes=[
 {k:"s1",number:"01 / the official history",eyebrow:"VEYRA / CENTRAL ARCHIVE",headline:"HISTORY IS WRITTEN BY THE SURVIVORS.",body:"Two centuries ago, the world survived a terrible catastrophe. The Pale Accord says the Chogs caused it. Every scrap of their history was destroyed.",speaker:"neri",line:"if they're all gone, why are we still hunting them?"},
 {k:"s2",number:"02 / the sealed drawer",eyebrow:"RESTRICTED WING / AFTER DARK",headline:"SOME THINGS ARE NOT SUPPOSED TO BE FOUND.",body:"A discarded ledger points to a locked drawer. The only clue is that the first record reads 19 and the shipment label reads 69.",speaker:"neri",line:"who leaves a puzzle in a room full of forbidden records?"},
 {k:"s3",number:"03 / a familiar stranger",eyebrow:"MEMORY ANOMALY DETECTED",headline:"THE DRAWING JUST MOVED.",body:"The creature on the page opens its eyes. A people erased from history suddenly have a voice.",speaker:"pip",line:"excuse me? i'm a legendary being of unimaginable power."},
 {k:"s4",number:"04 / the redactors",eyebrow:"THE PALE ACCORD / PURSUIT ORDER",headline:"YOU HAVE BEEN MARKED FOR ERASURE.",body:"Captain Sera's soldiers reach the archive. Neri has seconds to choose how to escape.",speaker:"sera",line:"place the drawing on the floor. your life depends on what you do next."},
 {k:"s5",number:"05 / the sealed witness",eyebrow:"ARCHIVE ENTRY / GENESIS",headline:"SOMEONE STILL REMEMBERS.",body:"A second illustrated seal sits beneath the harbor. This time it bears the identity of a real Chog Genesis NFT. Its secrets aren't for the Accord to decide.",speaker:"memory",line:"we ran toward the sea, not away from it. we were trying to close the door."},
 {k:"s6",number:"06 / the photograph",eyebrow:"FREEWAKE HARBOR / DEPARTURE",headline:"THE TRUTH HAS A PRICE.",body:"A smuggler named Rook helps Neri escape and hands her a photograph. Her missing brother stands beside Chog drawings. Someone has been waiting for her.",speaker:"rook",line:"your brother asked me to keep this. if you're holding it, they know you're here."},
] as const;
const sceneArtwork = [
 {src:"archive-scene.webp",alt:"Neri investigates the erased CHOG records in the forbidden archive."},
 {src:"archive-scene.webp",alt:"The restricted blue filing cabinet and its sealed drawer."},
 {src:"awakening-reaction.webp",alt:"Neri reacts to the awakening of the living drawing."},
 {src:"redactors-scene.webp",alt:"Neri shelters behind the archive cabinet as Redactor silhouettes enter the doorway."},
 {src:"chog-ensemble.webp",alt:"An illustrative interpretation of four Genesis CHOGs overlooking the harbor, not the collectible originals."},
 {src:"chog-ensemble.webp",alt:"The CHOG outcasts above Veyra's harbor."},
] as const;
export default function ChapterExperience(){
 const [progress,setProgress]=useState(INITIAL_PROGRESS);
 const sceneRef=useRef<HTMLDivElement>(null);
 const previousIndex=useRef<number | null>(null);
 const {index,unlocked,route}=progress;
 const [code,setCode]=useState(""),[wrong,setWrong]=useState(0);
 const [restored,setRestored]=useState(false),[saveError,setSaveError]=useState(false);
 const [missingArt,setMissingArt]=useState(false);
 useEffect(()=>{
   try {setProgress(parseProgress(localStorage.getItem(SAVE_KEY)));}
   catch {setSaveError(true);}
   setRestored(true);
 },[]);
 useEffect(()=>{
   if(!restored)return;
   try {localStorage.setItem(SAVE_KEY,JSON.stringify(progress));setSaveError(false);}
   catch {setSaveError(true);}
 },[progress,restored]);
 useEffect(()=>{
   if(!restored)return;
   if(previousIndex.current!==null && previousIndex.current!==index){
     sceneRef.current?.focus({preventScroll:true});
     sceneRef.current?.scrollIntoView({block:"start",behavior:"instant"});
   }
   previousIndex.current=index;
 },[index,restored]);
 const scene=scenes[index];
 function next(){setProgress(advanceProgress);}
 function check(){if(code.trim()==="1969"){setProgress(p=>({...p,unlocked:true}));}else setWrong(v=>v+1);}
 if(!restored)return <section className={styles.reader} aria-busy="true"><p role="status">Opening your chapter…</p></section>;
 return <section className={styles.reader} aria-label="Chapter One reader">
   <div className={styles.backdrop} aria-hidden="true">
     <img key={sceneArtwork[index].src} src={`/private-review/${sceneArtwork[index].src}`} alt="" onError={()=>setMissingArt(true)}/>
   </div>
   <div className={styles.chapterTop}><Link href="/" className={styles.brand}>CHOG <span>1969</span></Link><div>CHAPTER 01 <span>{String(index+1).padStart(2,"0")} / 06</span></div><button onClick={()=>{if(window.confirm("Restart Chapter One? This replaces your saved progress.")){setProgress({...INITIAL_PROGRESS});setCode("");setWrong(0);}}}>Restart chapter</button></div>
   <p className={styles.saveStatus} role="status">{saveError?"Progress could not be saved on this device. Keep this tab open to continue.":"Progress saved on this device · no sound required"}</p>
   <div className={styles.progressTrack} role="progressbar" aria-label="Chapter progress" aria-valuemin={1} aria-valuemax={6} aria-valuenow={index+1}><div style={{width:((index+1)/6*100)+"%"}}/></div>
   {missingArt&&<p role="status" className={styles.artNotice}>Private scene artwork is missing. Restore the review asset bundle; no substitute is shown.</p>}
   <div ref={sceneRef} className={styles.scene} tabIndex={-1} aria-labelledby="scene-heading">
   {index===2&&<img className={styles.pip} src="/private-review/pip.webp" alt="Unchanged original CHOG #545, token 1053, in the fictional role of Pip" onError={()=>setMissingArt(true)}/>}
   <div key={scene.k} className={styles.sceneHeader}>
     <small>{scene.eyebrow}</small><h1 id="scene-heading">{scene.headline}</h1>
   </div>
   <article className={styles.story}>
     <div className="eyebrow">ACT I / {scene.number}</div>
     <p className="story-copy">{scene.body}</p>
     <div className="speech"><span className="speech-speaker">{scene.speaker}</span><p>“{scene.line}”</p></div>
     {index===1&&<DrawerEvidence unlocked={unlocked}/>}
     {index===1&&!unlocked&&<div className="interaction">
       <strong>INSPECT THE DRAWER</strong><p id="drawer-help">Place the two record numbers side by side. Enter four digits.</p>
       <form onSubmit={e=>{e.preventDefault();check();}} className="puzzle-row">
         <label className="sr-only" htmlFor="drawer-code">Four-digit drawer code</label>
         <input id="drawer-code" inputMode="numeric" pattern="[0-9]{4}" required autoComplete="off" aria-describedby="drawer-help" maxLength={4} value={code} onChange={e=>setCode(e.target.value)} placeholder="••••"/>
         <button className="btn btn-primary">unlock</button>
       </form>
       {wrong>0&&<p role="status">{wrong>1?"hint: put 19 immediately before 69.":"Not quite. The numbers stand side by side."}</p>}
     </div>}
     {index===1&&unlocked&&<p className="unlock-message">✓ The drawer clicks open. An absurd little drawing smiles at you.</p>}
     {index===3&&<div className="interaction">
       <strong>WHAT DOES NERI DO?</strong><p>Two exits. One decision. Your chosen route is saved when you tap it.</p>
       <EscapePlan route={route} onChoose={choice=>setProgress(p=>p.route?p:{...p,route:choice})}/>
     </div>}
     {index===3&&route&&<p className="unlock-message">{route==="keep"?"You save the documents, but a guard catches a glimpse of your face.":"The smoke conceals your escape, but an important record about Neri's brother is lost."}</p>}
     {index>=4&&route&&<p className="unlock-message">{route==="keep"?"In your satchel: the rescued records. Behind you: a witness who knows your face.":"In your satchel: ash where a record should be. For now, the Redactors have no face to follow."}</p>}
     {index===4&&<div className="interaction"><strong>A REAL CHOG SEAL</strong><p>The Genesis collection exists on Monad. You can inspect its authentic onchain identity. We will only activate holder decisions after the contract and wallet flow are tested.</p><Link href="/archive" className="link">inspect a real Genesis token ↗</Link></div>}
     {index===5&&<div className="interaction"><strong>END OF CHAPTER ONE</strong><p>On the archive roof, a lens turns toward the harbor. Sera pins a fresh surveillance print to the wall. Neri and Pip are already circled in ink.</p><p>Next: the city that never existed.</p><Link href="/archive" className="link">explore the surviving seals ↗</Link></div>}
     {index<5&&!canAdvance(progress)&&<p className={styles.gateHint}>{index===1?"Open the drawer to continue.":"Choose an escape route to continue."}</p>}
     <nav className={styles.navigation} aria-label="Story navigation">
       {index>0&&<button className={styles.back} onClick={()=>setProgress(p=>({...p,index:p.index-1}))}>Previous scene</button>}
       {index<5&&<button className="btn btn-primary advance" onClick={next} disabled={!canAdvance(progress)}>Continue the story</button>}
       {index===5&&<Link href="/" className="btn btn-primary advance">Back to cover</Link>}
     </nav>
   </article>
   <small className={styles.artNotice}>Scene illustration under review · independent fiction, not official CHOG canon</small>
   </div>
 </section>;
}
