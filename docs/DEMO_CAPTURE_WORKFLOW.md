# Real-browser demo capture workflow

Branch: `integration/pilot`. **Prepared and rehearsed; final recording is blocked pending authentic companion/visual approval.** No media from PR #8 is promoted. This workflow records actual Chromium frames from the running production app—not reconstructed slides, mocked metadata, DOM-swapped text or fabricated wallet success.

## Safety boundaries

- Keep `MEMORY_WRITES_APPROVED=false`. Capture/rehearsal checks the actual config endpoint before and near the end of the run and refuses anything other than `enabled: false`.
- Loopback HTTP origins only; no public dev server, deployment, paid service, gas or mainnet transaction. The script never clicks **Connect wallet**, switches a wallet, signs, or submits. It uses a fresh browser context without extensions or existing user storage and blocks wallet/signing RPC requests.
- The real archive API and original NFT images are required. Missing data, missing art or RPC/gateway errors fail the run; never replace them with a fixture for demo capture. Mocked wallet tests are a separate test harness, not footage for claims of real ownership.
- `--check` performs a **no-video rehearsal** with viewport screenshots and provenance. It is allowed while chapter layout previews are labelled as unfinished. `--record` requires documented visual approval, a clean reviewed commit, matching successful preflight/build, and refuses the still-labelled narrative-art placeholders. Human visual review remains necessary; a JSON approval record is an operator attestation, not independent verification or transaction permission.
- Approval and raw footage live under ignored `artifacts/demo/`. Nothing is uploaded or published automatically. Do not place secrets or wallet exports in the approval file.

## 1. Prepare isolated browser tooling

Use Node 22. The application gains **no new production or development dependencies** for capture. Reuse an existing pinned Playwright/Chromium install, or install outside the repo (free local tooling only):

```sh
npm install --prefix /tmp/chog-capture-tools --no-audit --no-fund playwright-core@1.64.0
node /tmp/chog-capture-tools/node_modules/playwright-core/cli.js install chromium
export PLAYWRIGHT_MODULE=/tmp/chog-capture-tools/node_modules/playwright-core/index.mjs
export CHROME_PATH="$(node -p "require('/tmp/chog-capture-tools/node_modules/playwright-core').chromium.executablePath()")"
```

Chromium needs its normal Linux system libraries. Use the existing CI browser-install recipe with `--with-deps` if your machine lacks them; do not expose a public browser/debugging port. Recording requires Playwright's local FFmpeg installation (downloaded by its browser install). No hosted video service is used.

On the current builder host the already-tested overrides are:

```sh
export PLAYWRIGHT_MODULE=/tmp/pw/node_modules/playwright-core/index.mjs
export CHROME_PATH=/home/builder/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
```

## 2. Run the security/build preflight

```sh
cd /home/builder/projects/chog-integration
git switch integration/pilot
npm run demo:preflight
```

