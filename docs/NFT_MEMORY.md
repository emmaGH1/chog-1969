# NFT memory / archive handoff

## Implemented

- `contracts/MemoryLedger.sol`: one permanent Reveal/Protect choice per token. The current `ownerOf` alone may awaken; ERC721 operators cannot. The choice and historical signer survive transfers. There is no administrator, reset, upgrade, payable entry point, or dependency on tokenURI. Invalid/EOA collection addresses are rejected on construction. Source remains unaudited and **undeployed**.
- `/api/nft/[tokenId]`: validates uint256 decimal IDs; checks actual RPC chain ID 143; reads owner and tokenURI at one explicit block; returns block/time provenance. Wrong network/RPC failures produce 502, ownerOf reverts produce 404, malformed input produces 400. No alternate NFT is silently substituted. Responses are not cached.
- Metadata: only IPFS metadata is fetched, through fixed Pinata/Filebase gateways. Redirects are prohibited, timeout is 7s per gateway, JSON is capped at 256 KiB, and text/traits are bounded. Arbitrary HTTP metadata is deliberately unsupported to avoid server-side request forgery. Missing/invalid metadata does not erase a successful ownership read.
- `/archive`: unmodified collection art, metadata display name, onchain ID, original URIs, holder, collection/explorer/marketplace links and traits. Metadata is rendered as React text, never HTML. Image failures fall back to a second gateway, never to invented art.
- Optional server-only `MEMORY_LEDGER_ADDRESS`: enables block-pinned memory reads after checking `genesis()` matches the expected collection. Unconfigured/unavailable state is **unknown**, not a claim that the NFT is unawakened. This address check is not a bytecode audit: only configure a reviewed deployment. Historical `awakenedBy` is not represented as the current owner.
- Wallet writes intentionally remain disabled. No wallet provider/signature/private key is needed for this implementation.

## Validation

```sh
npm ci --no-audit --no-fund
npm --prefix contracts/tooling ci --no-audit --no-fund
npm test
npm run typecheck
npm run build
npm run start -- --port 3102
```

The initial ten Node test cases (now eleven with the gallery provenance test) include local Solidity compilation/EVM execution, nonowner and approved-operator failure, actual reverted local receipt and unchanged state, owner success and event/time attribution, invalid choice/nonexistent NFT, permanent choice and transfer-before/after-awakening behavior. API/metadata tests cover wrong networks, block consistency, ledger collection mismatch, ID limits, RPC error redaction, safe normalization, forbidden URLs, invalid/oversized metadata and gateway fallback. These are simulated local accounts, not actual Genesis holders.

Production server smoke check: `/api/nft/1969` returned 200 with CHOG #1461 metadata and no configured ledger; `/api/nft/0` returned 404; `/api/nft/-1` returned 400. Live dossier recheck at block 115034624 reproduced the owner and metadata recorded in `CHAIN_VERIFICATION.md`.

Headless Chromium checks at 1280×900 and 390×844: actual NFT artwork loaded (1000px natural width), no document horizontal overflow, no page JS errors. Missing-token UI message was also verified at 390px. Screenshots were inspected locally under `/tmp/chog-archive-{1280,390}.png`. This is **not** physical Android Chrome testing.

## Risks / release blockers

1. **Approval required:** no deployment/live write has occurred. Review the permanent, token-inherited choice semantics before approving any deployment or spending gas. A willing real holder must then test their own wallet on chain 143, nonowner rejection, a confirmed receipt, and refresh persistence. Do not request their secret or impersonate their ownership.
2. **Dependency audit follow-up:** the original root audit had 33 findings, including baseline Next.js 15.5.18 and Ganache's bundled tree. The separate security follow-up patches the app and isolates contract tooling: root production and all-dependency audits now report zero, while `contracts/tooling` still reports nine findings. See `docs/DEPENDENCY_SECURITY.md` for exact artifacts, changes and residual risks. Isolation is not remediation of the dev EVM. Do not expose it or feed it untrusted code. Integration-owner review remains required before public release.
3. Metadata and images depend on third-party gateways and may reveal browser IP addresses. The app does not independently verify IPFS content hashes. Collection metadata is untrusted content; safe text rendering is not a guarantee of authenticity of every trait. Public RPC replies are also a trust dependency; reads can reflect a subsequently reorganized block.
4. Public API abuse/rate limiting and infrastructure egress policy belong to the hosting layer and still need production configuration. Only fixed gateway hosts are fetched server-side, but gateway availability is not guaranteed.
5. Existing global CSS emits an autoprefixer `end` compatibility warning; build succeeds. Ganache emits a native µWS compatibility warning on Node 22 and successfully uses its JS fallback.

## Explicit next approval steps (not executed)

Review this PR and contract, remediate/triage audit findings, and secure a willing real holder. After explicit deployment approval, deploy with a human-controlled wallet, verify source/constructor/chain/address, record the transaction, and set `MEMORY_LEDGER_ADDRESS`. Implement/review wallet-gated writes with chain/account revalidation, simulation, explicit confirmation, receipt checking and dossier refresh. Obtain explicit approval before the live awakening transaction. None of those future actions is represented as completed here.
