# Media production — batch 01 / review drafts

## Current boundary

Work branch: `feat/media-assets`. Own only `public/media`, `public/audio`, media scripts and documentation. No application integration, deployments, purchases, API requests to paid generation services, or transactions. The pre-existing untracked `package-lock.json` is not part of this work.

**Production method:** original, code-authored SVG illustration, rasterized locally with the repository's installed Sharp. These are editable vector **art-direction drafts**, not approved final manga or generated raster paintings. No model/API spend. Character geometry is reused between reference sheets and frames to prevent face drift. Do not imply a rendered voice file or a recorded demo exists when it does not.

## Delivered files and local review

- Four 1800×1220 model sheets: `public/media/references/{neri,pip,sera,rook}-sheet.{svg,webp,png}`. Four schematic views plus expression studies. These are design drafts, not anatomically finished animation turnarounds.
- Four story compositions, each with independent wide 1600×1000 and portrait 1200×1600 layouts: `public/media/frames/{cover,archive,neri-closeup,pip-awakening}-{wide,portrait}.{svg,webp,png}`.
- Mini preview: `public/media/contact-sheet.png`. Offline-capable review gallery: `public/media/review.html`. Source/raster paths, dimensions, byte counts, SHA-256 hashes, alt text and pending-review status: `public/media/manifest.json`.
- Eight exact line files + eight SSML-like editorial direction files in `public/audio/lines`; `public/audio/voice-plan.json` keeps recorded outputs null. See `public/audio/README.md`. No voice or music files exist.
- `docs/MEDIA_FINISHING_PROMPTS.md`: reusable briefs for a later approved finishing pass. No image-model job was run; generation tools were not invoked because provider spend was not authorized.
- `docs/DEMO_STORYBOARD.md`: 2:40 plan, capture checklist, evidence log and honest read-only/local/real-holder variants. No recorded footage or rendered demo exists.

Open `public/media/review.html` directly in a browser, or serve only locally:

```sh
python3 -m http.server 8008 --bind 127.0.0.1 --directory public
# Open http://127.0.0.1:8008/media/review.html on this machine.
```

Rebuild and validate locally from the repository root (uses the already installed Sharp dependency; no new service or API):

```sh
node scripts/build-media-assets.mjs all
node scripts/check-media-assets.mjs
node scripts/prepare-voice-lines.mjs
node scripts/prepare-voice-lines.mjs --check
```

Partial illustration rebuilds accept `references` or `scenes`, but only `all` refreshes the complete manifest and contact sheet; run `all` before committing. The checker catches stale byte counts. Current toolchain: Node v22.23.3, Sharp 0.34.5, libvips 8.17.3; reference annotations use local DejaVu Sans. Rasterization is deterministic in this environment; different font/library versions may differ. WebP exports are lossless to preserve ink edges. PNG fallbacks use a 128-color palette and may be smaller for flat vector art; choose formats based on measured bytes rather than assuming WebP always wins. Each delivered story raster is below 250 kB.

## First approval gate / shot list

| ID | Deliverable | Composition and story job | Delivery / acceptance |
| --- | --- | --- | --- |
| REF-N | Neri reference sheet | 19-year-old archivist; front, three-quarter, profile/back, expression studies; satchel and uniform details | Editable sheet plus raster preview; face, fringe and wardrobe lock |
| REF-P | Pip reference sheet | Small mischievous Chog-spirit; front, three-quarter, profile/back; smug and vulnerable expressions | Cartoon silhouette stays recognizable; no NFT/token likeness claim |
| REF-S | Sera reference sheet | Redactor captain; severe angular coat; restrained face; front, three-quarter, profile/back | Authority through silhouette, not a generic villain mask |
| REF-R | Rook reference sheet | Harbor smuggler; relaxed asymmetry, smiling face, open collar; front, three-quarter, profile/back | Distinct from Neri and Sera at thumbnail size |
| F01 | Cover | Neri foreground, an illicit page and tiny Pip; archive architecture; violet follows the page, not the environment | Wide and portrait art; clean upper title-safe area; no baked dialogue |
| F02 | Veyra archive | Converging shelves, distant light, human-scale Neri inspecting records | Readable space and scale on phone; color absent before awakening |
| F03 | Neri close-up | Alert face, paper held below face; sliver of shelf; doubt before discovery | Same fringe, barrette, uniform and eyes as REF-N; no unrelated glamour pose |
| F04 | Pip awakening | Pip physically climbing out of a drawing; Neri reacts; first violet breaks the monochrome | Cartoon face and hand gesture readable; no abstract glowing blob |

**Stop after F04.** Drawer, inspectors, chase, memory seal, ruined sea, harbor, photograph and surveillance are queued, not authorized for production. Do not batch beyond the gate.

## Design lock proposal (pending review)

All colors are project proposals, not official Chog color specifications: ink `#161220`, paper `#F8F3E8`, violet `#794CFA`; lilac `#E5D5FF` only inside Pip's memory marks. No environmental neon wash. Pink is reserved and unused in batch 01. Neri, Sera and Rook remain monochrome. In archive and close-up there is no violet at all.

