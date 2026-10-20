# Gate 0 — tested integration pilot

Checkpoint: 2026-10-20 · branch `integration/pilot` · [issue #9](https://github.com/emmaGH1/chog-1969/issues/9).

## Integration boundary

- Integrated chain PR #7 at `f4172d2` via merge `d1440eb`, then story PR #6 at `3c22fd5` via merge `17ae5b7`. Both merged cleanly; no conflict resolutions or forced resets were needed. Security/test changes: `faa3ba0`.
- Media PR #8 / `feat/media-assets` remains separate. No draft media assets were integrated or approved. Existing geometric chapter stages remain explicitly labelled as layout previews awaiting narrative illustration approval.
- No main merge, public deployment, real wallet connection/signature/transaction, contract deployment or gas spend. Contract tests use simulated local accounts only. No secret/key access was needed.
- [GitHub CI for code checkpoint](https://github.com/emmaGH1/chog-1969/actions/runs/39427895523): **success** (clean install, 14 tests, typecheck, production build, production audit).

## Reproducible validation

Node **22.23.3**, npm **10.9.9**, Linux:

| Command/check | Result |
| --- | --- |
| `npm ci` | Pass after repairing lockfile; repeated after final dependency changes |
| `npm test` | **14/14 pass**: 4 story progress tests + 10 contract/API/metadata tests |
| `npm run typecheck` | Pass |
| `npm run build` | Pass, Next.js **15.5.28** |
| `npm audit --omit=dev` | **0 vulnerabilities**, exit 0 |
| `npm audit` | **7 development-only findings**: 1 critical, 5 high, 1 moderate; exit 1 |
| Production Chromium guest flow, 375×900 and 1280×900 | Pass: both routes, incorrect/correct drawer code, unlock/choice refresh persistence, scene focus, previous scene, restart cancel/confirm, malformed saves, overflow; blocked storage remains playable with warning |
| Production Chromium archive, 375×900 and 1280×900 | Pass: real token, original artwork loaded at natural width 1000px, unknown/unconfigured ledger, missing-token feedback, no horizontal overflow or uncaught page errors |
| Production API | `/api/nft/1969` → 200, `/api/nft/0` → 404, `/api/nft/-1` → 400 |

Browser checks ran against the combined loopback-only production server on port 3103. Mobile screenshots were visually inspected; [drawer](evidence/integration-gate0/drawer-375.png) and [archive](evidence/integration-gate0/archive-375.png) are integration evidence, **not approved narrative art or physical Android testing**.

Live read sample: Monad chain **143**, canonical Genesis collection `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`, block **115047884**, checked **2026-10-20T13:06:45.390Z**. Onchain token **1969** returned metadata name **CHOG #1461** and original image `ipfs://bafybeihau2egcccbdxymeckmmbrqytbfor5gkt3en6d5fsbueymdbq7g6e/1461.webp`. This is a candidate/archive lookup, **not user approval of Pip**. Ownership and tokenURI are block-pinned public RPC reads, not independent holder consent or proof of a live awakening. Ledger status is `not-configured` / unknown.

### Dependency remediation and residual risk

The inherited lockfile initially failed `npm ci` on Linux with `EBADPLATFORM` for Ganache's nested `fsevents@2.3.2`. Regenerating the lockfile removed thousands of extraneous bundled-package entries; the remaining macOS-only nested fsevents entry is marked optional. Recheck that marker if a later npm install rewrites Ganache's bundle metadata.

Baseline `npm audit --omit=dev` reported **33** findings (1 low, 8 moderate, 19 high, 5 critical), mixing vulnerable Next.js with extraneous Ganache bundle entries. Remediation:

- Next.js **15.5.18 → 15.5.28** patches the framework's direct critical advisories without a major-version migration.
- Narrow Next.js overrides: **PostCSS 8.5.31**, **Sharp 0.35.5**, removing remaining CSS source-map/file-disclosure and image-codec advisories. These override Next's pinned/optional dependency ranges; install, typecheck, build and production browser checks pass, but future Next upgrades must re-evaluate them. Archive art uses original external `<img>` URLs, not Next image optimization; not every Sharp codec was exercised by browser QA.
- Test compiler updated to **solc 0.8.37**, with **tmp 0.2.7** override to address its remaining temporary-path advisory; contract tests rerun successfully.
- CI now includes `integration/pilot`, uses `npm ci`, runs story progress tests under `npm test`, and **fails on production audit findings** while uploading the raw audit artifact.

Final raw reports: [production audit](evidence/integration-gate0/audit-production.json), [full audit](evidence/integration-gate0/audit-all.json). Counts are from explicit post-install `npm audit` commands; npm's install-time summary can include additional bundled entries and is not the final tree assessment.

All remaining findings are under the **development-only Ganache 7.9.2 test tree**:

| Package | Severity | Risk |
| --- | --- | --- |
| elliptic | Critical | Malformed signing inputs can disclose test keys; additional signature-validation advisories |
| secp256k1 | High | ECDH private-key extraction |
| lodash | High | Template injection / prototype pollution |
| ws | High | DoS and memory disclosure |
| @trufflesuite/uws-js-unofficial | High | Inherits ws advisories |
| ganache | High | Inherits vulnerable bundle dependencies |
| bn.js | Moderate | Infinite loop on crafted input |

These are **real unresolved development risks**, not labelled false positives or a clean full audit. Ganache/solc are not imported by `src` or included in generated route dependency traces. Tests instantiate an in-process EVM with disposable synthetic accounts and locally controlled inputs, not a public RPC listener. Do not load real keys, accept untrusted contracts/signing input, or expose this test EVM. Production must omit dev dependencies. npm suggests an old major Ganache downgrade for some findings, which is not a verified safe replacement; bundled packages are not reliably fixed by ordinary root overrides. Replacing the test EVM or isolated upstream bundle remediation remains a security follow-up. This is a bounded local-test assessment, not contract audit or public-release authorization.

Nonfatal existing warnings: global CSS autoprefixer `end` versus `flex-end`; Ganache native µWS module unavailable on Node 22, with successful JS fallback. Neither caused a failed build/test.

## Open the combined app privately

Current worktree: `/home/builder/projects/chog-integration`. A production server is running on **127.0.0.1:3103** (log `/tmp/chog-integration-preview.log`). On the same host:

- http://127.0.0.1:3103/ — cover
- http://127.0.0.1:3103/chapter/1 — complete guest chapter; drawer code **1969**
- http://127.0.0.1:3103/archive — inspect token **1969** for real metadata/artwork

From your computer, keep it private with SSH forwarding:

```sh
ssh -N -L 3103:127.0.0.1:3103 <your-ssh-host>
```

Then open `http://localhost:3103/chapter/1` or `/archive` in your local browser. No public preview URL was created. If the server stops:

```sh
cd /home/builder/projects/chog-integration
git switch integration/pilot
npm ci
npm test
npm run typecheck
npm run build
npm audit --omit=dev
npm run start -- --hostname 127.0.0.1 --port 3103
```

Browser regression harnesses (separate Playwright/Chromium installation; not added as runtime dependencies):

```sh
export PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs
export CHROME_PATH=/absolute/path/to/chrome
export STORY_BASE_URL=http://127.0.0.1:3103
export STORY_EVIDENCE_DIR=/tmp/chog-integration-evidence
node src/components/chapter/browser.test.mjs
node tests/archive.browser.mjs
```

## Remaining gates / blockers

1. User selection of an authentic Genesis companion and approval of one hero scene; draft media stays outside this branch.
2. Physical Android Chrome QA and final illustrated-panel interaction/visual review; desktop emulation is not phone sign-off.
3. Development Ganache security follow-up above; production zero-findings is not a blanket security guarantee. Hosting rate limits/egress policy, contract audit and public-release review remain outstanding.
4. MemoryLedger is undeployed and writes disabled. Any deployment or live holder transaction requires separate explicit approval and a consenting holder; no mainnet write is claimed.
5. No narrated demo, final audio, public deployment or submission. Actual deadline still needs confirmation in the signed-in portal; not inferred from public dates.
