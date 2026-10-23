# CHOG 1969 — current handoff

Updated 2026-10-23 UTC. Read before older planning documents.

## Current decision: new visual checkpoint awaiting Emma's review

Emma rejected the original CSS-room staging, disconnected reference cutouts and conventional UI. She explicitly rejected warm-paper backgrounds and authorized: **"create reference-guided scene/pose artwork yourself. draw inspo from our video inspo but make our illustration look like the chog arts and their theme"**. This supersedes the old art-sourcing STOP gate.

Latest correction: the project is about **CHOG outcasts/misfits, not Neri**. Emma rejected the Neri-led cover, ornamental slash, weak arrow CTA, disconnected purple “marked for erasure” reader, and laggy-feeling scroll. The cover now centers four reference-guided CHOG interpretations with a slash-free title and arrow-free ink-edged Enter button. Neri remains the archivist inside the story, not the project identity.

The archive still uses cobalt steel, amber practical lights, clue inspection, physical drawer opening and unchanged Pip artwork. The erasure scene now has a matching full-bleed archive illustration. Chapter One shares the opening's typography/color language instead of purple panels; saved progress and Keep/Burn semantics are unchanged. Scenes5/6 currently reuse the rooftop establishing artwork, not dedicated finished narrative frames. This is not a complete application-wide redesign or approval to expand the plot.

**Generated poses are candidates, not newly approved canon.** No claim that generation guarantees an exact model-sheet match. Inspect identity and world coherence with Emma. No final soundtrack or narration; the optional Web Audio cues remain.

## Branch and implementation

- Repository: emmaGH1/chog-1969.
- Existing branch: `feat/devin-cinematic-release`, originally from `integration/pilot`. Never use main as baseline.
- Current application revision: `e84bdf89f496d5b28d55902e095bbbe46695b8e9`. Main CHOG-led correction: `c15a8c7be64c2f417526e9958984c80b2eb84b69`. Earlier Neri-led checkpoints are superseded, not approved design references.
- Opening: `src/components/ArchiveOpening.tsx` and `src/components/chapter/opening.module.css`.
- Chapter presentation: `ChapterExperience.tsx`, `chapter.module.css`, `ChapterInteractions.tsx`. NFT API, wallet/write gates and progress parsers were not changed.
- Camera runs requestAnimationFrame only while moving, updates the world CSS variable directly, and publishes React state only at visibility/interaction thresholds. Smoothing55ms replaces140ms; wheel input no longer caps every event at180px.
- Self-hosted Barlow Condensed Black from official google/fonts repository; OFL license included.
- New art remains ignored under `public/private-review/`, not published in Git.
- No PR, public deployment, main merge, wallet signatures, real transactions, contract writes or new purchases.
- Private authenticated preview: https://chog-private-archive-review--2hkgr7rx.preview.devinapps.com

## Verified status and remaining checks

For c15a8c7: focused opening/progress6/6, complete tests45/45, typecheck, production build and whitespace checks passed. Final e84bdf8 presentation/text follow-up passed typecheck/build/whitespace checks; full tests were not redundantly rerun. Build reported its lint/type-validation phase complete; no separate lint script exists. Ganache emits a non-blocking native µWS fallback warning. Earlier production audit found0 vulnerabilities; audit was not rerun for this revision. Development dependency audit remains non-clean.

e84bdf8 browser checks passed: fresh ensemble cover, actual wheel approach, clue/index gates, physical drawer drag, awakening and continuation into illustrated erasure scene04/06. Keyboard Move closer, early release/reset, hold completion, partial-save camera restoration and reduced-motion wheel gates passed. Isolated fresh contexts verified both Keep/Burn feedback, gating, saved choice locking and reload persistence. Existing later Keep was preserved.

Exact390×844 portrait emulation at100% zoom passed: recognizable CHOGs, reachable Enter and chapter choices/navigation, no horizontal overflow. Exact1440×900 cover/erasure art/headline/choices/navigation fit passed. No physical touchscreen was tested.

Current review recording: `chog-e84bdf8-native-unretimed-60fps.mp4`, genuine1920×1080, nominal60fps,5706frames,95.099seconds, silent. Raw segments were stream-copied without retiming. Do NOT substitute the old accelerated/paused19.534second edited recording. Key screenshots and the new recording are attached to the session.

Live scroll probes observed a roughly769ms trailing movement in the old version and295ms in the new, with p95frame interval roughly16.8ms in both and no long tasks in either short sample. These are observations, not a controlled performance benchmark: the old probe missed two earlier wheel events. Do not advertise a percentage speedup or general device performance guarantee. Both raw probes are retained in the session VM under Documents/chog-camera-before.json and chog-camera-after.json.