- **Neri:** short ink-black bob with broken fringe; single pale rectangular barrette on viewer-right; one small under-eye beauty mark on viewer-right. Large but adult-proportioned dark eyes, fine brows. High paper collar, dark practical uniform, two pale fasteners, worn cross-body satchel with stitched flap. Curiosity before panic. Never age down, change hair length, move the barrette or omit the satchel in a full-body view.
- **Pip:** spiky star-like violet head outline; pale inset face, large glossy oval eyes, dot nose, asymmetrical grin, compact body and mitten-like hands. Original fan-story costume detail: a folded-paper collar, one nick in a head spike. Height about Neri's forearm; never human-sized, photorealistic, horned, monstrous or a generic purple orb. Expressions: cocky welcome and uncertain memory. References are not permission to reproduce official art.
- **Sera:** sleek dark side-parted hair, narrow eyes, straight eyebrows, long angular captain's coat with paper-colored lapels; dark glove and rectangular insignia. Straight spine, economical gestures; not smiling in authority poses.
- **Rook:** tousled swept hair, single small ring earring on viewer-left, open paper shirt and dark short harbor jacket, rope belt. Crooked smile, relaxed shoulders. Keep his nose and jaw broader than Neri's and his silhouette less rigid than Sera's.

Vector drafts deliberately simplify anatomy and fabric. Approval of composition is not approval that these are finished manga-quality drawings. If painterly/hand-inked finish is required, get explicit approval for an illustrator or a priced generation workflow; retain these sheets as continuity inputs, then review a single finished frame before extending.

## Provenance and rights

- Direction: `docs/ART_DIRECTION.md`, `docs/VOICE_AND_DEMO.md`, GitHub issue #3 in `emmaGH1/chog-1969`.
- Visual study only: `https://chog.xyz/chog/curious.png` and `https://chog.xyz/home/chog.png`, linked from the official `https://chog.xyz/` site. Inspected during this work. Downloads stay outside the repository. No official pixel assets, NFT metadata or token images are included, traced or altered.
- New SVG paths and compositions are authored for this repository. Fan-character/design and Chog name rights remain with their respective owners. Public availability of a reference is **not** a license; fan-art/brand clearance is pending before public release. No blanket CC/public-domain license is asserted.
- Pip is an independent story character, not Chog Genesis #1969, not an authorized token derivative, and not an alteration of collectible artwork. Keep that distinction in gallery, credits, UI and demo.
- No stock media, unlicensed music, cloned voices or third-party font files are bundled. Raster artwork is path-based except reference-sheet annotations rendered with locally available system fonts.

## Integration handoff

Application owners choose when to integrate. Manifest records exact files, dimensions, alt text and review status. Use `<picture>` with WebP and PNG fallback; choose the portrait asset at narrow breakpoints, **not** a center crop of the wide shot. Preserve essential faces, Pip's hand gesture and discovery page. Render dialogue, title and controls in HTML rather than burning them into images. Keep captions and controls outside key faces. The gallery is a local review document, not a deployed site or evidence of in-product integration.

## Approval checklist

1. Neri face/age, Pip's recognizable cartoon identity and distance from collectible artwork.
2. Sera and Rook silhouette/wardrobe locks (story-owner approval for invented details).
3. Four compositions, title-safe space, phone readability and selective violet.
4. Finish level: use these as vector drafts, or authorize a priced finishing workflow.
5. Fan-art/brand use, desired attribution and publication permission.
6. Licensed prerecorded voice provider/budget and consenting voice talent; music source/license or silence.
7. Only then authorize the next art batch. Deployment, paid generation and chain transactions remain separate approval gates.

## Validation performed / limitations

- `node scripts/check-media-assets.mjs`: PASS for all 12 assets / 36 source+raster files. Valid dimensions, byte budgets and hashes; local preview links resolve; descriptive alt text; no external/executable SVG content; no violet fill/stroke in archive or Neri close-up; violet retained in cover and awakening. Combined source+raster delivery is approximately 1.81 MiB, excluding the gallery/contact sheet.
- Parsed all 12 SVG sources and 8 performance XML files with Python's standard-library XML parser: PASS. SVG narrative art has no baked dialogue text.
- `node scripts/prepare-voice-lines.mjs --check`: PASS. All eight spoken lines match the verbatim brief; editorial markup changes no spoken words. No recorded outputs falsely claimed.
- Complete media rebuild compared by SHA-256 against an immediate second build in the same environment: identical. Re-run `all` after changing geometry or raster settings, then re-run the checker.
- Inspected model-sheet renders and all four wide compositions; reviewed all four portrait compositions at 390 px image width. This is an image-readability check, **not** real phone/browser QA. Schematic profile/three-quarter views, simplified hands/cloth and some spatial staging still need an illustrator's finishing pass if final manga quality is required.
- `npm run typecheck`: PASS. `npm run build`: PASS, with an existing `src/app/globals.css` Autoprefixer warning about `end` versus `flex-end`. No application code or styling was changed. Next's build-generated change to `next-env.d.ts` was restored; the pre-existing untracked lockfile was not staged.
- Not tested or claimed: in-app illustration integration, live RPC correctness, holder ownership, wallet writes, actual phone interaction, deployed URL, audio recordings, final video or final art approval. Coordinate those with their owners.

## Review request to integrator

Review `public/media/contact-sheet.png` first, then the four character sheets and portrait pairs in the gallery. Reply with: (a) character changes, (b) composition approval per F01–F04, (c) whether to integrate these **as drafts** or request final hand-inked/painted finish, (d) brand/fan-art clearance, (e) any approved voice/music/provider budget. This delivery stops at the first-batch gate. Do not close issue #3 as fully done: prerecorded audio and final visual approval remain outstanding.
