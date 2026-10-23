"use client";
import {useEffect,useRef,useState,type PointerEvent as ReactPointerEvent} from "react";
import Link from "next/link";
import {PIP_TOKEN,readPipIdentity,reconstruct,STOPS,wrapStop,type PipIdentity,type Reconstruction} from "./pip-reconstruction";
import styles from "./reconstruction.module.css";
import {StorySoundControl,useStoryAudio,useSoundscape} from "../StoryAudio";

function IdentityRing({kind,value,target,position,index,onChange}:{kind:string;value:string;target:number;position:number;index:number;onChange:(value:number)=>void}) {
  const drag=useRef<{id:number;angle:number;distance:number;start:number}|null>(null);
  const moved=useRef(false);
  const aligned=position===target;
  function angle(event:ReactPointerEvent<HTMLButtonElement>) {
    const rect=event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY-rect.top-rect.height/2,event.clientX-rect.left-rect.width/2)*180/Math.PI;
  }
  return <button type="button" role="slider" className={styles.ring} data-ring={index} data-aligned={aligned}
    aria-label={kind+" identity ring"} aria-valuemin={1} aria-valuemax={STOPS} aria-valuenow={position+1}
    aria-valuetext={`${value}; position ${position+1} of 12; identity mark ${target+1}; ${aligned?"aligned":"not aligned"}`}
    aria-describedby="press-instructions"
    onPointerDown={event=>{
      if(event.button!==0)return;
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current={id:event.pointerId,angle:angle(event),distance:0,start:position};moved.current=false;
    }}
    onPointerMove={event=>{
      const current=drag.current;
      if(!current || current.id!==event.pointerId)return;
      const next=angle(event);
      let delta=next-current.angle;
      if(delta>180)delta-=360;if(delta < -180)delta+=360;
      current.distance+=delta;current.angle=next;
      if(Math.abs(current.distance)>5)moved.current=true;
      onChange(wrapStop(current.start+Math.round(current.distance/30)));
    }}
    onPointerUp={()=>{drag.current=null;}}
    onPointerCancel={()=>{if(drag.current)onChange(drag.current.start);drag.current=null;moved.current=true;}}
    onLostPointerCapture={()=>{drag.current=null;}}
    onClick={event=>{if(moved.current && event.detail!==0){moved.current=false;return;}moved.current=false;onChange(wrapStop(position+1));}}
    onKeyDown={event=>{
      const directions:Record<string,number>={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1};
      if(event.key in directions){event.preventDefault();onChange(wrapStop(position+directions[event.key]));}
      if(event.key==="Home" || event.key==="End"){event.preventDefault();onChange(event.key==="Home"?0:11);}
    }}>
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="94" className={styles.track}/>
      {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30} 100 100)`}>
        <path d="M100 8V15" className={styles.tick}/>
        <text x="100" y="25" className={styles.number}>{i+1}</text>
      </g>)}
      <g transform={`rotate(${target*30} 100 100)`} className={styles.target}><path d="M94 1L100 9L106 1"/><path d="M100 26V37"/></g>
      <g transform={`rotate(${position*30} 100 100)`} className={styles.needle}><path d="M94 34L100 25L106 34Z"/><path d="M100 34V46"/></g>
    </svg>
  </button>;
}

export default function PipReconstruction({onRecovered,onLeave}:{onRecovered:(receipt:Reconstruction)=>void;onLeave?:()=>void}) {
  const {cue}=useStoryAudio();
  useSoundscape("press");
  const [identity,setIdentity]=useState<PipIdentity|null>(null);
  const [positions,setPositions]=useState<number[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [imageIndex,setImageIndex]=useState(0);
  const [missingReference,setMissingReference]=useState(false);
  const [restored,setRestored]=useState(false);
  const abort=useRef<AbortController|null>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();return ()=>abort.current?.abort();},[]);
  async function read() {
    abort.current?.abort();
    const controller=new AbortController();abort.current=controller;
    setLoading(true);setError("");setIdentity(null);setPositions([]);setImageIndex(0);
    try {
      const response=await fetch("/api/nft/"+PIP_TOKEN,{cache:"no-store",signal:controller.signal});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error || "The live Genesis read failed.");
      const found=readPipIdentity(data);
      if(controller.signal.aborted)return;
      setIdentity(found);
      setPositions(found.traits.map((trait,index)=>wrapStop(trait.target+3+index*2)));
    } catch(cause) {
      if(!controller.signal.aborted)setError(cause instanceof Error?cause.message:"The identity read failed. Retry without leaving the drawer.");
    } finally {if(!controller.signal.aborted)setLoading(false);}
  }
  const matched=identity?.traits.filter((trait,index)=>positions[index]===trait.target).length??0;
  const receipt=identity?reconstruct(identity,positions):null;
  return <section className={styles.press} aria-label="Pip identity reconstruction">
    <header className={styles.header}><Link href="/" onClick={onLeave?event=>{event.preventDefault();onLeave();}:undefined}>CHOG <span>1969</span></Link><span>THE ERASURE PRESS / INSIDE THE DRAWER</span><StorySoundControl/><small>READ ONLY · NO WALLET</small></header>
    <div className={styles.layout}>
      <aside className={styles.source}>
        <span className={styles.eyebrow}>THE ACCORD SAYS HE NEVER EXISTED.</span>
        <h1 ref={heading} tabIndex={-1}>MAKE HIM<br/><em>EXIST AGAIN.</em></h1>
        <div className={styles.sourceArt}>
          {!identity?(missingReference?<p>Original reference artwork unavailable. Read the live record below; no substitute is shown.</p>:<img src="/private-review/pip.webp" alt="Original CHOG #545 reference; live identity not yet read" onError={()=>setMissingReference(true)}/>)
            :identity.imageUrls[imageIndex]?<img src={identity.imageUrls[imageIndex]} alt="Original CHOG #545 artwork from the live Genesis metadata" referrerPolicy="no-referrer" onError={()=>setImageIndex(value=>value+1)}/>
            :<p>Original artwork could not load. The live traits below are still available; no substitute is shown.</p>}
          <span>GENESIS 1053 / CHOG #545</span>
        </div>
        {!identity?<><p>The ink erased his history. It didn’t erase his Genesis identity. Read the surviving record to cut a key for the press.</p>
          <button className={styles.readButton} onClick={()=>void read()} disabled={loading}>{loading?"READING MONAD…":"READ PIP’S GENESIS RECORD"}</button></>
          :<><dl className={styles.traits}>{identity.traits.map((trait,index)=><div key={trait.kind} data-aligned={positions[index]===trait.target}>
            <dt>{index+1} / {trait.kind}</dt><dd>{trait.value}<small>{positions[index]===trait.target?"Aligned":`Identity mark ${trait.target+1}`}</small></dd>
          </div>)}</dl><p className={styles.readStamp}>Live read · Monad 143 · block {identity.blockNumber}</p></>}
        <div role="status" className={styles.status}>{loading?"Reading the actual token and its metadata. No signature or transaction.":error}</div>
        <details className={styles.provenance}><summary>What is real? What is fiction?</summary>
          <p>Pip is token 1053 in the Genesis collection, displayed as CHOG #545. His Head, Body and Eyes traits set the three identity marks. Missing or different identity data cannot unlock this scene.</p>
          <p>The erasure, press and recovered memory are our fiction. This is a local story puzzle, not ownership proof or a change to the NFT. Collection metadata comes through IPFS gateways; its content hash is not independently verified. External artwork gateways may see your IP address.</p>
          {identity&&<><p>Read at {identity.checkedAt}. This read does not establish who is playing.</p>{identity.metadataSource&&<a href={identity.metadataSource} target="_blank" rel="noreferrer">Inspect source metadata</a>}</>}
          <Link href="/archive">Open the read-only dossier</Link>
        </details>
      </aside>
      <div className={styles.workbench}>
        <div className={styles.machineHeading}><span>IDENTITY-KEYED RECONSTRUCTION</span><b>{identity?`${matched} / 3 ALIGNED`:"NO IDENTITY READ"}</b></div>
        <div className={styles.machine} data-ready={!!identity} data-complete={matched===3}>
          <div className={styles.machinePlate}/>
          {identity?identity.traits.map((trait,index)=><IdentityRing key={trait.kind} {...trait} position={positions[index]} index={index}
            onChange={value=>{setPositions(current=>current.map((position,i)=>i===index?value:position));setRestored(false);if(value!==positions[index])cue(240+index*80,.07,.02);}}/>)
            :<div className={styles.sealed}><span>NO RECORD<br/>EXISTS.</span><small>PALE ACCORD / ORDER 1969</small></div>}
          {identity&&<button className={styles.imprint} disabled={!receipt} onClick={()=>{setRestored(true);cue(100,.7,.08);}} aria-label="Press to restore Pip’s erased record"><span>{restored?"RESTORED":receipt?"PRESS":"ALIGN"}</span><small>{restored?"ERASURE REVERSED":receipt?"REVERSE THE ERASURE":"THREE IDENTITY MARKS"}</small></button>}
        </div>
        <p id="press-instructions" className={styles.instructions}>{identity?"Drag each ring until its pink needle meets its blue identity mark. Click to turn one stop; keyboard: Tab to a ring, then arrow keys. All three must align before you press.":"The press cannot turn without his real identity. Read Pip’s Genesis record to begin."}</p>
        <div className={styles.memory} aria-live="polite" data-restored={restored}>
          {restored&&receipt?<><small>RECOVERED FRAGMENT / FICTION</small><blockquote>“Not the cause.<br/>The witness.”</blockquote><button className={styles.readButton} onClick={()=>onRecovered(receipt)}>WAKE PIP</button><p>Reconstruction saves on this device. No NFT is changed.</p></>
            :<><small>CONFISCATED TESTIMONY</small><p><span>████ ███ █████.</span><br/><span>███ ███████.</span></p></>}
        </div>
      </div>
    </div>
    <footer className={styles.footer}>YOUR CHAPTER AND ESCAPE CHOICE ARE SAFE. <span>RESTORE THE IDENTITY TO CONTINUE.</span></footer>
  </section>;
}
