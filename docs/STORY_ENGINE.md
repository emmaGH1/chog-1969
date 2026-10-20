# Chapter One — story-engine checkpoint

Branch: `feat/story-engine` · issue [#1](https://github.com/emmaGH1/chog-1969/issues/1).

## Implemented
- Six-scene reading flow, drawer code **1969**, two escape routes and surveillance cliffhanger.
- Illustrated ink UI props: inspect two evidence labels; drawer opens on correct code; escape-plan route highlights after a choice. These are functional UI, **not finished narrative manga illustrations**.
- Validated/versioned local progress with migration from the original pilot save; corrupt saves cannot bypass puzzle/route gates. Missing storage falls back to in-tab play with a visible warning.
- Previous-scene navigation, focus and instant scroll to each new scene, restart confirmation, reset of puzzle error state.
- Route consequences remain visible in later scenes; choices persist and cannot be silently changed by revisiting.
- Minimum touch sizes for added controls, reduced-motion entry treatment, accessible puzzle label/status and route descriptions. Reading does not require audio.
- Unfinished scene artwork is explicitly labelled in the reader. Contracts, archive, NFT API and media-agent assets are untouched.

## Verified
- `npm run typecheck` — pass.
- `npm run build` — pass.
- `node --experimental-strip-types --test src/components/chapter/progress.test.mjs` — 4 tests pass (Node 22.23.3; harmless module-type warning).
- Production-server browser checks in local headless Chromium at **375×900** and **1280×900**, reduced motion enabled: both routes, wrong/correct puzzle, refresh after unlock/choice, scene focus, back, restart cancel/confirm, malformed save, no horizontal overflow. Separate blocked-localStorage check passes. No uncaught page errors in the main flow.
- Mobile drawer and escape screenshots inspected; disabled-choice contrast corrected and checks rerun. Evidence: [`docs/evidence/story-engine/`](evidence/story-engine/).

## Preview
```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3101
```
Open `/chapter/1` (locally: `http://localhost:3101/chapter/1`). The verification server in this worktree is bound to **127.0.0.1:3101**, not a public deployment. SSH tunnel if needed: `ssh -L 3101:127.0.0.1:3101 <your-vps>`.

Browser regression harness (requires a separately installed `playwright-core` and Chromium; no project dependency added):
```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs \
CHROME_PATH=/absolute/path/to/chromium \
STORY_BASE_URL=http://127.0.0.1:3101 \
STORY_EVIDENCE_DIR=/tmp/chog-story-evidence \
node src/components/chapter/browser.test.mjs
```
If `playwright-core` is installed in normal Node resolution and its browser is available, the module/browser overrides are optional.

## Blockers / not done
1. **Approved sample art required.** No narrative images or character sheet are present in this worktree. Media owner must supply the character sheet and approved cover/archive/Neri/Pip samples per `ART_DIRECTION.md`. Do not batch-generate scenes before user approval. Existing geometric stage placeholders remain visibly labelled. Issue #1 is not complete.
2. **Physical Android Chrome sign-off needed.** The 375px check is desktop Chromium emulation, not evidence of a real phone test. Desktop non-reduced-motion visual check and final illustrated-panel review remain required.
3. No hosted preview deployed or production changes made. Draft PR is for incremental integration review, not an assertion of completed manga art.

Next action: review the media owner's sample art with the user; then integrate a consistent six-scene asset set, replacing the geometric stages and moving interactive hotspots onto the approved panel compositions. Preserve readable HTML dialogue and the tested gate/save behavior.
