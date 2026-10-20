# Media production — batch 01 / review drafts

## Current boundary

Work branch: `feat/media-assets`. Own only `public/media`, `public/audio`, media scripts and documentation. No application integration, deployments, purchases, API requests to paid generation services, or transactions. The pre-existing untracked `package-lock.json` is not part of this work.

**Production method:** original, code-authored SVG illustration, rasterized locally with the repository's installed Sharp. These are editable vector **art-direction drafts**, not approved final manga or generated raster paintings. No model/API spend. Character geometry is reused between reference sheets and frames to prevent face drift. Do not imply a rendered voice file or a recorded demo exists when it does not.

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
