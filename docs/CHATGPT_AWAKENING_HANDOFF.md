# Illustration handoff — selected manga storyboard, authentic Pip finished locally

**FINAL-PRODUCTION HOLD: no final illustration job, intake or render now.** The user approved **L2 with L1's erased-index-versus-surviving-record comparison**. Four actual PNG layout thumbnails now exist privately; see `docs/AWAKENING_STORYBOARDS.md` v3 and the capability/blocker report in `docs/AWAKENING_CREATIVE_WORKFLOW.md` v3. No need to reselect a layout. Their direction approval and documentation-only push request do not approve new image calls, private artwork publication or deployment. Old W-01/M-01 and generic folio-camera requests are superseded; Neri appearance remains locked.

## Actual route / permissions

The previously accepted route is **user-managed ChatGPT art from the exact approved Neri JPEG**, followed by the existing **local Node/Sharp compositor**. The drawing step is an external handoff, **not a native Pi image capability** verified by this environment. Read `docs/ILLUSTRATION_TOOL_AUDIT.md`: the exposed Antigravity generator cannot send reference images and has unverified hosted costs/output terms. Do not use it, even for backgrounds, or assume an optional skill supplies an installed tool.

Before any illustration job, follow workflow v3's checks of actual reference attachment, existing no-additional-spend access, suitable export and applicable terms. If that accepted user-managed route cannot deliver, stop—no new provider, budget request, installation, text-only Neri recreation, SVG replacement or rejected-art fallback.

**$0 new third-party services. No paid API/external illustration service, agent generation/upload, model/package install, audio, deployment, public push/publication, integration, other scenes or wallet actions.** Project policy: `private-media/awakening/workflow.json`. CLI: `node scripts/awakening-pipeline.mjs`.

## Exact source locks

**Neri:** exact original Neri A / The Archivist, not written Restorer A, old vector schoolgirl or later Chog-themed variants. Actual approved source:

- Received `neri-approved-reference.jpg`; canonical local copy `public/media/neri/neri-approved-reference.jpg`.
- JPEG **1229×1536**, SHA-256 `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e`.
- Full character authority: `docs/NERI_APPROVED_CANON.md`. Same approved face/eyes/skin/proportions, short tousled black hair, gold hoops, dark cropped top, cream shorts, brown belt/utility strap, earth-brown map-lined cloak, satchel/scrolls, boots/glove and restrained brass details. No redesigned clothing or added franchise features.

**Pip:** genuine CHOG #545 / onchain 1053. Do not generate, redraw or upload the NFT to ChatGPT. Keep these local and unchanged:

- `public/media/hero/originals/token-1053.webp`, SHA-256 `47538955fbb298e3dc0b29f3f4e4f47f6a5c15f92f0e264295b59353be317b5c`.
- `public/media/hero/originals/token-1053.json`, SHA-256 `298de1bbc95adb946e40d9601a3b16bc2cfbb2e8d914819d49d132436d971037`.
- Frozen Chain evidence: `public/media/hero/evidence/chain-1053-verification.json`; not a new RPC certification or rights license.

Keep the whole image, original background/aura, cap lettering and all genuine traits. No crop, mirror, repaint, recolor, grade, invented anatomy or substitute mascot. The scene's geometric display transform is documented; original files remain separately accessible and byte-identical. Fictional scene is never labeled the original collectible.

## Drawing brief after explicit signoff

Use **the approved L2 + L1-evidence direction**, developed in the v3 four-panel storyboard. Keep L2's cabinets/support and L1's direct index/file comparison; do not add L1's separate desk scene or any L3 scene. The story is **investigation → evidence of deliberate erasure → authentic color/personality intrusion**. Proposed paper/label clues require user approval; do not invent dates, named events, readable lore or dialogue.

Authored **2D adventure manga**: exact approved Neri, expressive face, strong silhouette, convincing existing clothing construction, confident ink and restrained cel shadows. Use actual supplied One Piece references for those principles only, not copied characters. The scene is not painterly AI fantasy or an exercise in dense rendering.

Grounded oppressive institutional archives: metal filing cabinets, ordinary record shelves, censored documents, worn walls, working desks and practical light. Negative space, readable perspective, selective detail. **Previously generated ornate fantasy archive illustrations are excluded as references and production assets.** No excessive ornament, added particles, golden haze, mystical machinery or generic AI-fantasy background. Do not relight/recolor the genuine source to force a palette match.

The artist supplies all Neri anatomy, wrists/fingers, hand jobs, desk/shelf support and folder/record perspective. Leave the full source plane blank and clean, with covers/slips held outside it. No generated Pip or fake token art. No cut-up character sheet posed as a new illustration. `folioContactAndPlacementChecked` is the legacy packet name for physical record/folder contact; a heavy ornate book is not required.

