# CHOG / 1969
**the world forgot. the chain didn't.**

An independent, fan-made interactive motion-manga experience for Chogathon. The pale world has forgotten the Chogs. Their real Genesis NFTs are the surviving identities.

## Status
**Tested integration pilot, not a finished manga or public release.** On `integration/pilot`, the six-scene guest chapter has validated local saves and two routes; the read-only archive retrieves real Genesis artwork, traits and block-pinned ownership. The owner-only MemoryLedger is locally tested but **undeployed**; wallet writes remain disabled. Approved narrative artwork, voice, physical-phone QA, consenting-holder live writes and demo video remain outstanding. See [Gate 0 results and security assessment](docs/INTEGRATION_GATE0.md). The next checkpoint adds [default-off holder wallet controls](docs/WALLET_GATE.md) and a [2:40 genuine-app demo checklist](docs/DEMO_CHECKLIST.md); no deployed awakening or captured demo is claimed.

## Run
1. Use Node.js 22 (CI baseline) and run `npm ci`.
2. Copy .env.example to .env.local (optional; public Monad RPC default is configured).
3. For a private production preview, run `npm run build` then `npm run start -- --hostname 127.0.0.1 --port 3103`; visit http://127.0.0.1:3103. Do not expose a development server publicly.
4. Run `npm test`, `npm run typecheck`, `npm run build` and `npm audit --omit=dev` before proposing integration changes. See the Gate 0 report for remaining development-only audit findings.

Routes: / (cover), /chapter/1 (interactive pilot), /archive (read-only Genesis chain verification).

## Contract identity
Monad mainnet chain ID 143; Chog Genesis ERC-721: 0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763. Do not confuse it with the CHOG fungible token. Verify these references before any deployment.

## Docs
Read docs/START_HERE.md and docs/ART_DIRECTION.md. Separate agents should only work on their designated branches and directories. Never commit secrets, pretend a guest has holder rights, or label simulated transactions as mainnet.

This fan-created alternate-universe story is not official Chog canon.
