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
  const [entered, setEntered] = useState(false);
  const cameraGoal = useRef(0);
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

  function moveCamera(value: number) {
    cameraGoal.current = clamp(value);
    if (reduced) setCamera(cameraGoal.current);
  }

  useEffect(() => {
    if (!entered) return;
    let frame: number;
    let previous = performance.now();
    const animate = (now: number) => {
      const blend = reduced ? 1 : 1 - Math.exp(-Math.min(now - previous, 50) / 140);
      previous = now;
      setCamera(value => Math.abs(cameraGoal.current - value) < .001
        ? cameraGoal.current : value + (cameraGoal.current - value) * blend);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [entered, reduced]);

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
      if (restored.record || restored.shipment) {setCamera(1); cameraGoal.current = 1;}
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
      if (!entered || help || save.opened) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      cameraGoal.current = clamp(cameraGoal.current + Math.max(-180, Math.min(180, delta)) / 1500);
    };
    element.addEventListener("wheel", wheel, {passive: false});
    return () => element.removeEventListener("wheel", wheel);
  }, [entered, help, save.opened]);

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
    cameraGoal.current = 0;
    setEntered(false);
    setCamera(0); setPull(0); setBeat(0); setInspected(null);
  }

  const instruction = !atDesk ? "Scroll to enter. Something was left behind."
    : !save.record || !save.shipment ? "Two records survived. Inspect both."
    : !save.aligned ? "19, then 69. Set the drawer’s index."
    : !save.opened ? "Pull the handle toward you. Or hold to open."
    : beat < 4 ? "That is not an empty record."
    : "Footsteps. We are no longer alone.";
  const sceneStyle = {"--camera": camera, "--pull": pull} as CSSProperties;

  return <div ref={root} className={styles.experience} style={sceneStyle} data-entered={entered} data-beat={beat} data-opened={save.opened} data-ready={ready}
    onPointerDown={event => {
      if (!entered || help || (event.target as HTMLElement).closest("button,a,aside") || save.opened) return;
      travelStart.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      if (travelStart.current === null) return;
      const delta = travelStart.current - event.clientY;
      travelStart.current = event.clientY;
      moveCamera(cameraGoal.current + delta / 600);
    }}
    onPointerUp={() => {travelStart.current = null;}}
    onPointerCancel={() => {travelStart.current = null;}}>
    <nav className={styles.toolbar} aria-label="Reader controls">
      <span className={styles.brand}>CHOG<span> / 1969</span></span>
      <span className={styles.chapterLabel}>{entered ? "CHAPTER 01 / THE FORBIDDEN ARCHIVE" : "AN INTERACTIVE MANGA"}</span>
      <button onClick={toggleSound} aria-pressed={sound}>{sound ? "Sound on" : "Sound off"}</button>
      <button onClick={() => setHelp(!help)} aria-expanded={help}>Guide</button>
      <button onClick={restart}>Replay</button>
      <Link href="/archive">The Genesis ↗</Link>
    </nav>

    <section className={styles.cover} aria-label="CHOG 1969 story cover" aria-hidden={entered} inert={entered || help}>
      <img className={styles.coverArt} src="/private-review/cover-scene.webp" alt="Neri at the forbidden archive overlooking Veyra's sunlit coast" onError={() => setMissingArt(true)}/>
      <div className={styles.coverShade}/>
      <div className={styles.coverCopy}>
        <p className={styles.kicker}><span/> THE WORLD FORGOT. THE CHAIN DIDN’T.</p>
        <h1>CHOG<span>1969<i>/</i></span></h1>
        <p className={styles.premise}>They erased an entire people.<br/>One drawing refused to disappear.</p>
        <button className={styles.enter} onClick={() => setEntered(true)} disabled={!ready}>{save.record || save.shipment ? "RESUME THE STORY" : "ENTER THE STORY"}<span aria-hidden="true">↗</span></button>
        <p className={styles.coverMeta}>A living manga. A real Genesis identity.<br/>No wallet needed to begin.</p>
      </div>
      <div className={styles.coverBottom}><span>01 — THE DRAWING THAT REMEMBERED</span><span>SCROLL. DISCOVER. CHANGE THE STORY.</span></div>
    </section>

    <div className={styles.viewport} aria-label="Forbidden archive, interactive opening" aria-hidden={!entered} inert={!entered || help}>
      <div className={styles.world}>
        <img className={styles.sceneArt} src="/private-review/archive-scene.webp" alt="Neri investigates a blue steel filing cabinet under an amber desk lamp" onError={() => setMissingArt(true)}/>
        <div className={styles.entranceCaption} style={{opacity: clamp(1 - camera * 2)}} aria-hidden={camera >= .5}>
          <span>VEYRA. CENTRAL ARCHIVE. AFTER HOURS.</span>
          <p>Some stories<br/>refuse to stay buried.</p>
        </div>

        <div className={styles.desk} data-active={atDesk} data-open={save.opened}>
          <div className={styles.deskLabel}>RESTRICTED / CABINET 19</div>
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
          <div className={styles.drawerInterior}><span>NO RECORD EXISTS</span></div>
          <div className={styles.drawer}>
            <img src="/private-review/drawer-front.webp" alt="" className={styles.drawerArt}/>
            <button className={styles.index} disabled={!atDesk || !save.record || !save.shipment || save.aligned}
              onClick={() => {setSave(value => ({...value, aligned: true})); cue(240, .25);}}
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
              onBlur={stopHold}><span>{save.aligned && !save.opened ? "PULL ↓" : ""}</span></button>
          </div>
        </div>
      </div>
      <div className={styles.reaction} data-visible={beat >= 3} aria-hidden={beat < 3}>
        <img src="/private-review/awakening-reaction.webp" alt="Reference-guided Neri reaction: startled by the living drawing" onError={() => setMissingArt(true)}/>
        <p>…You’re supposed<br/>to be extinct.</p>
      </div>
      <div className={styles.folio} aria-hidden={!save.opened}>
            <div className={styles.folioArt}>
              <img src="/private-review/pip.webp" alt="Unchanged CHOG #545 artwork: yellow Chog, happy eyes, MMGA cap and striped shirt" onError={() => setMissingArt(true)}/>
              <span>GENESIS / 545</span>
            </div>
            <div className={styles.folioCover}><span>DESTROY<br/>WITHOUT<br/>READING.</span><small>PALE ACCORD / ORDER 1969</small></div>
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

    <footer className={styles.readerFooter} aria-hidden={!entered} inert={!entered || help}>
      <div className={styles.position}><span>{save.opened ? "03" : atDesk ? "02" : "01"}</span> / 03 <i style={{width: (save.opened ? 100 : atDesk ? 66 : 5 + camera * 55) + "%"}}/></div>
      <p role="status">{instruction}</p>
      {!atDesk && <button onClick={() => moveCamera(cameraGoal.current + (reduced ? 1 : .34))}>Move closer ↓</button>}
      <small>ART DIRECTION REVIEW · NOT FINAL APPROVAL</small>
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
      <p>New reference-guided scene and pose illustrations are awaiting visual approval. Neri’s supplied design guides the art; CHOG #545 is the unchanged original. No rights or holder consent inferred. The later chapter retains its previous presentation.</p>
      <Link href="/archive">Read-only Genesis archive ↗</Link>
    </aside>}
  </div>;
}
