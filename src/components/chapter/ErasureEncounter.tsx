"use client";

import {useEffect,useRef,useState,type CSSProperties} from "react";
import type {EscapeRoute} from "./progress";
import {consequence} from "./consequences";
import {useStoryAudio,useSoundscape} from "../StoryAudio";
import styles from "./erasure.module.css";

type Phase="ready"|"active"|"paused"|"caught";
export default function ErasureEncounter({route,onChoose}:{route:EscapeRoute;onChoose:(route:Exclude<EscapeRoute,null>)=>void}){
  const [phase,setPhase]=useState<Phase>("ready"),[remaining,setRemaining]=useState(40),[timed,setTimed]=useState(true);
  const [selected,setSelected]=useState<Exclude<EscapeRoute,null>|null>(null),[held,setHeld]=useState(0),[holding,setHolding]=useState(false);
  const committed=useRef(false),finishRef=useRef<()=>void>(()=>{});
  const {cue}=useStoryAudio();
  useSoundscape(!route&&phase==="active"?"pursuit":"quiet");
  const result=consequence(route);
  useEffect(()=>{
    function hide(){if(document.hidden){setPhase(p=>p==="active"?"paused":p);setHolding(false);setHeld(0);}}
    document.addEventListener("visibilitychange",hide);return ()=>document.removeEventListener("visibilitychange",hide);
  },[]);
  useEffect(()=>{
    if(phase!=="active"||!timed||route)return;
    let last=performance.now();
    const interval=setInterval(()=>{const now=performance.now(),elapsed=(now-last)/1000;last=now;setRemaining(v=>Math.max(0,v-elapsed));},100);
    return ()=>clearInterval(interval);
  },[phase,timed,route]);
  useEffect(()=>{
    if(remaining===0&&phase==="active"&&!route){setPhase("caught");setHolding(false);setHeld(0);cue(50,.7,.07);}
  },[remaining,phase,route,cue]);
  useEffect(()=>{
    if(!holding||phase!=="active"||route)return;
    let frame=0;const start=performance.now();
    function tick(now:number){const amount=Math.min(1,(now-start)/900);setHeld(amount);if(amount===1)finishRef.current();else frame=requestAnimationFrame(tick);}
    frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
  },[holding,phase,route]);
  function start(withTimer:boolean){committed.current=false;setTimed(withTimer);setRemaining(40);setSelected(null);setHeld(0);setHolding(false);setPhase("active");cue(80,.4,.06);}
  function finish(){if(!selected||phase!=="active"||remaining<=0||committed.current||route)return;committed.current=true;setHolding(false);setHeld(1);onChoose(selected);cue(selected==="keep"?360:85,.8,.06);}
  finishRef.current=finish;
  function release(){setHolding(false);setHeld(0);}
  return <section className={styles.encounter} aria-label="The erasure encounter" data-phase={route?"resolved":phase} data-route={route??"none"} style={{"--loss":timed?1-remaining/40:.35} as CSSProperties}>
    <div className={styles.identity}><span>IDENTITY ANCHOR / GENESIS 1053</span><strong>CHOG #545 STILL EXISTS.</strong><small>The live record restored Pip. These threatened memories are fiction—not data stored in his NFT.</small></div>
    <div className={styles.docket}>
      <div className={styles.docketHeader}><span>TESTIMONY / 545</span><span>{result?result.evidence:phase==="active"?"ERASURE IN PROGRESS":"INTERCEPTED"}</span></div>
      <p><span>WE WERE NOT THE CAUSE.</span><span>WE WERE TRYING TO CLOSE THE DOOR.</span><span>HER BROTHER WAS THERE.</span></p>
      <div className={styles.redaction} aria-hidden="true"/>
      {result&&<strong className={styles.stamp}>{route==="keep"?"TESTIMONY SECURED":"IDENTIFYING RECORD BURNED"}</strong>}
    </div>
    {result?<div className={styles.outcome} role="status"><small>{result.notice}</small><h2>{route==="keep"?"THE TRUTH SURVIVES. YOUR COVER DOESN’T.":"YOU DISAPPEAR. SO DOES THE CLUE."}</h2><p>{result.lead}</p><p>Pip escaped with you. This choice is saved on this device.</p></div>:<>
      <div className={styles.clock}><span>{phase==="caught"?"THE DOOR SLAMS SHUT":phase==="paused"?"PAUSED":phase==="ready"?"READ THE COST BEFORE YOU BEGIN":timed?`${Math.ceil(remaining)} SECONDS UNTIL THE REDACTORS ARRIVE`:"UNTIMED / YOUR CHOICE STILL MATTERS"}</span>
        {(phase==="active"||phase==="paused")&&<button onClick={()=>{release();setPhase(phase==="paused"?"active":"paused");}}>{phase==="paused"?"Resume encounter":"Pause encounter"}</button>}
      </div>
      {phase==="ready"&&<p>Pip is safe in your folio. His testimony is not. Save the evidence and expose your face—or burn the identifying record and lose your brother’s coordinates. You cannot keep both.</p>}
      {phase==="caught"?<div role="status"><p>The Redactors reached the drawer. No choice or progress was erased. Retry from the interception.</p><button className={styles.primary} onClick={()=>start(timed)}>Retry interception</button><button className={styles.alternative} onClick={()=>start(false)}>Retry without timer</button></div>:<>
        <div className={styles.choices} role="group" aria-label="Choose what survives">
          <button disabled={phase!=="active"} aria-pressed={selected==="keep"} onClick={()=>{release();setSelected("keep");cue(180,.12);}}><b>Keep the evidence</b><span>Complete witness account.<br/>Your faces enter the wanted register.</span></button>
          <button disabled={phase!=="active"} aria-pressed={selected==="burn"} onClick={()=>{release();setSelected("burn");cue(120,.12);}}><b>Burn the records</b><span>Escape unidentified.<br/>Your brother’s coordinates are lost.</span></button>
        </div>
        {phase==="ready"?<div className={styles.actions}><button className={styles.primary} onClick={()=>start(true)}>Begin interception · 40 seconds</button><button className={styles.alternative} onClick={()=>start(false)}>Play without timer</button></div>:selected&&<div className={styles.actions}>
          <button className={styles.commit} disabled={phase!=="active"} aria-label={selected==="keep"?"Hold to secure the testimony":"Hold to burn the identifying record"}
            onPointerDown={e=>{if(e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);setHolding(true);}}
            onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onBlur={release}
            onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();if(!e.repeat)setHolding(true);}}}
            onKeyUp={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();release();}}}>
            <span>{selected==="keep"?"HOLD TO SECURE":"HOLD TO BURN"}</span><i style={{transform:`scaleX(${held})`}}/>
          </button>
          <button className={styles.alternative} disabled={phase!=="active"} onClick={finish}>Confirm choice without holding</button>
        </div>}
      </>}
    </>}
  </section>;
}
