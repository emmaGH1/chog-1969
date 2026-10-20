# Media production — review response / Genesis selection hold

## Current authority and status

**First creative batch reviewed, NOT approved as final.** The PR #8 review and canonical NFT override on main supersede the invented Pip design and all earlier prompts that asked for it. `docs/ART_DIRECTION.md` now includes that main override. Current one-shot brief and approval sequence: **`docs/HERO_SCENE_APPROVAL.md`**.

All Chog characters must originate from verified Chog Genesis NFTs. **Pip is only a fictional nickname for one actual, explicitly user-selected NFT.** The fabricated violet creature in batch 01 is rejected, not a candidate, approved adaptation or token image. Keep its historical files only to preserve the review record; do not generate, integrate or use them as Chog identity references.

No token selection is approved in the inspected discussions. Chain's requested 3–5-candidate shortlist is a dependency, not a completed media deliverable. Token ID 1969 / metadata display CHOG #1461 is merely one candidate mentioned by Chain/main, not automatically Pip. Do not infer a token from the project title or use display numbering as onchain ID.

Branch: `feat/media-assets`. Ownership remains media/docs/media scripts only. No application/contract changes, deployment, purchases, paid generation calls, wallet actions or secrets. The pre-existing untracked `package-lock.json` remains untouched.

## Preserved references — no artwork overwritten

| Existing files | Current use |
| --- | --- |
| `public/media/references/{neri,sera,rook}-sheet.{svg,webp,png}` | Retained original human identities and wardrobes, not final anatomy/illustration. Improve expression, hands, weight and spatial acting without redesigning them. |
| `public/media/references/pip-sheet.{svg,webp,png}` | Rejected invented Chog; historical evidence only. Never a real-NFT reference or accepted character. |
| `public/media/frames/{cover,archive,neri-closeup,pip-awakening}-{wide,portrait}.{svg,webp,png}` | Preserved first-pass compositions/staging. All are reference-only, not shipping panels. Cover and awakening contain the rejected invented Chog. |
| `public/media/contact-sheet.png` | Original historical contact sheet, unchanged. Its embedded approval-pending caption is now outdated; gallery/manifest carry the rejection notice. |
| `public/audio/lines/*.txt` and `*.performance.xml` | Exact existing dialogue and direction retained. No recordings. Chog role/voice interpretation remains provisional until actual NFT selection and hero approval. |
| `scripts/build-media-assets.mjs` | Legacy geometry/source retained, but entry point is **frozen** and refuses rendering. It must not recreate generic Pip or rewrite the new policy manifest. |

All 36 existing SVG/raster files retain their original recorded SHA-256 values. Human designs, exact line files and all compositions are preserved. No new illustration or Chog replacement is delivered in the review-response commit.

## New handoff / coordination

