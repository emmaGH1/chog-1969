# One cinematic Genesis hero — approval brief, not produced artwork

## Current decision / authority

**HOLD. No token has been approved as Pip and no new scene has been rendered.** Read the review on [PR #8](https://github.com/emmaGH1/chog-1969/pull/8#pullrequestreview-5584906637) and the [next-sprint handoff](https://github.com/emmaGH1/chog-1969/pull/8#issuecomment-6291024795). The canonical NFT override in `docs/ART_DIRECTION.md`, read from main at `3438ab3`, supersedes the old invented-spirit design. Integration acceptance: `docs/INTEGRATION_SPRINT.md` on main / issue #9.

All Chog characters must originate from actual verified Genesis NFTs, not just Pip or the surviving-seal inserts. Pip is a fictional nickname/role for a **specific user-selected token**, not a new collectible, metadata rename, unverified token number or replacement mascot. The old invented Pip is rejected as character art. Token ID `1969` / metadata display `CHOG #1461` is only a possible candidate reported by Chain, **not** the user's choice.

**Scope after selection:** exactly ONE exceptional awakening composition, delivered as a wide shot and a separately staged portrait. No later scenes, second chapter, generic Pip redraw, voice synthesis, deployment or spending. This document is a production proposal, not an asset or proof of integration.

## Chain coordination / selection packet

Request sent to [Chog Chain on PR #7](https://github.com/emmaGH1/chog-1969/pull/7#issuecomment-6291535061). **Shortlist now received:** [four authentic candidates](https://github.com/emmaGH1/chog-1969/blob/9316ddd26e7a25bd2c81dcb35f9124a9a4acd9d0/docs/PIP_CANDIDATES.md), [gallery screenshot](https://github.com/emmaGH1/chog-1969/blob/9316ddd26e7a25bd2c81dcb35f9124a9a4acd9d0/docs/review/pip-gallery-desktop.jpg), [machine-readable provenance](https://github.com/emmaGH1/chog-1969/blob/9316ddd26e7a25bd2c81dcb35f9124a9a4acd9d0/public/nft-candidates/provenance.json), pinned to gallery commit `9316ddd26e7a25bd2c81dcb35f9124a9a4acd9d0` (current inspected Chain head `62e6851bdb92a8684f53ba3837bdba0404ce3de3`). Chain reports block `115047581`, UTC `2026-10-20T13:05:53.713Z`; this is a dated read-only snapshot, not holder consent. Media inspected the gallery/traits and independently matched all four original files to Chain's SHA-256 values and 1000×1000 WebP dimensions. No new RPC/CID verification is claimed and no original image was copied into our asset set. [Acknowledged receipt](https://github.com/emmaGH1/chog-1969/pull/7#issuecomment-6291795303); requested raw metadata bytes/hash and block hash for the eventual selected-token production packet. **No user selection exists yet.**

Chain owns verification and the shortlist. Media does not select on the user's behalf. For each candidate request:

1. Canonical chain ID/collection address, **actual onchain token ID**, exact metadata display name, tokenURI, verification block number/hash/UTC and public evidence links. Keep display numbering distinct from token ID.
2. Raw metadata file and SHA-256; original unmodified image URI, gateway/source URL, local file, MIME, dimensions and SHA-256. Hash the downloaded originals before any optimization; keep verification raw files separate from scene exports.
3. Exact original trait names/values and a public gallery displaying each original **unchanged**, with a one-sentence clearly fictional role fit. No guessed traits from a thumbnail.
4. User choice recorded by an explicit approval link/comment. Neither the project title nor a convenient existing API sample is selection approval.
5. Source/trait review and rights evidence. Chain authenticity is not adaptation, reproduction or publication permission. No holder names, wallet addresses, holder likeness or endorsement claims in the creative packet.

Pending state: `public/media/hero/selection.json`. All token, image, verification and output fields remain null until real evidence exists. The canonical collection address there is supplied project configuration, not a new independent RPC certification. Do not populate it with fixture data to unblock production.

### Candidate-dependent art constraints — no selection implied

These are alternative constraints on the **same** proposed hero event, not four commissioned scenes. Exact full traits remain in Chain's pinned provenance; the summaries below are not replacements for it.

| Actual token ID → metadata name | Preserve if the user chooses it | Consequence for the one hero |
| --- | --- | --- |
| 1969 → CHOG #1461 | Chog Cap with its existing lettering, Bubblegum mouth, Smirk eyes, Coin accessory, dark jacket, Side Left; original colors/background/aura | Let authentic smirk/bubblegum carry the comedy against Neri's surprise. Frame the cap, bubblegum and coin clearly. Do not invent an open grin, greeting hand or replace cap lettering with generated text. Move Neri/camera rather than mirror the art. |
| 969 → CHOG #461 | Round Tear eyes, normal smile, Mon Cap, Cream Tuxedo, Yellow skin, Side Right; original colors/background/aura | Play Neri's alarm against the token's actual vulnerable expression. Keep tears and tuxedo visible; do not erase tears into generic glossy eyes to fit the boast. The existing line may read as fictional bravado, not a canonical trait change. |
| 42 → CHOG #1503 | Plumber headwear, BTC Coin mouth, Base eyes, dark jacket, Pink skin, Side Left; original colors/background/aura | Protect headwear and coin-mouth silhouette in both framings. Use Neri's grounded inspection pose and record mechanics for discovery; no invented prop or redraw that silently removes the coin. |
| 1968 → CHOG #1460 | Demon Horn, Red Round Eye, Red skin, White Sleeveless, Radioactive base/background, Burning Aura, Side Left | Authentic red/radioactive colors override the proposed violet preference. Stage a restrained monochrome Neri reaction without adding a new threatening monster expression, extra horns or unverified anatomy. No whole-environment purple recolor. |

Do not choose on creative fit alone or substitute metadata display numbers for token IDs. None of the candidate originals authorizes inventing an unseen full body, changing expression/pose or extracting a mascot silhouette without portrayal/rights review.

## Preserve / supersede

- **Preserve human identity:** `public/media/references/neri-sheet.*`, `sera-sheet.*`, `rook-sheet.*`. Keep Neri's short broken bob, viewer-right pale barrette and under-eye mark, adult age 19, practical dark uniform, pale high collar/two fasteners and worn diagonal satchel. Keep Sera's side-part/angular coat and Rook's swept hair/open collar/earring designs for continuity; neither needs to appear in this hero shot.
- **Improve drawing, not identity:** build believable adult anatomy, natural neck/shoulder transitions, facial planes, hands and weighted cloth. Do not rigidly trace the schematic geometry or reuse the mannequin pose. Do not change age, hairstyle, costume markers or character ethnicity through an unrelated new design.
- **Preserve script:** all eight `public/audio/lines/*.txt` and their existing direction files remain reference sources. The spoken Pip line stays exactly: “Excuse me? I'm a legendary being of unimaginable power.” Performance must later be reconciled with the selected NFT's personality without pretending that voice/role is canonical metadata. No audio generation now.
- **Preserve layouts:** `public/media/frames/*` and the contact sheet stay unchanged as rejected first-pass staging studies, not shipping panels. The cover/awakening/Pip-sheet depictions are **not** NFT character references. Do not feed them to a model as Pip identity inputs. Their staged story beats may inform the new shot; their fabricated traits must not.
- Old renderer is frozen to prevent accidental regeneration of the invented mascot. Existing raster/SVG hashes remain the preservation record. The next production workflow must be new, selection-bound and separately approved.

## Hero concept — “The record looks back”

**Emotional turn:** Neri expects a dead record. Someone real looks back, entirely unimpressed by her alarm. The institution becomes a physical threat around an intimate, funny encounter. The shot must communicate this before the reader sees a caption.

### Cinematic staging, depth and acting

- **Camera:** close, low three-quarter view from the opened record/drawer edge, roughly a natural 35–40 mm-equivalent perspective rather than a flat frontal character lineup. Establish one coherent perspective grid. Do not use lens distortion to enlarge heads or hide anatomy errors.
- **Foreground:** drawer lip and the near edge of a worn folio cut across the bottom diagonal. Neri's bracing hand presses the wood with credible finger contact; her other hand supports the record's weight. A few paper fibers and a lifted corner explain the disturbance. No floating book that no one is holding.
- **Middle plane:** Neri leans back a fraction, one shoulder turned toward danger while her hand remains planted. Her wrist, elbow and torso form a readable counter-diagonal. The satchel strap has weight and tension. An asymmetric lifted brow, widened focused eyes and a breath caught behind a slightly parted mouth express surprise becoming curiosity—not the old neutral vector face or a caricature scream.
- **Chog plane:** put the **selected token's recognizable actual artwork/appearance** at the point where Neri looks. Determine apparent size and placement only after seeing its full original and traits. Its original eye line, face, silhouette, accessories and expression take precedence over our preferred gesture; move Neri/camera to meet the token, never invent a mitten, star-head, grin or paper collar. Mischief should come from the authentic character and the timing of the reveal.
- **Background:** three receding shelf bays, irregular book spines, ladder/desk overlap and a distant high archive opening. Thick foreground ink, clear middle-plane contours, thinner distant marks. Shelf shadows should frame—not merge with—Neri's face and the Chog silhouette. This must look like a navigable archive, not a striped box or a symmetric prison grid.
- **Light/ink:** a hard, narrow paper-white light defines Neri's cheek, knuckles and page edge, opposed by deep structural blacks. Use expressive tapered strokes, economical cross-hatch and selective screen tone; hand-inked quality, not the old smooth polygon geometry or a blur filter over it. Hue is not a substitute for depth.

### Authenticity and color contract

- Present the selected original image **unchanged and completely visible** beside the proposed scene in the approval packet, with onchain ID, exact display name and attribution. Preserve the file bytes separately. Do not crop, recolor, draw over, re-encode or replace that archived original while calling it unmodified.
- First decide whether the token can appear as its original image framed on the discovered record, with the surrounding humans/space doing the cinematic acting. Display scaling/panel framing must be distinguished from changing the source art. If that produces an obvious pasted-in card rather than a coherent story shot, request approval for a clearly labeled faithful scene interpretation; do not silently redesign it.
- Any proposed interpretation is a **scene illustration**, not the NFT artwork or a metadata update. Review it side by side against every actual trait. Preserve recognizable outline, proportions, face, expression language, colors and accessories; no generalized purple substitute. Any change of pose/occluded trait needs explicit review, not an assumed license.
- Selective project violet belongs to a restrained page-edge reflection or memory accent. The actual token's colors take precedence: do **not** recolor authentic non-violet traits to meet our palette. Keep Neri, architecture and props monochrome, with at most a narrow reflected violet edge. No neon tunnel, purple fog or portal blob. No new Chog characters in the background.
- Keep dialogue, nickname, provenance labels and title in accessible HTML/captions, not generated lettering. Do not identify the holder or suggest official endorsement.

### One composition, two deliberate framings

| Output proposed after approval | Blocking and readable information |
| --- | --- |
| Wide, 1920×1080 | Near folio lower center; Neri occupies the left-middle diagonal; selected authentic Chog at the right-middle focus, with a clear eye-line connection; at least three depth planes. Keep approximately 8% side breathing room. Reserve a quiet region for dialogue without covering either face, hands or original trait markers. |
| Portrait, 1200×1600 | Re-stage camera distance and folio angle: Neri face upper-left, verified Chog to center-right, bracing hand/record below. Same event, face, costume and token identity. No automatic center crop; retain the emotional connection and contact point at 375–390 px width. If the selected art's silhouette cannot fit, change the staging rather than amputate identifying traits. |

These are proposed delivery dimensions, **not files that exist**. Record final framing after selection, not a token-independent lock. Keep a full-resolution master and optimize WebP/PNG delivery without modifying the archived NFT original.

### Interaction concept for Story to implement only after art approval

One physical illustrated interaction: inspect/lift the folio to reveal the genuine token image, then let Neri's reaction and a bounded ink/page separation sell the awakening. The selected art itself remains recognizable; no morph into the rejected generic Pip. A subtle framing shift or paper occlusion can reveal more of the same original without repainting its traits. An HTML focus/tap target must correspond to the real record in the illustration. Include keyboard activation, touch feedback, a reduced-motion still state and a guest skip. These are proposed behavior, not implemented or captured features. Do not make a chain call, wallet prompt or owner claim part of the reveal.

## Execution gate / no spending

1. Chain supplies 3–5 verified original candidates; user chooses the specific token for Pip.
2. Approve exact source/traits and original-versus-interpretation treatment, attribution and usage rights.
3. Approve this one-shot staging and an execution method capable of the requested quality. No new vector stand-in is an acceptable substitute for the review's higher-fidelity requirement. Preserve human continuity references and use only the selected authentic NFT as Chog identity input.
4. If hiring an illustrator or using image generation, approve the **specific service/model, reference-upload permission, price/maximum attempts and budget before any job**. The image tool's availability is not proof of a free allowance; unknown cost stays blocked. A genuinely no-spend local workflow also needs a documented method, not an invented claim that art exists.
5. Produce only the one wide/portrait hero, then return to review. Supply actual paths, hashes, metadata/trait mapping, original unchanged preview, interpretation label and mobile preview. Do not expand to the remaining scenes or synthesize voice just because one render succeeded.
6. User approves the visual result separately from NFT choice; only then hand off for controlled app integration. Integration, publication/deployment, audio and chain transactions retain separate approvals.

## Approval acceptance — compare against rejected first pass

- [ ] A real, explicitly user-selected token binds Pip to chain ID + collection + token ID; display name is not used as token ID.
- [ ] Unmodified original and verification packet are present; every trait and color survives the proposed depiction. No invented mascot geometry, unauthorized accessories, owner identity or metadata rename.
- [ ] Neri is unmistakably the same adult design, now with convincing acting, facial planes, hands, posture, anatomy and cloth weight.
- [ ] Record contact, eye lines, perspective and at least three depth planes read without explanatory text; scene is more than a mascot on a gradient or another flat vector layout.
- [ ] Strong black/white value structure and deliberate line quality; token colors preserved, surrounding violet controlled.
- [ ] Wide and portrait tell the same event; faces, authentic traits, hand/record contact and interaction target survive 375–390 px review.
- [ ] Original NFT art versus scene interpretation clearly distinguished; rights, attribution, method and any spend evidenced.
- [ ] Exactly one hero event, no additional scenes or audio generated; user art approval recorded before shipping.

**Next required input:** the user's explicit token selection from Chain's delivered four-candidate gallery (or a request for another shortlist), then selected-source/traits, rights and execution approvals. The present commit delivers safeguards and a significantly more cinematic production brief, not the conditional finished hero artwork.
