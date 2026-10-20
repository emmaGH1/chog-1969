# Round-two Pip gallery verification / QA

Issue #11 implementation on `feat/nft-memory`, extending PR #7. No user selection, holder identity publication, wallet prompt, site deployment, live contract deployment, gas spend or transaction.

## Polished unified gallery follow-up

The current `/archive/pip-candidates` replaces the former thumbnail sheet + repeated dossiers with **one card per character**: unaltered original image, onchain ID, metadata name, actual trait highlights, fictional personality, expandable full traits and provenance, and original-token source link. Search accepts token IDs, display names and traits; four archetype filters combine with search; the empty state resets to all twelve. No selection is recorded or persisted.

- [Polished full Android-width gallery](review/pip-gallery-polished-android.jpg) · [Polished full desktop gallery](review/pip-gallery-polished-desktop.jpg). Both are local browser captures containing all twelve cards, not deployment claims.
- 14 current test cases passed (13 app/data/search tests and one local-EVM suite), typecheck and production build passed.
- Final production build tested with Android-emulated Pixel 7 settings at 360/375/412px and desktop 1440px. All twelve unaltered 1000×1000 WebPs loaded; no horizontal overflow or page JS errors; token-ID search, display-name search, trait search, combined filtering, empty state/reset, complete traits and provenance controls passed. Source/disclosure/filter controls were checked at 44px minimum height.
- Axe automated checks tagged WCAG 2 A/AA and 2.1 AA reported zero violations on each tested viewport with an expanded trait panel. This is not a claim of full accessibility conformance or physical-device QA. Keyboard focus indicators and live result counts are included; reduced-motion users receive no added animation.
- Gallery source uses exactly the frozen verified data; no artwork bytes or onchain state changed. Verification results below remain the original dated snapshot, with the subsequent fresh eight-ID recheck separately recorded in `PIP_ROUND2_RECHECK.json`.

The remainder records the initial round-two verification and comparison-sheet QA for historical context; the polished screenshots above supersede the earlier sheet layout.

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
