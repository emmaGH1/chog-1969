# Issue #10 — disabled holder awakening checkpoint

Branch: `integration/pilot`. This is an incremental review checkpoint, **not approval to deploy, enable writes or transact**.

## Implemented

- Archive-only optional holder controls. Guest Chapter 1 never asks for accounts, wallet connection or signature. Connection only occurs after clicking **Connect wallet** in **Open holder controls**.
- Injected EIP-1193 wallet connection, active account/network display, explicit Monad 143 switch request. No automatic network addition; unsupported-chain and rejected/missing-wallet states are shown.
- Server-only `MEMORY_WRITES_APPROVED` must equal exactly `true`, with a valid nonzero `MEMORY_LEDGER_ADDRESS` distinct from the Genesis ERC721. Default is false; no deployment address is configured. Configuration failures fail closed. Connecting remains optional and does not enable writes.
- **Verify current ownership** works even with writes disabled or no ledger deployed. It checks wallet chain 143, reads canonical Genesis `ownerOf` at a fresh block, rechecks wallet context and displays owner/nonowner plus block provenance. This is read-only, not a signature/endorsement or permission to transact.
- Latest-block `ownerOf`, ledger `genesis()` and `memoryOf` read at a common fresh block; RPC must be chain 143. Only the current owner may prepare; approved operators have no awakening rights. Wrong collection and already-awakened tokens fail closed.
- Simulated `awaken(tokenId, Reveal|Protect)`, gas estimate and fee estimate. Human review includes chain, signer, ledger, token, permanent token-inherited semantics and estimated maximum fee. A separate unchecked confirmation box precedes requesting a wallet transaction.
- On explicit confirmation: refetch write configuration, recheck ownership/memory/account/network, resimulate and re-estimate; increased estimated cost requires a new review. Account/chain/disconnect events invalidate prepared UI. A final session/context check runs before the wallet request.
- Submitted hash shown immediately, never labelled successful before receipt. Revert, timeout, rejection and RPC failure are distinct from success. Successful proof requires a successful receipt with the exact ledger/token/owner/choice `Awakened` event, **plus matching `memoryOf` and `genesis()` at the receipt block**; empty, unrelated or cancellation/replacement receipts cannot count. Then refresh public memory. Receipt refresh failure does not invent memory state.
- Public **Refresh memory status** is independent of wallet connection. Permanent choice is read from the ledger through the archive API after refresh/reload; browser storage never supplies canonical success. Already-awakened tokens cannot prepare another transaction.
- Submitted transaction context is stored in sessionStorage as an untrusted recovery hint, scoped to token and configured ledger. **Verify submitted receipt** revalidates the event and onchain memory without a wallet after timeout/reload. Pending context blocks repeat preparation until verified or explicitly forgotten; forgetting a hint does not cancel a transaction. Unavailable storage does not stop tracking in the current tab.
- Fixed a signer-normalization bug discovered by the enabled mocked browser flow: viem simulation may return an account object, not a bare address. The adapter now normalizes this before matching event attribution.
- Holder controls never ask for a private key/seed. The app holds no key and deploys nothing. Feature gating is an application safety control, not an onchain access restriction; the reviewed contract enforces actual ownership.

## Validation / limits

Linux, Node 22.23.3 / npm 10.9.9:

