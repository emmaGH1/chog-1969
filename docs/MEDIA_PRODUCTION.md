# Media production — storyboard/workflow creative approval before final illustration

**DIRECTION APPROVED:** L2 with L1's erased-index-versus-surviving-record comparison. Four actual private PNG layout thumbnails now visualize that one event (`docs/AWAKENING_STORYBOARDS.md` v3). See workflow/capability report (`docs/AWAKENING_CREATIVE_WORKFLOW.md` v3) before any final illustration or render. The user requests a documentation-only push to `feat/media-assets`, not publication of private/source/rejected images. Neri identity and the ChatGPT/local technical method remain accepted, but do not grant composition/production approval. Final-art intake and render are blocked for current review-document versions, even if assets arrive. No spending, deployment, unrelated scenes or new art.

## Current scope and permission

User approved artwork generated in **ChatGPT using the exact approved Neri reference**, then local compositing of genuine **CHOG #545 / onchain token 1053**. New third-party services budget **$0**. No paid API, external illustration service, agent image generation/upload, SVG replacement, new package/model installation, extra scenes, audio, deployment or publication.

Exactly **one awakening event**, with separately composed **1920×1080 wide** and **1200×1600 portrait** views. Do not derive portrait by cropping wide. Reference/character approval is complete; do not generate Neri concepts or costume variants.

**Current state: L2/L1 hybrid direction approved; four visual planning thumbnails produced privately. No finished illustration or production review render exists.** Tool audit: `docs/ILLUSTRATION_TOOL_AUDIT.md`. Node/Sharp finishing is available; no native reference-conditioned Pi generator was verified. The user-managed ChatGPT drawing step is an external dependency requiring actual reference/export/no-new-spend checks before a job. Do not use the text-only Antigravity tool, even for backgrounds. Rejected ornate fantasy archives are neither references nor production assets. The technical method is accepted, not awaiting another tool-budget decision. Creative storyboard/production-workflow signoff must come first; both actual complete inputs are required afterward. Earlier method acceptance is not this new creative approval.

## Sources / canon

| Record | Actual path / role |
| --- | --- |
| Approved Neri canon | `docs/NERI_APPROVED_CANON.md`, unchanged from main `d0027e8d98bc31a5440eda8239a5d16eb8880259` |
| Exact received Neri JPEG | Root `neri-approved-reference.jpg`; byte-identical canonical local copy `public/media/neri/neri-approved-reference.jpg`, 1229×1536, SHA-256 `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e` |
| Neri reference manifest / locks | `public/media/neri/manifest.json`, `public/media/neri/design-gate.json` |
| Unchanged Pip original | `public/media/hero/originals/token-1053.webp`; SHA-256 `47538955fbb298e3dc0b29f3f4e4f47f6a5c15f92f0e264295b59353be317b5c` |
| Unchanged raw metadata / Chain evidence | `public/media/hero/originals/token-1053.json`, `public/media/hero/evidence/chain-1053-verification.json` |
| Current selected identity / output state | `public/media/hero/selection.json`; new output fields remain null until actual private drafts exist |
| Approved workflow policy | `private-media/awakening/workflow.json` |
| Artist/input contract and ChatGPT requests | `docs/CHATGPT_AWAKENING_HANDOFF.md` |
| Scene/appearance contract | `docs/HERO_SCENE_APPROVAL.md` |

Original source hashes are pinned, not inferred from thumbnails or holder ownership. Media checks frozen Chain evidence, not a fresh RPC/CID verification. No holder identity or endorsement claim. Keep NFT traits/colors/artwork unchanged and distinguish the complete collectible from fictional human/archive scene illustration.

## Local pipeline

`node scripts/awakening-pipeline.mjs` provides `status`, `template`, `receive`, `check`, `render` and `verify`.

Receive either a full illustrated scene with blank folio surface or registered archive + transparent Neri layers per view, optionally a transparent foreground outside the source area. Whole-source perspective placement is supplied only after inspecting the actual illustration; no guessed quad, crop, automatic resize or fallback drawing. See the handoff doc for exact packet fields and asset requirements.

Inputs and sealed receipts live in ignored `private-media/awakening/incoming/` and `received/`. Future PNG/lossless-WebP scenes, board, manifest, unchanged source copies and offline gallery live in ignored `private-media/awakening/review/`, **outside the app's `public/` directory**. No server, public preview or watcher is started. Source JPEGs remain local/untracked; do not stage artwork for the public repository.

```sh
node --test scripts/tests/awakening-pipeline.test.mjs
node scripts/awakening-pipeline.mjs status
node scripts/awakening-pipeline.mjs check --require-ready    # exit 2 while either actual illustration bundle is missing
node scripts/check-hero-handoff.mjs
node scripts/check-hero-handoff.mjs --require-ready         # same asset-wait gate, not missing Neri approval
node scripts/check-hero-handoff.mjs --require-publish-ready # exit 2: no art/rights/publication approval
node scripts/check-media-assets.mjs
node scripts/check-pip-awakening.mjs                       # preservation of REJECTED historical exports only
node scripts/prepare-voice-lines.mjs --check                # no voice provider calls
```

Only after one selected layout/workflow is explicitly approved AND its actual wide/portrait bundles are sealed/valid:

```sh
node scripts/awakening-pipeline.mjs render --confirm-private-review
node scripts/awakening-pipeline.mjs verify
```

The renderer checks complete intake before creating review output, writes only private files, verifies original-source pixel preservation and lossless exports, then records actual paths. It never calls an image service. Missing input is HOLD, corrupt input is failure, neither becomes placeholder art. Tests use tiny abstract grids/temp files, not full-size fake story art or generated Neri/Pip illustrations.

## Historical material / ongoing holds

Both `scripts/build-media-assets.mjs` and `scripts/build-pip-awakening.mjs` remain frozen. `public/media/hero/awakening/*` / `hero/review.html` are the **rejected old SVG hero**, not new approved-Neri output. Root media manifest/gallery, initial references/frames/contact sheet and exact voice text/performance files are historical, unchanged references. Written Restorer/Indexer/Stack Runner concepts are superseded; none is the approved original Archivist image.

Passing hashes, provenance declarations, dimensions or geometry cannot certify ChatGPT origin, character identity/acting, anatomy, hand/folio contact, depth, artistic quality or rights. Inspect actual sources and private composites; return the real wide/mobile files and comparison board for **separate user visual approval**. Check mobile at 375–390 px; image resizing is not physical product/browser QA.

No additional scenes, audio, spending, integration, public push/publication, deployment, main merge or chain actions. Rights/attribution and any later release remain separate unresolved gates.
