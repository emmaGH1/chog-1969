# Chog Genesis independent verification

Read-only RPC verification on 2026-10-20 (runner UTC clock) using `https://rpc.monad.xyz` (block observed: 115033256). No wallet, deployment or transaction was used.

- `eth_chainId`: 143.
- `eth_getCode(0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763)`: 17,264 bytes.
- `name()`: Chog Genesis; `totalSupply()`: 1969.
- `ownerOf(1969)`: `0xCF722e123205986Ed1967779119B269a87344b32` (snapshot, not permanent ownership).
- `tokenURI(1969)`: `ipfs://bafybeid4ybujnscdipkno7ps5utqelp5ry5ryreqhay3zhgk3a6x4jruqu/1461.json`.
- Metadata name: **CHOG #1461**; description: `CHOG — a 1969-piece collection on Monad.`
- Original image: `ipfs://bafybeihau2egcccbdxymeckmmbrqytbfor5gkt3en6d5fsbueymdbq7g6e/1461.webp`.
- Token 1968 resolves to metadata file 1460.json; token 1 resolves to 1462.json. Token 0 owner/URI reads revert. Do not assume token ID equals the artwork/display number or apply an arithmetic conversion.
- Pinata and Filebase returned matching metadata. ipfs.io and dweb.link returned HTTP 429; cloudflare-ipfs.com was unreachable. Gateways are an availability/trust dependency, not independent cryptographic content verification.

## Approval gate / outstanding human test

MemoryLedger is undeployed source. No canonical memory is claimed. Local test accounts are simulated, never identified as real Genesis holders. Deployment, wallet write integration, gas spending and live holder testing require explicit approval and review. A willing real holder must eventually verify wallet identity, correct chain/address, transaction receipt and reload persistence. Never request their key or seed.