## Actual inputs, only after approval

Exactly one chosen event, two independently composed canvases:

| Layout | Exact canvas | Board |
| --- | --- | --- |
| `wide` | **1920×1080** | Selected L1-W, L2-W or L3-W |
| `portrait` | **1200×1600** | Corresponding L1-P, L2-P or L3-P; separately staged, not a crop |

For each layout, either:

1. **Preferred:** one opaque `scene` raster containing coherent Neri, archive, evidence and supported record, with its source plane blank; or
2. Registered opaque `archive` + transparent `neri` rasters, both exact full-canvas size and aligned. This is accepted if genuinely supplied, not promised by the generator or assembled from unrelated assets.

Optional registered transparent `foreground` may carry desk/cover/finger details **outside** the source projection. It must be fully transparent over the entire genuine source, including antialiased boundaries. No white/black matte or occluding shadow.

Actual single-frame PNG/JPEG/WebP only, at most 64 MiB per raster. No SVG, PDF, HTML, remote URLs, animation, orientation transforms or silent resizing/cropping/upscaling. Required dimensions are acceptance conditions, not claims about ChatGPT's native output sizes. Stop on mismatch and obtain a compliant authored export through the already authorized route; do not invent an unavailable editor or substitute a different tool.

The user can deliver actual image files; Media can inspect them, measure corners and fill packets. The user need not author coordinates or JSON.

## Metadata templates and truthful inspection

These commands produce blank metadata on stdout, not art:

```sh
node scripts/awakening-pipeline.mjs template --layout wide
node scripts/awakening-pipeline.mjs template --layout portrait
```

After real files arrive and inspection is complete:

- `storyboardProposalId`: **L2** in both packets; record `l2-with-l1-evidence` in actual inspection/provenance notes.
- `compositionId`: distinct per layout; IDs alone do not prove independent composition.
- `files`: real local paths for scene OR archive+Neri; optional foreground. Unused roles null.
- `pipQuad`: actual reviewed TL/TR/BR/BL source corners, clockwise, convex, non-mirrored and entirely in canvas. No guessed coordinates from text diagrams. Minimum area 4.5% is not proof of phone readability.
- `origin`: actual ChatGPT provenance; exact Neri JPEG used as an image reference; Pip neither generated nor uploaded. Never fabricate an export receipt.
- `review`: only mark true after inspecting actual Neri identity, independent composition, anatomy/contact, blank source plane and absence of generated Pip. Also inspect `erasedHistoryEvidenceChecked`, `authoredMangaAndInstitutionalArchiveChecked`, and `rejectedFantasyReferencesExcluded`; include real reviewer notes.

Templates intentionally contain null paths/choice/quad/notes and false review flags. They fail intake. Declarations document accountable inspection, **not independent proof** of ChatGPT origin, reference fidelity, rejected-reference exclusion, drawing quality, rights or final user approval.

## Future local intake and private review

Only after final-production clearance and actual compliant art for the approved L2/L1 direction:

```sh
node scripts/awakening-pipeline.mjs receive --layout wide --packet /path/to/actual-wide-packet.json
node scripts/awakening-pipeline.mjs receive --layout portrait --packet /path/to/actual-portrait-packet.json
node scripts/awakening-pipeline.mjs check --require-ready
node scripts/awakening-pipeline.mjs render --confirm-private-review
node scripts/awakening-pipeline.mjs verify
```

The pipeline copies supplied bytes unchanged into sealed bundles, rejects silent replacement and requires both views to match the chosen layout. It inserts the whole genuine NFT locally, rejects foreground overlap and validates projected original pixels. It exports only the two event framings in PNG/lossless WebP, plus source-versus-scene board, actual manifest and offline gallery. No service calls or invented illustration.

All actual source/receipt/review files remain Git-ignored in `private-media/awakening/{incoming,received,review,.staging,history}/`, outside `public/`. No server, watcher or public preview. Future outputs—not existing deliverables—include `awakening-wide.{png,webp}`, `awakening-portrait.{png,webp}`, `review-board.png`, `manifest.json`, `index.html` and unchanged originals under `review/`.

Return actual visuals at full size and 375–390 px for **separate user hero approval**. Code cannot rescue static/floating-card staging or bad drawing. No current art, publication rights, spending or release approval is implied. Historical renderers remain frozen; previous rejected images are not fallback assets.

Read-only checks now: `node scripts/awakening-pipeline.mjs status`; `node scripts/check-hero-handoff.mjs`. Readiness remains exit 2 until selection/creative signoff and both real bundles. Unit tests use tiny abstract grids/metadata/temp files, never fake story illustrations. The new artistic end-to-end render remains unperformed.
