# Dependency security follow-up to PR #7

Runner date: 2026-10-20 UTC. Proposed source/lockfile changes only; **no public deployment or transactions**. These results describe the npm advisory database at audit time, not a guarantee that the application is free of vulnerabilities.

## Findings and reachability

| Boundary | Before | After |
| --- | --- | --- |
| Root `npm audit --omit=dev` | 33 reported findings: 5 critical, 19 high, 8 moderate, 1 low (included Ganache bundled/extraneous tree) | **0** |
| Root `npm audit` including app build/test dependencies | Not separately captured before | **0** |
| Fresh root production-only install, `npm ci --omit=dev`, then audit | Not separately captured before | **0** |
| Separate contract test package `npm --prefix contracts/tooling audit` | Previously mixed into root tree | **9**: 1 critical, 6 high, 1 moderate, 1 low; **not remediated** |

The three non-Ganache root production package entries were Next.js (**critical**, multiple framework advisories), PostCSS (**high**, source-map file-reading/stringification advisories), and Sharp (**high**, native image-processing advisories). See full advisory URLs/ranges in [the original JSON](security/app-production-before.json). Next.js serves the public App Router; patch it even though the present app does not define Server Actions, rewrites, or use `next/image`. PostCSS handles trusted project CSS at build time. Sharp is an optional Next.js runtime dependency; original NFT artwork uses browser `<img>`, not the optimizer. Those narrower current paths reduce some exposure but do not justify retaining affected framework packages.

Ganache's nested bundled development dependencies were included in the previous root `--omit=dev` audit. That number was not a precise production-reachability count. Isolation now gives an honest app/tooling boundary instead of treating dev EVM vulnerabilities as public-route imports—or claiming they have been patched.

## Proposed patch (separate security commit)

- Pin **Next.js 15.5.18 → 15.5.28**, staying on the same maintenance/minor line. npm's actual audit recommendation was 15.5.28; no blind `npm audit fix --force` or major framework migration.
- Update locked optional **Sharp 0.34.5 → 0.35.5**. Next 15.5.28 declares `^0.34.3 || ^0.35.5`; this is within its supported range, not a forced override.
- Scope an exact **PostCSS 8.5.31** override to `next`. Next 15.5.28 still declares 8.4.31, so upgrading Next alone does **not** resolve this advisory. This is a deliberate 8.x compatibility deviation; Next production build, typecheck and browser QA passed. Reassess/remove the override when Next's own dependency is patched.
- Declare Node **>=20.9.0**, the minimum of the patched Sharp dependency. CI uses Node 22; test/build runner is Node 22.23.3.
- Move Ganache, solc and the local EVM test to **`contracts/tooling/`**, a private independently locked package, **not an npm workspace or root dependency**. Root keeps its small application test runner `tsx` as dev-only. No contract or contract semantics changed.
- Root `npm test` runs app tests plus the isolated contract test. CI installs both lockfiles with `npm ci`, gates on the root production audit, then tests/types/build. The tooling audit is recorded explicitly, not silently counted as clean.

### Remaining test-tooling risk and proposed follow-up

[Tooling audit JSON](security/contract-tooling-audit.json) reports: elliptic (critical); Ganache, secp256k1, lodash, ws, bundled µWS, and tmp (high); bn.js (moderate); solc (low). Several are meta-vulnerable entries propagated through dependencies, not nine separate app exploits. Ganache bundles dependencies, so root overrides are not a reliable patch for that bundle. Blind forced fixes or swapping crypto primitives risks invalidating tests.

Run this tooling only for fixed repository tests in an ephemeral CI/local process: **never expose a test RPC, import it into Next routes, use real keys, compile untrusted contracts, or use its crypto to sign a live transaction**. The present tests use Ganache's in-process provider and simulated accounts only. Next follow-up: replace Ganache with a maintained local EVM/test runner in a separate reviewed PR, preserving the authorization/transfer/event/failure assertions; upgrade the compiler with bytecode/test review rather than patching bundled compiler internals. This remains a supply-chain/CI risk and needs integration-owner acceptance; isolation is containment, not remediation.

## Commands and recorded evidence

```sh
# Baseline, before edits (exit 1 due advisories):
npm audit --omit=dev --json

# Candidate patch preparation:
npm uninstall --save-dev ganache solc --no-audit --no-fund
npm install --save-exact next@15.5.28 --no-audit --no-fund
npm update sharp --no-audit --no-fund
# Add scoped PostCSS override and independently locked contracts/tooling manifest.
npm install --no-audit --no-fund
npm --prefix contracts/tooling install --no-audit --no-fund
npm --prefix contracts/tooling prune --package-lock-only --no-audit --no-fund

# Validation (all succeeded except tooling audit intentionally exits 1):
npm ci --no-audit --no-fund
npm --prefix contracts/tooling ci --no-audit --no-fund
npm audit --omit=dev --audit-level=high
npm audit --json
npm --prefix contracts/tooling audit --json
npm test
npm run typecheck
npm run build
npm ls next postcss sharp

# Independent clean directory containing only root package.json + package-lock.json:
npm --prefix /tmp/chog-prod-audit ci --omit=dev --no-audit --no-fund
npm --prefix /tmp/chog-prod-audit audit --omit=dev --json
```

The first Ganache tooling lock generation included 317 extraneous bundled development nodes and caused `npm ci` to reject a Darwin-only fsevents entry on Linux. `npm prune --package-lock-only` removed those extraneous lock entries; **a subsequent clean tooling `npm ci` succeeded**. Do not reintroduce an unpruned generated tooling lock or bypass platform checks with `--force`. The remaining declared/bundled dependencies are still audited separately.

Artifacts:
- [Before root production audit](security/app-production-before.json)
- [After root production audit](security/app-production-after.json)
- [After root all-dependency audit](security/app-all-after.json)
- [Independent clean production install audit](security/clean-production-install.json)
- [Remaining isolated tooling audit](security/contract-tooling-audit.json)

Validation: **11 test cases** (10 application/metadata/gallery, 1 local-EVM suite with multiple contract assertions), root and tooling clean installs, typecheck and Next 15.5.28 production build passed. Desktop 1440×1080 and mobile 390×844 gallery checks loaded all four original 1000×1000 images with no overflow or JS errors. Physical Android remains untested. Existing global CSS autoprefixer warning and Ganache's successful JS µWS fallback remain nonfatal. Remote CI on security commit `f1c3f50` also passed: [branch check, 47s](https://github.com/emmaGH1/chog-1969/actions/runs/39428639005) and [PR merge check, 61s](https://github.com/emmaGH1/chog-1969/actions/runs/39428644173). The workflow includes both locked installs, production audit gate, tests, types and build. This is not deployment approval.

Reference advisories include [Next image optimization](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [Next cache poisoning](https://github.com/advisories/GHSA-mcj8-r9mp-w47p), and the exact npm `via` records in the before JSON. Version decisions were verified against npm registry manifests/audit output, not inferred solely from search summaries. No changes were made to React, the RPC network, the deployed NFT collection, or the undeployed MemoryLedger.
