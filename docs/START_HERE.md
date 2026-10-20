# CHOG / 1969 — start here
This is a four-day competition build. No more uncontrolled feature expansion. The target is **one finished playable chapter**, one read-only genuine NFT dossier, one owner-authorized canonical write (only after tests and approval), and one <=3-minute real demo.

## Real status
- GitHub scaffold is not proof of a running VPS process, hosted site or deployed contract.
- First verify npm install, npm run typecheck, npm run build and phone Chrome.
- The manga visuals currently include CSS placeholders. Replace with authored art; never call this finished manga art.
- /archive reads owner and tokenURI from genuine Chog Genesis on Monad; proper safe metadata rendering and wallet write flow are pending.
- Do not misrepresent the onchain state or use someone else's wallet.
- Don't deploy MemoryLedger without tests and explicit approval.

## Agent branches
- feat/story-engine: own src/app/chapter, src/components/ChapterExperience.tsx, manga scene assets and responsive UI. No contract edits.
- feat/nft-memory: own src/lib/monad.ts, src/app/api/nft, src/app/archive, contracts and tests. Do not touch scene script.
- feat/media-assets: own public/media, public/audio, scripts, docs/VOICE_AND_DEMO.md. No business logic.
- Integration: main; review PRs, run typecheck/build, deploy preview. Nobody pushes directly to main after initial setup.

## First 90 minutes
1. Integrator: clone repo into the VPS and run npm install; capture build success/failure.
2. Agent A: test all scenes on Android, add authored illustrations and interaction polish.
3. Agent B: verify live token #1969 via /archive, map metadata/image to actual collection, write tests for owner-only decisions.
4. Agent C: produce character art test for Neri, Pip, archive environment; get visual approval before batches.
5. Only then connect Vercel; never publish secrets in NEXT_PUBLIC_ variables.

## Strict no-go / security
No purchase of Genesis NFT required. No private key or seed phrase in logs/prompt. No fake wallet success, no placeholder transactions described as mainnet. All voice/music must be legally usable. Book a willing NFT holder test early.

## Sources
Chog official: https://chog.xyz/
Chogathon: https://chogathon.chog.xyz/
Genesis on OpenSea: https://opensea.io/collection/chog-genesis
Monad mainnet: https://docs.monad.xyz/developer-essentials/network-information
