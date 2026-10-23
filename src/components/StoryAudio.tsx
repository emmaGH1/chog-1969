"use client";

import {createContext,useCallback,useContext,useEffect,useRef,useState} from "react";
import styles from "./story-audio.module.css";

type Place="archive"|"press"|"pursuit"|"harbor"|"quiet";
type AudioState={enabled:boolean;volume:number;error:boolean;toggle:()=>void;setVolume:(value:number)=>void;cue:(frequency:number,duration:number,volume?:number)=>void;setPlace:(place:Place)=>void};
const Audio=createContext<AudioState|null>(null);

export function StoryAudioProvider({children}:{children:React.ReactNode}) {
  const [enabled,setEnabled]=useState(false),[volume,setVolume]=useState(.5),[error,setError]=useState(false);
  const [place,setPlace]=useState<Place>("archive");
  const context=useRef<AudioContext|null>(null),master=useRef<GainNode|null>(null);
  const active=useRef(false),level=useRef(.5);
  const cue=useCallback((frequency:number,duration:number,amount=.035)=>{
    const ctx=context.current,bus=master.current;
    if(!ctx||!bus||!active.current||ctx.state!=="running"||document.hidden)return;
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();
    oscillator.type=frequency<180?"triangle":"sine";
    oscillator.frequency.setValueAtTime(frequency,ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30,frequency*.6),ctx.currentTime+duration);
    gain.gain.setValueAtTime(0,ctx.currentTime);
    gain.gain.linearRampToValueAtTime(amount,ctx.currentTime+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    oscillator.connect(gain).connect(bus);oscillator.start();oscillator.stop(ctx.currentTime+duration);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  },[]);
  async function toggle(){
    if(active.current){active.current=false;setEnabled(false);await context.current?.suspend();return;}
    try{
      if(!context.current||context.current.state==="closed"){
        context.current=new AudioContext();master.current=context.current.createGain();
        master.current.connect(context.current.destination);
      }
      await context.current.resume();
      master.current!.gain.setValueAtTime(level.current,context.current.currentTime);
      active.current=true;setEnabled(true);setError(false);cue(220,.2,.025);
    }catch{setError(true);active.current=false;setEnabled(false);}
  }
  function changeVolume(value:number){
    level.current=value;setVolume(value);
    if(context.current&&master.current)master.current.gain.setTargetAtTime(value,context.current.currentTime,.03);
  }
  useEffect(()=>{
    const ctx=context.current,bus=master.current;
    if(!enabled||!ctx||!bus||place==="quiet")return;
    const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),samples=buffer.getChannelData(0);
    for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.2;
    const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    noise.buffer=buffer;noise.loop=true;filter.type="lowpass";
    filter.frequency.value=place==="harbor"?750:place==="pursuit"?420:190;
    gain.gain.value=place==="harbor"?.12:.07;
    noise.connect(filter).connect(gain).connect(bus);noise.start();
    const interval=place==="pursuit"?setInterval(()=>cue(64,.22,.09),900):null;
    return ()=>{if(interval)clearInterval(interval);noise.stop();noise.disconnect();filter.disconnect();gain.disconnect();};
  },[enabled,place,cue]);
  useEffect(()=>{
    function visibility(){
      const ctx=context.current;if(!ctx)return;
      if(document.hidden)void ctx.suspend();
      else if(active.current)void ctx.resume().catch(()=>{setError(true);});
    }
    document.addEventListener("visibilitychange",visibility);
    return ()=>{document.removeEventListener("visibilitychange",visibility);void context.current?.close();};
  },[]);
  return <Audio.Provider value={{enabled,volume,error,toggle,setVolume:changeVolume,cue,setPlace}}>{children}</Audio.Provider>;
}

export function useStoryAudio(){const value=useContext(Audio);if(!value)throw new Error("Story audio provider missing");return value;}
export function useSoundscape(place:Place){const {setPlace}=useStoryAudio();useEffect(()=>{setPlace(place);},[place,setPlace]);}
export function StorySoundControl(){
  const audio=useStoryAudio();
  return <div className={styles.controls}>
    <button type="button" onClick={audio.toggle} aria-pressed={audio.enabled}>{audio.enabled?"Sound on":"Sound off"}</button>
    {audio.enabled&&<label>Volume<input aria-label="Sound volume" type="range" min="0" max="1" step=".05" value={audio.volume} onChange={e=>audio.setVolume(Number(e.target.value))}/></label>}
    {audio.error&&<span role="status">Sound unavailable. All cues remain visible.</span>}
  </div>;
}