This runs, in order, `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `npm audit --omit=dev`. It stops on failure and writes command logs plus `preflight.json` under a timestamped `artifacts/demo/preflight-*` directory. No server, recording or transaction is started. The report includes commit, branch, source status, production build ID and results.

Use the printed report path as `REPORT` below. Preflight must be successful, less than 24 hours old, and match the current commit and production build. Final recording also requires no uncommitted source changes in either the report or current checkout; the generated `next-env.d.ts` rewrite is the sole ignored declaration-file exception. Re-run preflight after a commit/build change.

## 3. Start/restart the private production server

Stop the old server you own before restarting on the same port, so the running process and `.next` build match:

```sh
npm run start -- --hostname 127.0.0.1 --port 3103
```

Leave it running in its own terminal. Do not use `npm run dev` for recording. The workflow verifies the server serves the preflight build's manifest. For private human review from your computer:

```sh
ssh -N -L 3103:127.0.0.1:3103 <your-ssh-host>
```

Open http://localhost:3103/chapter/1 or `/archive`. A capture run uses its own fresh storage, so it does not reset the user's story progress.

## 4. Rehearse now — no video, no visual approval implied

```sh
REPORT=artifacts/demo/preflight-<timestamp>/preflight.json
npm run demo:check -- --preflight "$REPORT"
```

Default viewport is **1280×720**. For a separate phone-layout rehearsal:

```sh
DEMO_WIDTH=375 DEMO_HEIGHT=812 npm run demo:check -- --preflight "$REPORT"
```

Each run creates a new `artifacts/demo/rehearsal-*` folder and refuses to overwrite an existing take. Screenshots show actual **viewport frames**, not misleading full-page images. `manifest.json` records:

- commit/build/viewport/mode and source changes;
- eight named story/demo beats and timings;
- actual chain 143 collection/token/name, block/time, original metadata and image URI;
- observed memory status, errors and `video: null` for rehearsal.

The run follows the real UI: cover → evidence + wrong/correct drawer code → saved Keep route + reload → live Genesis token/art/traits → disabled holder controls → public memory refresh → resumed cliffhanger → cover. It never injects a save, forges ownership, changes DOM text, mocks the API or hides pending-art/read-only disclaimers. Rehearsal waits only for actual browser/network operations; it is not the 160-second finished demo.

Default archive lookup is token **1969**, metadata **CHOG #1461**. This remains a verified candidate, **not an approved fictional Pip**. After the user chooses an actual different companion, supply its verified identity explicitly:

```sh
DEMO_TOKEN_ID=<onchain-id> DEMO_METADATA_NAME='<exact metadata name>' npm run demo:check -- --preflight "$REPORT"
```

## 5. Obtain visual approval — do not manufacture it

After the actual companion and the visuals shown in the take are approved **and integrated**, commit the reviewed source and rerun preflight. Record the user's approval in `artifacts/demo/visual-approval.json` with these fields (the placeholders below are documentation, not an approval):

```json
{
  "sourceCommit": "<full reviewed commit hash>",
  "companionTokenId": "<approved real onchain token ID>",
  "visualsApproved": true,
  "approvedBy": "<human approver>",
  "approvedAt": "<actual ISO approval timestamp>",
  "evidence": "<link or reference to explicit user approval>",
  "heroArtReference": "<approved integrated asset/review reference>"
}
```

Do not fill these with fictitious approval. A mismatched commit/token, missing fields, absent approval, dirty source, stale/failed preflight, enabled writes, or labelled unfinished chapter art blocks final recording. Visual approval **does not approve deployment, enabling writes, wallet use or spending**.

## 6. Record the genuine browser after approval only

```sh
npm run demo:record -- --preflight "$REPORT" --approval artifacts/demo/visual-approval.json
```

The same verified interactions are paced against the [2:40 shot plan](DEMO_CHECKLIST.md): cover 0–15s, drawer 15–40s, route 40–60s, archive 60–90s, holder 90–115s, read-only proof boundary 115–135s, cliffhanger 135–155s, close 155–160s. Missing minimum readable shot holds or a take reaching 180 seconds fails the take. Network latency can still require a retry. Retain failed manifests and diagnose; don't speed through illegible proof or fabricate readiness.

Playwright closes/flushed the context before reporting the local **WebM** path. Browser-only recording is silent: it contains no narration, music, system audio or wallet popup. Record the approved narration separately using local tools; no TTS spending is authorized. Preserve raw takes and manifest, then review every frame for truth, privacy and readable mobile/desktop UI.

Optional local MP4 conversion after recording (not executed as part of preparation):

```sh
ffmpeg -i <raw-take.webm> -c:v libx264 -pix_fmt yuv420p -movflags +faststart <review-copy.mp4>
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 <review-copy.mp4>
```

Do not stretch, crop away disclaimers, or present a mock receipt as genuine. The raw video is not a finished narrated submission. Final narration/captions, any editing, under-3-minute duration check, visual acceptance and upload approval are separate steps. Confirm the actual deadline in the signed-in dashboard.

## Validation checkpoint and remaining blockers

- Preflight passes with **43 tests**, successful typecheck/build and **0 production audit findings**. The five added safety tests cover local-only origins, default-off writes, matching/recent preflight, documented approval and clean-source filtering.
- Real-app no-video rehearsal passes on the builder preview with actual token 1969 / CHOG #1461 and original artwork. Guest, archive and mocked holder browser regressions remain separate verification commands documented in `WALLET_GATE.md`.
- Full development audit retains the seven documented Ganache findings; do not call the full dependency tree clean.
- No final video has been recorded, approved, narrated or published. Authentic companion/hero visual approval, physical Android QA and final visual acceptance remain blockers. The live ledger remains undeployed and write controls disabled.