- Chain request: [PR #7 comment](https://github.com/emmaGH1/chog-1969/pull/7#issuecomment-6291535061). Requested actual IDs distinct from names, original images/traits, raw metadata and hashes, verification block/hash/time and public links, without holder identity.
- Pending machine-readable record: `public/media/hero/selection.json`. Token ID, selected display name, source art, traits, verification, approvals and output paths remain **null**. No fixture or invented artwork stands in for the selection.
- Single-hero brief: `docs/HERO_SCENE_APPROVAL.md`. A significantly more cinematic low three-quarter archive encounter with weighted hands/record contact, real depth, expressive adult Neri and the chosen authentic Chog. Proposed wide + portrait versions are one event, not a new art batch. No render exists yet.
- Current gallery: `public/media/review.html`. Human references first; rejected invented Pip separately labeled; every legacy composition marked reference-only. It is not a candidate gallery, deployed product or integration proof.
- Manifest: `public/media/manifest.json`. Overall status superseded/not for integration; human-reference, historical-layout and rejected-Chog statuses are explicit. Artifact hashes remain the preservation record, not approval evidence.

Open the HTML directly or serve only locally:

```sh
python3 -m http.server 8008 --bind 127.0.0.1 --directory public
# Open http://127.0.0.1:8008/media/review.html on this machine.
```

Current checks (no network or spend):

```sh
node scripts/check-media-assets.mjs
node scripts/check-hero-handoff.mjs
node scripts/check-hero-handoff.mjs --require-ready  # expected exit 2 while unselected
node scripts/prepare-voice-lines.mjs --check
node scripts/build-media-assets.mjs all           # expected exit 2: FROZEN, no files changed
```

Do not use the previous `all`/`references`/`scenes` rebuild instructions. They are superseded by the freeze. No new illustration pipeline is authorized by this commit. Old reference rasterization used Node v22.23.3, Sharp 0.34.5, libvips 8.17.3 and local DejaVu Sans; lossless WebP and 128-color PNG files are retained as delivered.

## Rights, source authenticity and portrayal

- Original brief: `docs/ART_DIRECTION.md`, exact voice lines in `docs/VOICE_AND_DEMO.md`; new authority is the [PR #8 review](https://github.com/emmaGH1/chog-1969/pull/8#pullrequestreview-5584906637) and canonical NFT rule from main `3438ab3`.
- Historical batch: original code-authored SVG paths, not image-model paintings or finished hand-inked manga. Official `https://chog.xyz/chog/curious.png` and `https://chog.xyz/home/chog.png` were visual study only, not token verification or licenses. Their pixels were not bundled, traced or altered. That study **did not satisfy** the real-NFT identity requirement.
- Future Chog identity must come from Chain's verified tokenURI, metadata, attributes and unchanged original image. Keep that original and its hash separate from any labeled scene interpretation. Do not recolor authentic traits into the project palette, add the old invented collar/head/hands, rename metadata or imply generated art is collectible art.
- Human cast, locations and speculative story roles remain original. Preserve the human designs and exact scripts, but attach Chog roles only to actual selected tokens. No holder identity/likeness or official endorsement.
- A public token image, blockchain ownership record or metadata URL is **not** permission to adapt or publish it. Rights, attribution and any upload of references to an image service need review. No blanket license is asserted.
- No stock music, cloned voices, paid media or third-party font files are bundled. No audio recordings or demo footage exist.

## Required approvals in order

1. **Chain shortlist + user choice:** 3–5 genuine candidates, explicit token ID selected as Pip. Additional Chog roles also need their own verified identities; no invented witness/extra.
2. **Source/traits and rights:** unchanged original shown beside proposed portrayal; exact traits/colors, verified provenance, permission scope, attribution and original-versus-interpretation treatment approved.
3. **One hero execution:** approve the cinematic staging and a method that can meet the higher-fidelity review. Do not deliver another smooth schematic vector stand-in as the finished answer.
4. **Separate spend approval:** specific provider/model or illustrator, reference-upload permissions, maximum attempts and budget **before** any paid/unknown-cost call. Tool availability does not establish free usage. No API secret requests or commits.
5. **Art review:** one wide/portrait hero composition only, original-versus-interpretation preview, actual source/output hashes and 375–390 px readability. User NFT choice is not scene approval.
6. **Later gates remain held:** app integration, actual phone QA, further scenes, voice synthesis/music, demo capture/publication, deployment and any chain write each require their appropriate approval. Do not close issue #3 or portray PR #8 as final manga.

## Validation scope

The updated media checker validates preservation hashes/dimensions, local gallery links, explicit rejected/reference-only statuses and the renderer freeze. A passing file check is **not art approval** or NFT verification. The hero-handoff checker reports pending inputs and fails `--require-ready` while they are absent. The exact dialogue checker still compares all eight lines to the existing brief. No new NFT verification, phone capture, art generation, recording or final hero is claimed.

Historical local `npm run typecheck` and `npm run build` passed for batch 01, with the existing CSS `end`/`flex-end` warning. Those results are not a claim that current main is integrated, audited or deployed. This response makes no application changes.
