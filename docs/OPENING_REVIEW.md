# Archive opening — private interaction review

This branch starts at `integration/pilot`, not `main`. Only the opening at `/` is replaced. The existing six-scene reader remains at `/chapter/1`; its story gates, irreversible keep/burn choice and local save remain intact. Blockchain/API/contracts/wallet code is unchanged. No deployment, memory write, spending, or public-art publication is authorized.

## Honest visual boundary

**This is playable environmental staging, not finished illustrated scene art.** The media branch was inspected: its vector Neri and invented Pip are rejected drafts and are not integrated. The exact approved Neri JPEG is available privately and matches SHA-256 `395fe4d78c74d0a60d3c483509b3daf71d5e7241369a44973ce54101e5a5ee8e`. The scene uses a matte/crop of that drawing and two expression crops, not newly invented poses. The unchanged original CHOG #545 image unfolds from the drawer. CSS constructs the temporary room, records, cabinet and folio.

Still essential for final visual fidelity:

- Approved 1920×1080-or-larger archive background, separated into foreground doorway, cabinet banks, rear wall, floor and light/shadow layers.
- Matching cabinet front, recessed drawer interior, handle, extended drawer and document/folio layers with consistent perspective.
- Transparent Neri investigation, drawer-opening and awakening-reaction poses in the exact approved design, including hand/contact layers.
- Approved awakening illustration/transition layers around the unchanged NFT original.
- Cleared environmental loop and mechanical/reveal audio. Current opt-in cues are locally synthesized tones, not finished sound production or voice acting.

Santioni redirected this VM's Chrome to its unsupported-browser page. Its live camera behavior was **not** verified, and no reference-site graphics were copied. No authenticated Chogathon portal was available in the provided handoff; the deadline remains unverified.

## Run privately

```sh
npm ci
python3 scripts/prepare-review-art.py /absolute/path/to/neri-approved-reference.jpg
npm run build
npm run start -- --hostname 0.0.0.0 --port 3103
```

The preparation helper requires Python Pillow and the fetched `origin/feat/nft-memory` ref. It fails on a Neri source hash mismatch. It verifies the original Pip bytes against the existing provenance packet. It creates only ignored `public/private-review/` files. **Do not force-add that directory, commit the user upload, or deploy this review server publicly.** A fresh clone intentionally has no private artwork; the UI reports missing assets rather than substituting illustrations.

Use the Devin authenticated browser preview for review. This is not a public deployment.

## Interaction

1. From a fresh opening, scroll or swipe upward to move the camera. Keyboard users can tab to **Move closer**.
2. Inspect both in-world papers. They reveal 19 and 69.
3. Press the brass **19 + 69 / Set index** label.
4. Drag the handle downward 120 CSS pixels, or hold it for 1.1 seconds. Keyboard: hold Enter or Space. Releasing early closes the drawer.
5. The folio emerges, opens, reveals the original NFT, then Neri reacts and Pip speaks. This is fictional awakening, not a chain transaction.
6. Continue into the existing chapter. Existing later progress/choice is never rewound. With blocked storage, the old reader remains playable but its own puzzle must be solved again.

Replay resets only the opening. The new versioned save validates both clues before accepting an open drawer. Reduced motion removes transitions; audio is off by default, optional and never gates progress. The review label must remain visible.

## Pip provenance recheck

Read-only verification performed against `https://rpc.monad.xyz` on 2026-10-22:

- Chain: **143**; collection: `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`.
- Token: **1053**, metadata name **CHOG #545**. Not token 1969.
- Block: **115729228**; hash: `0x0e5d4049631fbc1f1847f854cb3a18b77b045c758c9421058615466a5ac143c2`.
- `ownerOf` existence and `tokenURI` read at this same block. No holder address retained.
- URI: `ipfs://bafybeid4ybujnscdipkno7ps5utqelp5ry5ryreqhay3zhgk3a6x4jruqu/545.json`.
- Image: `ipfs://bafybeihau2egcccbdxymeckmmbrqytbfor5gkt3en6d5fsbueymdbq7g6e/545.webp`.
- Metadata SHA-256: `298de1bbc95adb946e40d9601a3b16bc2cfbb2e8d914819d49d132436d971037`.
- Image SHA-256: `47538955fbb298e3dc0b29f3f4e4f47f6a5c15f92f0e264295b59353be317b5c`.

Gateway metadata/image bytes independently matched the prior provenance hashes and local source bytes. IPFS CID verification was not independently performed. Provenance does not grant copyright or holder consent. No ownership or ledger state is asserted by the fictional animation.

## Checks and capture boundary

Required: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, `npm audit --omit=dev`. No lint script exists in the baseline. New focused tests: `npx tsx --test tests/opening.test.ts`.

The existing `demo:record` script is a **final approved submission** workflow for the old six-scene reader, not this opening's review recording. Its approval guards are unchanged; do not fabricate an approval attestation or bypass them. Capture the genuine running opening for the user's requested private review with browser/screen recording, preserving the staging disclaimer. Requested sizes: 1920×1080 recording, 1440×900 desktop check, functional portrait adaptation. Physical Android QA remains a separate check.
