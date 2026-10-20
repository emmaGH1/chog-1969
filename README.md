# CHOG / 1969
**the world forgot. the chain didn't.**

An independent, fan-made interactive motion-manga experience for Chogathon. The pale world has forgotten the Chogs. Their real Genesis NFTs are the surviving identities.

## Status
**Foundation scaffold committed, not a finished application.** The chapter, read-only NFT proof and local-state player journey are development starting points. Artwork, voice, wallet-gated decisions, contract deployment, live testing and demo video are not finished.

## Run
1. Install Node.js 20+ and run npm install.
2. Copy .env.example to .env.local (optional; public Monad RPC default is configured).
3. Run npm run dev and visit localhost:3000.
4. Run npm run typecheck and npm run build before merging.

Routes: / (cover), /chapter/1 (interactive pilot), /archive (read-only Genesis chain verification).

## Contract identity
Monad mainnet chain ID 143; Chog Genesis ERC-721: 0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763. Do not confuse it with the CHOG fungible token. Verify these references before any deployment.

## Docs
Read docs/START_HERE.md and docs/ART_DIRECTION.md. Separate agents should only work on their designated branches and directories. Never commit secrets, pretend a guest has holder rights, or label simulated transactions as mainnet.

This fan-created alternate-universe story is not official Chog canon.
