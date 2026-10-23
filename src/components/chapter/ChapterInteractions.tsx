"use client";

import {useState} from "react";
import type {EscapeRoute} from "./progress";
import styles from "./chapter.module.css";

/** Interactive ink props, not a substitute for the approved character/scene art. */
export function DrawerEvidence({unlocked}: {unlocked: boolean}) {
  const [inspected,setInspected]=useState<"record"|"manifest"|null>(null);
  return <div className={styles.evidence}>
    <svg viewBox="0 0 600 170" role="img" aria-label={unlocked?"The archive drawer is open; its seal is broken.":"An archive drawer with a keyhole between two paper labels."}>
      <path d="M18 15H582V152H18Z M27 24H573V143H27Z" fill="#e4d9c7" stroke="currentColor" strokeWidth="3"/>
      <path d={unlocked?"M160 75L175 50H425L440 75V124H160Z":"M160 60H440V124H160Z"} fill="#f8f3e8" stroke="currentColor" strokeWidth="4"/>
      <path d="M242 80H358V102H242Z" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="300" cy="91" r="5" fill={unlocked?"#794cfa":"currentColor"}/>
      <path d="M35 36L140 27 M450 132L560 125 M42 134L131 130" stroke="currentColor"/>
      <text x="300" y="46" textAnchor="middle" fontSize="13" fontFamily="monospace">{unlocked?"SEAL BROKEN":"RESTRICTED / TWO RECORDS"}</text>
    </svg>
    <div className={styles.evidenceTabs} aria-label="Inspect the drawer evidence">
      <button type="button" aria-pressed={inspected==="record"} onClick={()=>setInspected("record")}>Inspect first record</button>
      <button type="button" aria-pressed={inspected==="manifest"} onClick={()=>setInspected("manifest")}>Turn shipment label</button>
    </div>
    <p className={styles.evidenceNote} role="status">{inspected==="record"?"FIRST RECORD · 19 — the first two digits are pencilled into the margin.":inspected==="manifest"?"SHIPMENT LABEL · 69 — two more digits, beneath a torn corner.":"Tap each paper label. Someone left you a way in."}</p>
  </div>;
}

export function EscapePlan({route,onChoose}: {route: EscapeRoute; onChoose: (route: Exclude<EscapeRoute,null>)=>void}) {
  return <div className={styles.escapePlan}>
    <div className="choice-grid" role="group" aria-label="Choose Neri's escape route">
      <button onClick={()=>onChoose("keep")} disabled={route!==null} aria-pressed={route==="keep"} className="choice">Keep the evidence <span>Take maintenance · your face may be seen</span></button>
      <button onClick={()=>onChoose("burn")} disabled={route!==null} aria-pressed={route==="burn"} className="choice">Burn the records <span>Take the stairs · lose a clue to your brother</span></button>
    </div>
  </div>;
}
