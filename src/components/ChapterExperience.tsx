"use client";
import {useEffect,useRef,useState} from "react";
import {DrawerEvidence, MemoryEcho, Photograph} from "./chapter/ChapterInteractions";
import ErasureEncounter from "./chapter/ErasureEncounter";
import {consequence} from "./chapter/consequences";
import {StorySoundControl,useStoryAudio,useSoundscape} from "./StoryAudio";
import styles from "./chapter/chapter.module.css";
import {advanceProgress, canAdvance, INITIAL_PROGRESS, parseProgress, SAVE_KEY} from "./chapter/progress";
import Link from "next/link";
import PipReconstruction from "./chapter/PipReconstruction";
import {usePipReconstruction} from "./chapter/usePipReconstruction";
const scenes=[
 {k:"s1",number:"01 / the official history",eyebrow:"VEYRA / CENTRAL ARCHIVE",headline:"HISTORY IS WRITTEN BY THE SURVIVORS.",body:"Two centuries ago, the world survived a terrible catastrophe. The Pale Accord says the Chogs caused it. Every scrap of their history was destroyed.",speaker:"neri",line:"if they're all gone, why are we still hunting them?"},
 {k:"s2",number:"02 / the sealed drawer",eyebrow:"RESTRICTED WING / AFTER DARK",headline:"SOME THINGS ARE NOT SUPPOSED TO BE FOUND.",body:"A discarded ledger points to a locked drawer. The only clue is that the first record reads 19 and the shipment label reads 69.",speaker:"neri",line:"who leaves a puzzle in a room full of forbidden records?"},
 {k:"s3",number:"03 / a familiar stranger",eyebrow:"MEMORY ANOMALY DETECTED",headline:"THE DRAWING JUST MOVED.",body:"The Genesis identity brings a name back to the page. Pip remembers a door at the sea—and a witness hidden beneath Freewake. The archive detects the restored testimony. Footsteps stop outside.",speaker:"pip",line:"we didn't cause it. find the seal beneath the harbor. someone there remembers the rest."},
 {k:"s4",number:"04 / the redactors",eyebrow:"THE PALE ACCORD / PURSUIT ORDER",headline:"SAVE THE WITNESS. LOSE THE TRUTH.",body:"Pip is hidden in your folio. Sera's Redactors begin erasing the recovered testimony. Its margin carries your brother's harbor coordinates. There is time for one escape plan.",speaker:"sera",line:"leave the record. nobody needs to remember this."},
 {k:"s5",number:"05 / the sealed witness",eyebrow:"BENEATH FREEWAKE / THE SEALED WITNESS",headline:"SOMEONE STILL REMEMBERS.",body:"Following Pip's memory of the sea, you reach a bronze seal beneath Freewake. His account survives here in fragments. What you carried out of the archive determines how much you can reconstruct.",speaker:"memory",line:"we ran toward the sea, not away from it. we were trying to close the door."},
 {k:"s6",number:"06 / the photograph",eyebrow:"FREEWAKE HARBOR / DEPARTURE",headline:"THE TRUTH HAS A PRICE.",body:"The seal points to Rook, a smuggler sheltering witnesses. He hands Neri a photograph of her missing brother beside Chog drawings. The Accord called them perpetrators. Their accounts point instead to witnesses—and her brother was helping them disappear.",speaker:"rook",line:"your brother asked me to keep this. he said you'd know what to look for."},
] as const;
const sceneArtwork = [
 {src:"archive-scene.webp",alt:"Neri investigates the erased CHOG records in the forbidden archive."},
 {src:"archive-scene.webp",alt:"The restricted blue filing cabinet and its sealed drawer."},
 {src:"awakening-reaction.webp",alt:"Neri reacts to the awakening of the living drawing."},
 {src:"redactors-scene.webp",alt:"Neri shelters behind the archive cabinet as Redactor silhouettes enter the doorway."},
 {src:"harbor-witness.webp",alt:"A bronze memory seal in a flooded blue-stone vault beneath the harbor."},
 {src:"harbor-departure.webp",alt:"Neri receives a photograph beside a moored boat at Freewake harbor."},
] as const;
export default function ChapterExperience(){
 const reconstruction=usePipReconstruction();
 const [progress,setProgress]=useState(INITIAL_PROGRESS);
 const sceneRef=useRef<HTMLDivElement>(null);
 const previousIndex=useRef<number | null>(null);
 const {index,unlocked,route}=progress;
 const outcome=consequence(route);
 const {cue}=useStoryAudio();
 useSoundscape(index===3?"quiet":index>=4?"harbor":"archive");
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
 function next(){if(index>=2&&!reconstruction.receipt)return;cue(140,.18,.025);setProgress(advanceProgress);}
 function check(){if(code.trim()==="1969"){setProgress(p=>({...p,unlocked:true}));}else setWrong(v=>v+1);}
 if(!restored || !reconstruction.ready)return <section className={styles.reader} aria-busy="true"><p role="status">Opening your chapter…</p></section>;
 if(index>=2&&!reconstruction.receipt)return <PipReconstruction onRecovered={receipt=>{reconstruction.complete(receipt);requestAnimationFrame(()=>sceneRef.current?.focus({preventScroll:true}));}}/>;
 return <section className={styles.reader} data-scene={index+1} aria-label="Chapter One reader">
   <div className={styles.backdrop} aria-hidden="true">
     <img key={sceneArtwork[index].src} src={`/private-review/${sceneArtwork[index].src}`} alt="" onError={()=>setMissingArt(true)}/>
   </div>
   <div className={styles.chapterTop}><Link href="/" className={styles.brand}>CHOG <span>1969</span></Link><div>CHAPTER 01 <span>{String(index+1).padStart(2,"0")} / 06</span></div><StorySoundControl/><button onClick={()=>{if(window.confirm("Restart Chapter One? This replaces your saved progress and local reconstruction.")){reconstruction.reset();setProgress({...INITIAL_PROGRESS});setCode("");setWrong(0);}}}>Restart chapter</button></div>
   <p className={styles.saveStatus} role="status">{saveError || reconstruction.storageError?"Progress could not be saved on this device. Keep this tab open to continue.":"Progress saved on this device · no sound required"}</p>
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
     {index!==4&&index!==3&&<div className="speech"><span className="speech-speaker">{scene.speaker}</span><p>“{scene.line}”</p></div>}
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
       <ErasureEncounter route={route} onChoose={choice=>setProgress(p=>p.route?p:{...p,route:choice})}/>
     </div>}
     {index>=4&&route&&<p className="unlock-message">{route==="keep"?"In your satchel: the rescued records. Behind you: a witness who knows your face.":"In your satchel: ash where a record should be. For now, the Redactors have no face to follow."}</p>}
     {index===4&&outcome&&<><p className={styles.evidenceState}>{outcome.evidence.toUpperCase()} / {outcome.notice}</p><MemoryEcho line={outcome.memory}/><p className={styles.fictionNote}>The seal gives you Rook's name. He shelters the witnesses at the departure pier.</p><div className="interaction"><strong>THE ORIGINALS SURVIVE</strong><p>Beyond the story: explore the original CHOG collectibles on Monad.</p><Link href="/archive" className="link">Inspect Genesis originals</Link></div></>}
     {index===5&&outcome&&<div className="interaction"><strong>END OF CHAPTER ONE</strong><Photograph route={route} onMissingArt={()=>setMissingArt(true)}/><div className={styles.casebook}><small>THE NEXT CASE / PLANNED CHAPTERS — NOT YET PLAYABLE</small><h2>WHY WAS HER BROTHER HELPING THE WITNESSES DISAPPEAR?</h2><p>{outcome.lead}</p><ol><li><span>02</span><div><strong>The City That Never Existed</strong><p>{route==="keep"?"Follow the surviving coordinates. Someone will be waiting.":"Find another way in. The map burned with the record."}</p></div></li><li><span>03</span><div><strong>The Other Witness</strong><p>Another account challenges Pip's version of the catastrophe.</p></div></li><li><span>04</span><div><strong>Who Gets Remembered?</strong><p>Exposing the truth may expose the people it protects.</p></div></li></ol><p className={styles.fictionNote}>A planned story direction, not a release promise. Replay Chapter One to uncover the other evidence outcome.</p></div><Link href="/archive" className="link">Explore the surviving seals</Link></div>}
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
