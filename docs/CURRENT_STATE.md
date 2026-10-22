# CHOG / 1969 — current handoff

Updated 2026-10-22 23:10 UTC (2026-10-23 WAT). Read this before older planning documents.

## Decision gate — STOP before further UI implementation

Emma rejected Devin's first visual slice. Working mechanics are not visual acceptance. She describes it as approximately 5/100 and wants a radically more cohesive, authored, lively manga experience. Do not preserve the olive CSS room, disconnected reference cutouts, floating dialogue cards, or navigation treatment merely because they work.

Her latest instruction supersedes the old no-landing-page interpretation: **a strong illustrated hero introduces CHOG / 1969, then Enter begins the playable manga in the same visual world**. Humankind's illustrated editorial identity is the landing reference; her supplied Santioni/Notturno video is the motion/interaction reference. These are not instructions to copy proprietary artwork.

She explicitly asks for blockers and asset/access needs BEFORE acting on the redesign. No new design or art generation is approved at this checkpoint. The $200,000 comparison is a quality bar, NOT spending authorization. No paid generation, public deployment, main merge, real wallet writes or transactions without specific approval.

## Verified baseline

- Repo: emmaGH1/chog-1969.
- Work on existing branch `feat/devin-cinematic-release`, originally from `integration/pilot`, never main as baseline.
- Latest application commit: `5938b317b0b65fc20df1f36657490fd028b0c70d`.
- New opening at `/`; existing six-scene reader at `/chapter/1`; read-only NFT dossier at `/archive`.
- Camera approach, two clue gates, index, physical drawer gesture, timed folio/reaction, chapter continuation implemented.
- Initial checks: npm ci; npm test (45/45); npm run typecheck; npm run build; npm audit --omit=dev (0 vulnerabilities). Latest CSS-only fix rebuilt successfully. No lint script. Development dependency audit is not clean.
- Real browser: landscape pointer path, keyboard, early-release, reduced motion, persistence and preservation of later Keep choice passed. Portrait emulation passed after preventing swipe text selection; no physical phone test.
- Primary private-review video: native 1920×1080, 21.434 seconds, silent, application revision 9b7dcd5. Later 5938b31 only prevents selection during swipes. This is not the requested finished-art/audio deliverable.
- Preview is authenticated Devin review, not public deployment. No PR or merge created.

## Reference inspection and interpretation

- User-supplied Humankind screenshot: illustration interlocks with big title lettering; paper/black-ink contrast; character ensembles and open space; compact navigation. Borrow coherence and art-led hierarchy, not its entire marketing-page section stack.
- User video inspected with video-analysis tool: Notturno title, scroll through bordered comic panels, character/environment offsets, gesture-gated handle/door interaction, major scene/color changes and close-up eye panels; later pouring gesture. It is NOT simply one CSS room zoom. Its “GPT-6 Astra” caption is not evidence about the site's implementation.
- https://www.chog.xyz/ rendered: warm painted environment, directional sunlight, playful purple character and pink controls. https://chogathon.chog.xyz/ rendered: energetic character art, condensed type, purple/pink accents. Do not equate “Chog palette” with generic purple gradient UI.
- Current art-direction hypothesis (not approved): **ink breaking into color**. Warm paper/black ink establishes the erased history; controlled CHOG pink/purple/yellow accents establish personality, then authentic Pip's color transforms the scene. Hero composition transitions into the opening manga panel; one consistent texture, line weight, lighting and dialogue treatment.
- Alternatives to discuss if needed: full-color animated-cover treatment (highest asset burden); mostly ink/paper graphic novel with Pip's original color preserved (simpler but less brand energy). Recommend the hybrid, rather than asking Emma to design individual pixels.

## Actual blockers

1. Coherent scene assets: approved layered archive, cabinet/drawer interior/contact pieces, and Neri investigation/reaction poses do not exist in current approved materials. The character reference is not a complete animation asset pack. More CSS polish does not solve this.
2. Art sourcing authority: ask whether Emma can supply these assets or authorizes reference-guided new environment/prop/pose artwork for review. Preserve exact Neri canon and unchanged Pip original; generation does not guarantee identity consistency. An image editing/generation tool is available but has a stated cost, so do not silently invoke under the no-spend constraint.
3. Audio: no finished soundscape. Current app has optional synthesized cues. Previous capture failed because the VM lacked a PulseAudio server/utilities and physical sound device. Installed PulseAudio, started a local server and null sink/monitor; a real440Hz test tone was captured with nonzero signal. OS loopback is now verified; browser app routing and synchronized recording remain UNVERIFIED. VM capture repair is separate from ElevenLabs voice generation; no voice API key was needed.
4. Cross-environment assets: private user art and derived crops are ignored, not in Git. Another environment needs the approved source reattached or securely transferred. Do not “fix portability” by publishing private uploads.

## Locked art and safety

- Neri source SHA256: `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e`.
- Pip = CHOG #545, onchain token1053, Monad143, Genesis `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`. Token1969 is NOT Pip.
- `scripts/prepare-review-art.py` accepts exact Neri reference and reads authentic Pip bytes/provenance from fetched `origin/feat/nft-memory`; outputs ignored `public/private-review/`.
- See `docs/OPENING_REVIEW.md` for reproduction and provenance hashes. Do not repeat live provenance checks merely to restyle the UI.
- Existing story save `chog1969:pilot`; opening save `chog1969:opening:v1`. Preserve choices, NFT reads, guest access and wallet safety. Memory writes remain disabled.

## Deadline and next action

At ~23:06 UTC on22Oct, the rendered official Chogathon page showed15h54m remaining, consistent with Emma's deadline **23Oct2026 16:00 WAT /15:00 UTC**. Plan a review-ready freeze at14:00 WAT, leaving two hours for review/submission; this is a proposed target, not a promise that unavailable art will be solved.

Next action: explain the creative failure and verified blockers to Emma; obtain art-sourcing/design-direction decision. Then build ONLY the new hero and its connected first manga frame as a visible quality checkpoint before spreading that treatment through the preserved chapter. Do not burn the time budget making another full unapproved UI.

Update this file and commit after every meaningful approved milestone: current sha, actual checks, remaining gaps, asset provenance/permissions, and one next action. Keep secrets and machine-specific process details out of Git.
