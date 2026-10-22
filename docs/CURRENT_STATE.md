# CHOG / 1969 — current handoff

Updated 2026-10-23 UTC. Read before older planning documents.

## Current decision: new visual checkpoint awaiting Emma's review

Emma rejected the original CSS-room staging, disconnected reference cutouts and conventional UI. She then explicitly rejected warm-paper backgrounds and authorized: **"create reference-guided scene/pose artwork yourself. draw inspo from our video inspo but make our illustration look like the chog arts and their theme"**. This supersedes the old art-sourcing STOP gate. No broad chapter redesign is authorized before the opening checkpoint is reviewed.

The new opening uses full-color, reference-guided illustrations: cobalt stone and steel, pink sunset, amber practical lights. A large CHOG / 1969 cover enters the archive, wheel/touch input controls an interpolated camera approach, diegetic records unlock a drawer cropped from the actual background art, then the unchanged authentic Pip image and a full-frame Neri reaction appear. Later chapters retain the old presentation; this is NOT a complete application-wide redesign.

**Generated poses are candidates, not newly approved canon.** No claim that generation guarantees an exact model-sheet match. Inspect identity and world coherence with Emma. No final soundtrack or narration; the optional Web Audio cues remain.

## Branch and implementation

- Repository: emmaGH1/chog-1969.
- Existing branch: `feat/devin-cinematic-release`, originally from `integration/pilot`. Never use main as baseline.
- Main visual milestone: `308dc2043a86018433ed8d676f5a19a7c9d55466`. Later commits refine framing and update this handoff.
- Opening: `src/components/ArchiveOpening.tsx` and `src/components/chapter/opening.module.css`.
- Self-hosted Barlow Condensed Black from official google/fonts repository; OFL license included.
- New art remains ignored under `public/private-review/`, not published in Git.
- No PR, public deployment, main merge, wallet signatures, real transactions, contract writes or new purchases.
- Private authenticated preview: https://chog-private-archive-review--2hkgr7rx.preview.devinapps.com

## Verified status and remaining checks

For 308dc20: focused opening tests 2/2; complete tests 45/45; typecheck; production build; production audit (0 vulnerabilities) passed. No lint script. Ganache emits a non-blocking native µWS fallback warning. Development dependency audit remains non-clean.

Lead inspected the actual rendered cover, camera movement, desk and awakening at native 1920×1080, using real clicks/wheel/drag. Final regression recording and responsive/keyboard/reduced-motion checks for the NEW visuals are pending; older passing recordings do not prove this revision.

PulseAudio tools and null-sink capture were repaired earlier; test-tone capture is verified. Browser app sound routing and synchronized capture are still pending. Do not claim the test tone proves the app is audible.

## Private art and reproduction

Three new illustrations were created with the available image tool, using the supplied Neri model sheet as a reference. Hero and archive frames were used as further visual references for continuity. No replacement Pip/CHOG art was generated:

- `cover-scene.png/webp`: exterior, Neri at archive door.
- `archive-scene.png/webp`: investigation pose and full environment.
- `awakening-reaction.png/webp`: close-up reaction in the same lighting.
- `drawer-front.webp`: exact rectangular crop of archive-scene.png, coordinates (710,626) to (1498,890), not new generated art.
- `pip.webp`: unchanged authenticated original.
- WebP scene derivatives use Pillow quality91; drawer crop quality94.

Generated scenes and source uploads are private review assets. They are **not in Git**, so a clone alone lacks visuals. Restore the private asset bundle shared in the Devin session into `public/private-review/`; it includes render files and original generated PNGs. Do not regenerate them casually or publish private uploads to fix portability. The original Neri sheet is not included in that bundle. If it is needed for further pose generation, obtain the attachment securely from Emma.

Session and review assets: https://app.devin.ai/sessions/45c27cfaffaa4776b21a57c3c48e6f6f

## Locked identity, provenance and safety

- Neri source SHA256: `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e`.
- Neri: short tousled black hair, gold hoop earrings, dark sleeveless top, cream shorts, mapped brown cloak, satchel, scroll, boots.
- Pip = CHOG #545, onchain token1053, Monad143, Genesis `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`. Token1969 is NOT Pip.
- Original Pip image SHA256: `47538955fbb298e3dc0b29f3f4e4f47f6a5c15f92f0e264295b59353be317b5c`.
- Existing `scripts/prepare-review-art.py` validates the exact Neri source and original Pip provenance. It does NOT recreate the three generated scenes; use the private bundle for those.
- Existing story save `chog1969:pilot`; opening save `chog1969:opening:v1`. Replay resets only the opening. Preserve later Keep/Burn choices.
- NFT dossier and API remain read-only. MemoryLedger writes remain disabled. Provenance does not imply holder consent, licensing, endorsement or ownership identity.

## Reference principles and next action

The supplied video shows comic pacing, dramatic reframing, physical interactions and close-ups, not a normal website with scroll animations. CHOG's live sites provided painted environments, directional sunlight, pink controls and energetic type as reference principles. Do not copy proprietary artwork. Do not revert to warm-paper editorial backgrounds or generic purple gradients.

Next: finish browser regression and native 1920×1080 recording of this revision, verify actual app audio, share the cover/opening checkpoint and private recovery bundle. Wait for Emma's visual review before propagating the direction. Keep handoff current with final code commit, actual tests and untested gaps.

Emma's deadline: 23October2026 16:00 WAT /15:00 UTC; proposed review freeze14:00 WAT. No public release, spending or main merge without explicit approval.