Actual browser synth previously reached the Pulse monitor (peak−34.1dBFS), after restarting Chrome with its existing profile and explicit PULSE_SERVER/PULSE_SINK. Synchronized A/V remains unverified: simultaneous capture had128 duplicate audio timestamps and8 gaps over100ms (largest1.377s). Share the valid silent unretimed recording, not an unverified synchronized soundtrack. No external voice API was needed.

## Private art and reproduction

Private scene artwork was created with the available image tool. Neri's supplied model sheet guides her poses; authentic Genesis originals guide the ensemble interpretation. Scene art must never be represented as original collectible artwork:

- `chog-ensemble-concept.png` / `chog-ensemble.webp`: CHOG rooftop ensemble; NEW active cover. References: CHOG #1340/token1848, #4/512, #920/1428 and #1112/1620. These are not approved new story roles.
- `redactors-scene.png/webp`: Neri sheltering behind the same archive cabinet as anonymous silhouettes approach; no approved Sera face is implied.
- `cover-scene.png/webp`: rejected Neri-led cover, no longer used; historical local asset, omitted from the new recovery bundle.
- `archive-scene.png/webp`: investigation pose and full environment.
- `awakening-reaction.png/webp`: close-up reaction in the same lighting.
- `drawer-front.webp`: exact rectangular crop of archive-scene.png, coordinates (710,626) to (1498,890), not new generated art.
- `pip.webp`: unchanged authenticated original.
- Earlier WebP derivatives use Pillow quality91; drawer crop quality94; the new ensemble/erasure derivatives use quality90.
- `cast-1848.webp`, `cast-512.webp`, `cast-1428.webp`, `cast-1620.webp`: unchanged reference originals extracted from origin/feat/nft-memory's previously verified candidate snapshot. New bundle includes original metadata, source commit, snapshot provenance and SHA256 hashes. No fresh onchain check was performed for this visual change.

Generated scenes and source uploads are private review assets. They are **not in Git**, so a clone alone lacks visuals. Restore the private asset bundle shared in the Devin session into `public/private-review/`; it includes render files and original generated PNGs. Do not regenerate them casually or publish private uploads to fix portability. The original Neri sheet is not included in that bundle. If it is needed for further pose generation, obtain the attachment securely from Emma.

Current recovery bundle: `chog-misfits-review-art.zip`, SHA256 `d39ea15c2343cddcdfaeba937ff34b002b31efd29dbe770792bc8728b95af8ee`. Its paths are relative to the repo root, so extract there. It includes all current rendered images, generated PNG sources, four unchanged cast reference originals, their provenance, a private README and a SHA256 manifest. Archive integrity and unchanged Pip/cast hashes were checked.

Session and review assets: https://app.devin.ai/sessions/45c27cfaffaa4776b21a57c3c48e6f6f

## Locked identity, provenance and safety

- Neri source SHA256: `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e`.
- Neri: short tousled black hair, gold hoop earrings, dark sleeveless top, cream shorts, mapped brown cloak, satchel, scroll, boots.
- Pip = CHOG #545, onchain token1053, Monad143, Genesis `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`. Token1969 is NOT Pip.
- Original Pip image SHA256: `47538955fbb298e3dc0b29f3f4e4f47f6a5c15f92f0e264295b59353be317b5c`.
- Existing `scripts/prepare-review-art.py` validates the exact Neri source and original Pip provenance. It does NOT recreate generated scenes; use the private bundle.
- Existing story save `chog1969:pilot`; opening save `chog1969:opening:v1`. Replay resets only the opening. Preserve later Keep/Burn choices.
- NFT dossier and API remain read-only. MemoryLedger writes remain disabled. Provenance does not imply holder consent, licensing, endorsement or ownership identity.

## Reference principles and next action

The supplied video shows comic pacing, dramatic reframing, physical interactions and close-ups, not a normal website with scroll animations. CHOG's live sites provided painted environments, directional sunlight, pink controls and energetic type as reference principles. Do not copy proprietary artwork. Do not revert to warm-paper editorial backgrounds or generic purple gradients.

Next: Emma reviews the CHOG-led cover, stronger controls, story handoff and scene interpretations. Do not expand the application or story without review. Remaining gaps: synchronized audio recording, physical touchscreen testing, final art/casting approval and finished soundscape/narration. Preserve the new private asset bundle when moving environments.

Emma's deadline: 23October2026 16:00 WAT /15:00 UTC; proposed review freeze14:00 WAT. No public release, spending or main merge without explicit approval.
