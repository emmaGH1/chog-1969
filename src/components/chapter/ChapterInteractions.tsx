"use client";

import {useEffect,useRef,useState} from "react";
import type {EscapeRoute} from "./progress";
import styles from "./chapter.module.css";
import {consequence} from "./consequences";
import {useStoryAudio} from "../StoryAudio";

/** Interactive ink props, not a substitute for the approved character/scene art. */
export function DrawerEvidence({unlocked}: {unlocked: boolean}) {
  const [inspected,setInspected]=useState<"record"|"manifest"|null>(null);
  return <div className={styles.evidence}>
    <p className={styles.evidenceState}>{unlocked?"SEAL BROKEN / RECORDS RECOVERED":"RESTRICTED / TWO RECORDS"}</p>
    <div className={styles.evidenceTabs} aria-label="Inspect the drawer evidence">
      <button type="button" aria-pressed={inspected==="record"} onClick={()=>setInspected("record")}>Inspect first record</button>
      <button type="button" aria-pressed={inspected==="manifest"} onClick={()=>setInspected("manifest")}>Turn shipment label</button>
    </div>
    <p className={styles.evidenceNote} role="status">{inspected==="record"?"FIRST RECORD · 19 — the first two digits are pencilled into the margin.":inspected==="manifest"?"SHIPMENT LABEL · 69 — two more digits, beneath a torn corner.":"Tap each paper label. Someone left you a way in."}</p>
  </div>;
}

export function MemoryEcho({line}: {line: string}) {
  const {cue}=useStoryAudio();
  const [holding,setHolding]=useState(false);
  const [revealed,setRevealed]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  useEffect(()=>{if(revealed)cue(330,1,.035);},[revealed,cue]);
  useEffect(()=>{
    if(!holding||revealed)return;
    let frame=0;
    const start=performance.now();
    function tick(now:number){
      const amount=Math.min(1,(now-start)/1000);
      setElapsed(amount);
      if(amount===1){setRevealed(true);setHolding(false);}
      else frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[holding,revealed]);
  function release(){setHolding(false);setElapsed(0);}
  return <div className={styles.memoryEcho}>
    <button type="button" className={styles.sealTouch} aria-label={revealed?"Memory heard":"Hold the seal to hear its memory"}
      aria-describedby="memory-instruction" aria-disabled={revealed} data-revealed={revealed}
      onPointerDown={event=>{if(event.button!==0||revealed)return;event.currentTarget.setPointerCapture(event.pointerId);setHolding(true);}}
      onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
      onKeyDown={event=>{if(event.key===" "||event.key==="Enter"){event.preventDefault();if(!event.repeat&&!revealed)setHolding(true);}}}
      onKeyUp={event=>{if(event.key===" "||event.key==="Enter"){event.preventDefault();release();}}}
      onBlur={release}>
      <span aria-hidden="true">{revealed?"MEMORY HEARD":holding?"LISTENING":"HOLD THE SEAL"}</span>
      <span className={styles.listenTrack} aria-hidden="true"><span style={{transform:`scaleX(${revealed?1:elapsed})`}}/></span>
    </button>
    <p id="memory-instruction">{revealed?"The Accord erased the names. Not every voice.":"Hold the bronze seal for a moment. Something is still alive behind it."}</p>
    <div className={styles.memoryWords} role="status">
      {revealed?<blockquote><small>A SURVIVING MEMORY</small><p>“{line}”</p></blockquote>:<p className={styles.unheard}>A voice on the other side of the silence.</p>}
    </div>
    {!revealed&&<button type="button" className={styles.back} onClick={()=>setRevealed(true)}>Read the memory without holding</button>}
    <small className={styles.fictionNote}>A fictional memory, not an NFT unlock.</small>
  </div>;
}

export function Photograph({route,onMissingArt}: {route:EscapeRoute;onMissingArt: ()=>void}) {
  const outcome=consequence(route);
  const {cue}=useStoryAudio();
  const [turn,setTurn]=useState(0);
  const [drag,setDrag]=useState(0);
  const [dragging,setDragging]=useState(false);
  const [examined,setExamined]=useState(false);
  const pointer=useRef<{id:number;x:number;width:number;degrees:number}|null>(null);
  const ignoreClick=useRef(false);
  const flipped=Math.abs(turn%2)===1;
  function turnPhoto(direction:number){
    cue(180,.18,.025);
    setTurn(value=>value+direction);
    setExamined(true);
  }
  function cancelDrag(){pointer.current=null;setDrag(0);setDragging(false);}
  return <>
    <figure className={styles.photoStage}>
      <button type="button" className={styles.photograph} aria-label={flipped?"Turn photograph to the image":"Turn photograph to read the inscription"}
        aria-describedby="photo-instruction" data-dragging={dragging} style={{transform:`rotateY(${turn*180+drag}deg)`}}
        onClick={event=>{if(ignoreClick.current&&event.detail!==0){ignoreClick.current=false;return;}ignoreClick.current=false;turnPhoto(1);}}
        onPointerDown={event=>{
          if(event.button!==0)return;
          ignoreClick.current=false;
          pointer.current={id:event.pointerId,x:event.clientX,width:event.currentTarget.offsetWidth,degrees:0};
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event=>{
          const start=pointer.current;
          if(!start||start.id!==event.pointerId)return;
          const delta=event.clientX-start.x;
          if(Math.abs(delta)>12)ignoreClick.current=true;
          if(!ignoreClick.current)return;
          start.degrees=Math.max(-170,Math.min(170,delta/start.width*180));
          setDragging(true);setDrag(start.degrees);
        }}
        onPointerUp={event=>{
          const start=pointer.current;
          if(!start||start.id!==event.pointerId)return;
          if(Math.abs(start.degrees)>=45)turnPhoto(Math.sign(start.degrees));
          cancelDrag();
        }}
        onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
        <span className={styles.photoFront} aria-hidden={flipped}>
          <img src="/private-review/brother-photograph.webp" alt="Fictional photograph: Neri's brother, seen from behind, studying sketches of CHOG outcasts. Scene interpretation, not original NFT artwork." draggable={false} onError={onMissingArt}/>
          <span>FREEWAKE / THE MISSING YEARS</span>
        </span>
        <span className={styles.photoBack} aria-hidden={!flipped}>
          <small>FOR NERI</small>
          <span>{outcome?.inscription}</span>
          <span className={styles.photoBackRule}/>
          <small>KEEP LOOKING.</small>
        </span>
      </button>
      <figcaption id="photo-instruction">Drag sideways or tap to turn. Keyboard: Enter or Space.</figcaption>
    </figure>
    <div className={styles.photoAftermath} role="status">
      {examined?<><small>MEANWHILE, AT THE ARCHIVE</small><div className={styles.pursuitNotice} data-route={route}><span>{outcome?.notice}</span><strong>{route==="keep"?"WANTED":"IDENTITY UNKNOWN"}</strong><p>{route==="keep"?"NERI / CHOG 545 / LAST SEEN: FREEWAKE":"NO RELIABLE DESCRIPTION / SEARCH THE HARBOR"}</p></div><p>{outcome?.aftermath}</p><strong>Next: the city that never existed.</strong></>:<p>Turn the photograph. Her brother left more than an image.</p>}
    </div>
  </>;
}
