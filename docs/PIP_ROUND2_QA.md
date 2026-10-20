# Round-two Pip gallery verification / QA

Issue #11 implementation on `feat/nft-memory`, extending PR #7. No user selection, holder identity publication, wallet prompt, site deployment, live contract deployment, gas spend or transaction.

## Verification outcome

**12/12 requested candidates passed; zero unresolved failures; zero duplicate IDs or original artwork hashes.** All eight marketplace-preliminary display names match the actual metadata; no arithmetic conversion was used.

| Onchain ID | Actual metadata name |
| --- | --- |
| 1969 | CHOG #1461 |
| 969 | CHOG #461 |
| 42 | CHOG #1503 |
| 1968 | CHOG #1460 |
| 1552 | CHOG #1044 |
| 1053 | CHOG #545 |
| 1428 | CHOG #920 |
| 846 | CHOG #338 |
| 1848 | CHOG #1340 |
| 467 | CHOG #1928 |
| 512 | CHOG #4 |
| 1620 | CHOG #1112 |

RPC chain 143, canonical collection `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`; all existence (`ownerOf`, address discarded) and tokenURI reads at block **115063901**. Exact block hash, chain timestamp and runner verification time are in `public/nft-candidates/provenance.json`. Raw metadata and unchanged artwork files have SHA-256 hashes; original images are WebP, 1000×1000. Gateway-fetched content is not independently checked against IPFS CIDs. No copyright/adaptation license is inferred.

**Transient issue:** initial exploratory read of token 512 obtained chain data but could not retrieve metadata through the gateways. The subsequent full verification run retrieved CHOG #4 metadata, raw JSON and the original image successfully. It is not an unresolved candidate failure or a substituted token. No other candidate failed the final run.

Failure policy: every requested ID is accounted for exactly once as verified or failed. The script records a sanitized failed stage, omits that candidate from verified cards/contact sheets, and does not publish a fabricated image/name or owner address. It makes one bounded metadata retry across the fixed gateways. On a future failed run, regenerate the gallery and review the new failures before publishing; current snapshot tests intentionally require all twelve to have succeeded.

## Local validation

```sh
npx tsx scripts/verify-pip-candidates.ts
npx tsx scripts/write-pip-gallery.ts
npm test
npm run typecheck
npm run build
```

- 11 test cases passed: 10 app/data/metadata plus the isolated local-EVM contract suite. Contract source is unchanged.
- Provenance test checks all 12 IDs, absence of duplicates/holder addresses, byte hashes, raw/normalized metadata agreement, dimensions, archetype membership, failure accounting and no selected candidate.
- Typecheck and Next production build passed.
- Chromium Android emulation with Pixel 7 touch/mobile settings at 360, 375 and 412px, plus desktop 1440px: all 12 overview artworks and 12 dossier artworks loaded at natural 1000×1000; 12 dossier cards; no horizontal overflow or JS errors; source links/disclosures at least 44px high; token 512 thumbnail jumped to its correct dossier and provenance disclosure opened.
- Screenshots capture the full comparison sheet, not only the first viewport: [375px Android-width](review/pip-round2-android.jpg), [1440px desktop](review/pip-round2-desktop.jpg). Android screenshot visually reviewed. These are local browser captures, not evidence of physical Android testing or a deployed website.

## Preview / approval

[Direct GitHub gallery](PIP_ROUND2_GALLERY.md) includes a two-column comparison sheet grouped by fictional archetype, then complete artwork/trait/source dossiers. The app route `/archive/pip-candidates` presents the same data locally. No ranking by price/rarity and no approved choice. Media adaptation stays paused for user selection and rights review.
