"use client";

import Link from "next/link";
import {useEffect, useRef, useState, type CSSProperties} from "react";
import {INITIAL_OPENING, OPENING_KEY, parseOpening} from "./chapter/opening-progress";
import {parseProgress, SAVE_KEY} from "./chapter/progress";
import styles from "./chapter/opening.module.css";

const clamp = (n: number) => Math.max(0, Math.min(1, n));

export default function ArchiveOpening() {
  const [save, setSave] = useState({...INITIAL_OPENING});
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [camera, setCamera] = useState(0);
  const [pull, setPull] = useState(0);
  const [beat, setBeat] = useState(0);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [missingArt, setMissingArt] = useState(false);
  const [help, setHelp] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inspected, setInspected] = useState<"record" | "shipment" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const audioOn = useRef(false);
  const hold = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStart = useRef<number | null>(null);
  const travelStart = useRef<number | null>(null);
  const openRef = useRef(false);
  const handle = useRef<HTMLButtonElement>(null);
  const atDesk = camera >= .98;

  function cue(frequency: number, duration: number, volume = .035) {
    const ctx = audio.current;
    if (!ctx || !audioOn.current || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .6, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
    oscillator.onended = () => {oscillator.disconnect(); gain.disconnect();};
  }

  async function toggleSound() {
    if (sound) {
      audioOn.current = false;
      setSound(false);
      await audio.current?.suspend();
      return;
    }
    try {
      if (!audio.current || audio.current.state === "closed") audio.current = new AudioContext();
      await audio.current.resume();
      audioOn.current = true;
      setSound(true);
      setSoundError(false);
      cue(90, 1.2, .02);
    } catch {setSoundError(true);}
  }

  useEffect(() => {
    try {
      const restored = parseOpening(localStorage.getItem(OPENING_KEY));
      setSave(restored);
      openRef.current = restored.opened;
      if (restored.record || restored.shipment) setCamera(1);
      if (restored.opened) {setPull(1); setBeat(4);}
    } catch {setSaveError(true);}
    setReady(true);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      if (hold.current) clearInterval(hold.current);
      void audio.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {localStorage.setItem(OPENING_KEY, JSON.stringify(save)); setSaveError(false);}
    catch {setSaveError(true);}
  }, [save, ready]);

  useEffect(() => {
    if (!save.opened || beat === 4) return;
    const timers = [
      setTimeout(() => {setBeat(1); cue(150, .3);}, reduced ? 0 : 500),
      setTimeout(() => {setBeat(2); cue(330, 1);}, reduced ? 100 : 1500),
      setTimeout(() => {setBeat(3); cue(660, 1.6);}, reduced ? 200 : 2800),
      setTimeout(() => setBeat(4), reduced ? 300 : 4300),
    ];
    return () => timers.forEach(clearTimeout);
    // A single timeline starts when the drawer opens, not on each beat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save.opened, reduced]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (help || save.opened) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      setCamera(value => clamp(value + Math.max(-180, Math.min(180, delta)) / 1700));
    };
    element.addEventListener("wheel", wheel, {passive: false});
    return () => element.removeEventListener("wheel", wheel);
  }, [help, save.opened]);

  function stopHold() {
    if (hold.current) clearInterval(hold.current);
    hold.current = null;
    dragStart.current = null;
    if (!openRef.current) setPull(0);
  }

  function openDrawer() {
    if (!save.aligned || openRef.current) return;
    if (hold.current) clearInterval(hold.current);
    hold.current = null;
    dragStart.current = null;
    openRef.current = true;
    setPull(1);
    setSave(value => ({...value, opened: true}));
    cue(75, .6, .06);
  }

  function startHold() {
    if (!save.aligned || openRef.current || hold.current) return;
    const start = performance.now();
    hold.current = setInterval(() => {
      const amount = clamp((performance.now() - start) / 1100);
      setPull(amount);
      if (amount >= 1) openDrawer();
    }, 16);
  }

  function inspect(which: "record" | "shipment") {
    setInspected(which);
    setSave(value => ({...value, [which]: true}));
    cue(190, .14, .015);
  }

  function continueChapter(event: React.MouseEvent<HTMLAnchorElement>) {
    try {
      const progress = parseProgress(localStorage.getItem(SAVE_KEY));
      localStorage.setItem(SAVE_KEY, JSON.stringify({...progress, unlocked: true, index: Math.max(2, progress.index)}));
    } catch {
      event.preventDefault();
      setSaveError(true);
      // The existing reader remains playable with blocked storage, including its drawer.
      window.location.assign("/chapter/1");
    }
  }

  function restart() {
    if (!confirm("Replay this opening? Your later chapter choices will not be erased.")) return;
    stopHold();
    openRef.current = false;
    setSave({...INITIAL_OPENING});
    setCamera(0); setPull(0); setBeat(0); setInspected(null);
  }

  const instruction = !atDesk ? "Scroll to enter. Something was left behind."
    : !save.record || !save.shipment ? "Two records survived. Inspect both."
    : !save.aligned ? "19, then 69. Set the drawer’s index."
    : !save.opened ? "Pull the handle toward you. Or hold to open."
    : beat < 4 ? "That is not an empty record."
    : "Footsteps. We are no longer alone.";
  const sceneStyle = {"--camera": camera, "--pull": pull} as CSSProperties;

  return <div ref={root} className={styles.experience} style={sceneStyle} data-beat={beat} data-opened={save.opened} data-ready={ready}
    onPointerDown={event => {
      if ((event.target as HTMLElement).closest("button,a,dialog") || save.opened) return;
      travelStart.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      if (travelStart.current === null) return;
      const delta = travelStart.current - event.clientY;
      travelStart.current = event.clientY;
      setCamera(value => clamp(value + delta / 700));
    }}
    onPointerUp={() => {travelStart.current = null;}}
    onPointerCancel={() => {travelStart.current = null;}}>
    <nav className={styles.toolbar} aria-label="Reader controls">
      <span className={styles.brand}>CHOG <i>/</i> 1969</span>
      <span className={styles.chapterLabel}>I — THE DRAWING THAT REMEMBERED</span>
      <button onClick={toggleSound} aria-pressed={sound}>{sound ? "Sound on" : "Sound off"}</button>
      <button onClick={() => setHelp(!help)} aria-expanded={help}>Guide</button>
      <button onClick={restart}>Replay</button>
      <Link href="/chapter/1">Saved chapter ↗</Link>
    </nav>

    <div className={styles.viewport} aria-label="Forbidden archive, interactive opening">
      <div className={styles.world}>
        <div className={styles.room} aria-hidden="true">
          <div className={styles.backWall}><span>PALE ACCORD<br/><b>DEPARTMENT OF CORRECTIONS</b></span></div>
          <div className={styles.floor}/>
          <div className={styles.ceiling}/>
          <div className={styles.light}/>
          <div className={styles.leftCabinets}>{Array.from({length: 18}, (_, i) => <div key={i}><span>{String(1801 + i).padStart(4, "0")}</span><i/></div>)}</div>
          <div className={styles.rightCabinets}>{Array.from({length: 18}, (_, i) => <div key={i}><span>{1900 + i}</span><i/></div>)}</div>
          <div className={styles.wallNotice}>ALL RECORDS<br/>ARE ACCOUNTED FOR.<br/><small>Discrepancies must be reported.</small></div>
          <div className={styles.doorframe}/><div className={styles.doorframeRight}/>
        </div>

        <div className={styles.neri} aria-hidden="true">
          <img src="/private-review/neri.png" alt="" onError={() => setMissingArt(true)}/>
        </div>
        <div className={styles.entranceCaption} style={{opacity: clamp(1 - camera * 2)}} aria-hidden={camera >= .5}>
          <span>VEYRA. CENTRAL ARCHIVE. AFTER HOURS.</span>
          <p>They erased a people.<br/>They missed a drawer.</p>
        </div>

        <div className={styles.desk} data-active={atDesk} data-open={save.opened}>
          <div className={styles.deskTop}/>
          <div className={styles.deskLabel}>RESTRICTED WING / CABINET 19</div>
          <div className={styles.papers}>
            <button className={styles.record} onClick={() => inspect("record")} disabled={!atDesk || save.opened} aria-pressed={save.record} aria-label="Inspect first record">
              <span>RECORD OF ERASURE</span>
              <b>CHOG</b><i className={styles.redaction}/><i className={styles.redaction}/>
              <small>{save.record ? "First record · 19" : "Lift the redacted record"}</small>
              {save.record && <strong>19</strong>}
            </button>
            <button className={styles.shipment} onClick={() => inspect("shipment")} disabled={!atDesk || save.opened} aria-pressed={save.shipment} aria-label="Inspect shipment label">
              <span>INCOMING / CONFISCATED</span><i className={styles.redaction}/>
              <small>{save.shipment ? "Shipment · 69" : "Turn the shipment label"}</small>
              {save.shipment && <strong>69</strong>}
            </button>
          </div>
          <div className={styles.cabinetBody}/>
          <div className={styles.drawerInterior}><span>NO RECORD EXISTS</span></div>
          <div className={styles.drawer}>
            <span className={styles.scraped}>ENTRY REMOVED BY ORDER OF THE ACCORD</span>
            <button className={styles.index} disabled={!atDesk || !save.record || !save.shipment || save.aligned}
              onClick={() => {setSave(value => ({...value, aligned: true})); cue(240, .25); handle.current?.focus();}}
              aria-label="Combine 19 and 69 to set drawer index">
              <span>{save.aligned ? "19 | 69" : save.record && save.shipment ? "19 + 69" : "— | —"}</span>
              <small>{save.aligned ? "RELEASED" : "SET INDEX"}</small>
            </button>
            <button ref={handle} className={styles.handle} disabled={!atDesk || !save.aligned || save.opened} aria-label="Pull drawer handle; drag down or hold Enter"
              onPointerDown={event => {event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); dragStart.current = event.clientY; startHold();}}
              onPointerMove={event => {if (dragStart.current === null) return; const value = clamp((event.clientY - dragStart.current) / 120); setPull(value); if (value >= 1) openDrawer();}}
              onPointerUp={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold}
              onKeyDown={event => {if (event.key === "Enter" || event.key === " ") {event.preventDefault(); if (!event.repeat) startHold();}}}
              onKeyUp={event => {if (event.key === "Enter" || event.key === " ") stopHold();}}
              onBlur={stopHold}><span/><i/></button>
          </div>

          <div className={styles.folio} aria-hidden={!save.opened}>
            <div className={styles.folioArt}>
              <img src="/private-review/pip.webp" alt="Unchanged CHOG #545 artwork: yellow Chog, happy eyes, MMGA cap and striped shirt" onError={() => setMissingArt(true)}/>
              <span>GENESIS / 545</span>
            </div>
            <div className={styles.folioCover}><span>DESTROY<br/>WITHOUT<br/>READING.</span><small>PALE ACCORD / ORDER 1969</small></div>
          </div>
        </div>
      </div>

      <div className={styles.reaction} data-visible={beat >= 3} aria-hidden={beat < 3}>
        <img src={beat >= 3 ? "/private-review/neri-curious.jpg" : "/private-review/neri-serious.jpg"} alt="Neri’s curious expression, cropped from the exact approved reference" onError={() => setMissingArt(true)}/>
        <p>…You’re supposed to be extinct.</p>
      </div>
      <div className={styles.dialogue} aria-live="polite" data-visible={atDesk || save.opened}>
        <span>{beat >= 4 ? "PIP" : "NERI"}</span>
        <p>{beat >= 4 ? "“Excuse me? I’m a legendary being of unimaginable power.”"
          : beat >= 2 ? "“The drawing just moved.”"
          : inspected === "record" ? "“Nineteen. Someone scratched it beneath the ink.”"
          : inspected === "shipment" ? "“Sixty-nine. These belong together.”"
          : "“If they’re all gone, why are we still hunting them?”"}</p>
      </div>
      {beat >= 4 && <div className={styles.nextBeat}>
        <Link href="/chapter/1" onClick={continueChapter}>Hide the drawing. Someone’s coming. <span>→</span></Link>
        <a href="https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1053" target="_blank" rel="noreferrer">Original CHOG #545 · token 1053 ↗</a>
        <small>Fictional awakening. No wallet or onchain action.</small>
      </div>}
    </div>

    <footer className={styles.readerFooter}>
      <div className={styles.position}><span>{save.opened ? "03" : atDesk ? "02" : "01"}</span> / 03 <i style={{width: (save.opened ? 100 : atDesk ? 66 : 5 + camera * 55) + "%"}}/></div>
      <p role="status">{instruction}</p>
      {!atDesk && <button onClick={() => setCamera(value => clamp(value + (reduced ? 1 : .25)))}>Move closer ↓</button>}
      <small>PRIVATE REVIEW · STAGING, NOT FINAL SCENE ART</small>
    </footer>
    {(saveError || soundError || missingArt) && <div className={styles.warning} role="status">
      {missingArt ? "Private review artwork is missing. Run the documented local art preparation; no substitute is shown. " : ""}
      {saveError ? "Storage unavailable. Keep this tab open; the saved chapter may require its original puzzle again. " : ""}
      {soundError ? "Audio unavailable. The story remains playable without sound." : ""}
    </div>}
    {help && <aside className={styles.guide} aria-label="Reader guide">
      <button onClick={() => setHelp(false)}>Close guide ×</button>
      <h2>Leave no record.</h2>
      <p>Scroll, swipe upward, or use “Move closer” to enter. Inspect both papers. Set 19 + 69 on the brass index. Drag the handle downward, or hold it for a second. Keyboard: Tab to the handle and hold Enter or Space.</p>
      <p>Sound is opt-in: original synthesized mechanical cues, not a finished soundscape. Reduced-motion settings are respected. Replay resets only this opening, not your later keep/burn choice.</p>
      <p>Art boundary: exact Neri reference crops and unchanged CHOG #545; temporary CSS room and drawer. Finished layered scene art and acting poses are not supplied. No rights or holder consent inferred.</p>
      <Link href="/archive">Read-only Genesis archive ↗</Link>
    </aside>}
  </div>;
}