- `npm ci`, `npm test` (**38 tests**), `npm run typecheck`, `npm run build`, `npm audit --omit=dev`: pass; production audit **0 findings**.
- Full audit remains **7 development-only Ganache findings** (1 critical, 5 high, 1 moderate), not resolved; see `INTEGRATION_GATE0.md` for isolation/risk assessment. No new dependencies were added.
- New unit coverage: default-off configuration, missing/wrong/zero ledger, no wallet access with disabled writes, wrong network, nonowner, wrong collection, existing memory, simulation error, ownership/account/network/memory/config changes after review, increased gas, stale session, explicit submit, signature rejection, reverted/timed-out receipt with retained hash, and exact receipt event matching.
- Production browser checks at 375px and 1280px: no guest wallet requests; disabled write controls; absent injected provider; mock active account and wrong chain; unsupported switch; disconnect invalidation; rejected connection; no transaction method invoked. Guest and live archive regression harnesses also pass, including token 1969 → CHOG #1461 and its original 1000px art.
- **Mocks/local EVM only for writes.** The enabled flow has not been exercised with a real wallet, a deployed ledger, or a genuine holder. Mobile checks are desktop Chromium emulation (one mobile/touch context), **not physical Android Chrome certification**. Existing CSS/µWS fallback warnings remain nonfatal.
- `tests/holder-flow.browser.mjs` now exercises the real browser adapter with fully intercepted RPC and a mock injected wallet: read-only owner verification with the gate off; enabled simulation → explicit unchecked confirmation → one mock send → exact event and persisted memory verification → archive refresh → reload → wallet-free receipt recovery; rejected signing, nonowner, simulation revert, missing event and mismatched ledger memory all fail safely. It also covers account-change events during connection. No real RPC write, wallet or live deployment is used. This caught the account-object normalization bug missed by pure controller mocks.
- CI now runs the mocked enabled/disabled holder flows and guest browser regressions against a loopback production server, using isolated pinned Playwright tooling outside the application dependency tree. Real archive reads remain a separately run smoke check to avoid chain/gateway availability determining CI results.
- Mocked adapter E2E is **not deployed-ledger E2E or real wallet compatibility proof**. A reviewed local deployed-ledger + injected-provider suite and human-approved real-holder validation remain release checks.

## Preview

Private combined production app: **http://127.0.0.1:3103** on the builder host.

```sh
ssh -N -L 3103:127.0.0.1:3103 <your-ssh-host>
```

Open http://localhost:3103/chapter/1 for wallet-free guest play (drawer **1969**), or http://localhost:3103/archive → **inspect seal** → **Open holder controls**. Real wallet connection/switch is optional and user-initiated; leave it disconnected for a purely read-only preview. The current config endpoint returns `{"enabled":false,"ledger":null}`.

Restart if needed:

```sh
cd /home/builder/projects/chog-integration
npm ci
npm test
npm run typecheck
npm run build
npm audit --omit=dev
npm run start -- --hostname 127.0.0.1 --port 3103
```

Optional browser checks require separately installed Playwright/Chromium:

```sh
export PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs
export CHROME_PATH=/absolute/path/to/chrome
export STORY_BASE_URL=http://127.0.0.1:3103
node tests/holder.browser.mjs
node tests/holder-flow.browser.mjs # intercepts ALL wallet/RPC transaction behavior; no real sends
node src/components/chapter/browser.test.mjs
node tests/archive.browser.mjs
```

## Approval / review gates

1. **Companion selection unresolved.** Onchain token 1969 / metadata name CHOG #1461 is verified in the archive but not approved as fictional Pip. Ask the user to select it or request other verified candidates; do not imply endorsement, identify the person behind the holder address or invent a replacement.
2. Hero art still requires user visual approval. Media PR #8 stays separate. Capture checklist: [`DEMO_CHECKLIST.md`](DEMO_CHECKLIST.md). No recording, narration, video render or upload has happened in this milestone.
3. Wallet/controller/security review, local deployed-ledger wallet E2E, and physical Android UI QA are outstanding. Permanent decision semantics and contract source remain unaudited.
4. A human must explicitly approve reviewed deployment, record verified ledger address/chain/source, approve real-holder testing, and approve each live transaction. Only then may an authorized operator consider setting `MEMORY_LEDGER_ADDRESS` and `MEMORY_WRITES_APPROVED=true`. Never set them as part of demo setup by default. A wrong ledger collection is blocked at preparation, but `genesis()` matching is not a bytecode audit.
5. In-flight ownership changes can still revert at execution; wallet prompts must be reviewed independently. A single confirmed receipt is reorg-sensitive. RPC/gateway/hosting rate-limit trust and development Ganache risk remain as documented at Gate 0.
6. No merge to main, public deployment, gas spend, real wallet signing, deployment or submission occurred. Actual submission deadline remains unverified in the signed-in portal.
