# Pip — second character casting round (marketplace sourced, not yet RPC reverified)

**Status: PRELIMINARY OPTIONS FOR REVIEW. Not user-approved or authoritative onchain verification.**

The eight options below are visibly listed by OpenSea as members of the same Chog Genesis ERC-721 collection on Monad, `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`. The canonical OpenSea URLs expose the listed **onchain token number**. Display names may be different. Unlike the first four in `docs/PIP_CANDIDATES.md` on Chain's feature branch, the eight below **have not yet been independently verified in our own Monad RPC/IPFS pipeline**, nor have raw original image bytes and hash proofs been collected. Do not present these as fully verified or publish their art as part of the manga until confirmed.

| Onchain token ID from OpenSea | Display name | Listed identity traits | Proposed fictional casting direction | Original collection page |
| --- | --- | --- | --- | --- |
| **1552** | **CHOG #1044** | XD eyes, smile, heart accessory, Buttcoin cap, army vest, pink skin | Energetic troublemaker, high-comedy foil to serious Neri | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1552) |
| **1053** | **CHOG #545** | Happy eyes, smile, striped outfit, MMGA cap, yellow skin | Bright, cheerful adventure partner | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1053) |
| **1428** | **CHOG #920** | Clown nose, tired eyes, yellow yukata, red skin, cool aura | Deadpan clown: mysterious but accidentally hilarious | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1428) |
| **846** | **CHOG #338** | Fire aura, wizard hat, gold tooth, white tuxedo, dead eyes | A seemingly ancient keeper who won't stop making terrible jokes | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/846) |
| **1848** | **CHOG #1340** | Squid Game Guard outfit, crown, bubblegum, royal blue aura | Funny yet unsettling secretive agent | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1848) |
| **467** | **CHOG #1928** | Green laser eyes, drooling, orange bucket cap, red shirt | Chaotic creature whose clues aren't quite understandable | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/467) |
| **512** | **CHOG #4** | Chog Viper eyes, Choggie beanie, Mon coin mouth, grey shirt | Sly archive thief with rare-coin obsession | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/512) |
| **1620** | **CHOG #1112** | Dead eyes, grey bucket cap, black tracksuit, red skin | Understated, unimpressed guide; humor from restraint | [view artwork](https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1620) |

## Verification and gallery requirement — Chain agent

1. Re-check **each** of the eight onchain token IDs using Monad RPC chain ID 143 and canonical contract. At one block number + hash, call `ownerOf` only to check existence (discard owner addresses) and read `tokenURI` for exact display name mapping. Do **not** invent an arithmetic mapping between token and display number.
2. Fetch unmodified original NFT image and JSON **from its actual tokenURI metadata** using a safe, fixed IPFS gateway policy; validate bytes/content type/dimensions; save SHA-256 hashes and provenance, not owner identities.
3. Create a single Android-first gallery of all 12 candidates (the initial verified four plus new eight) showing authentic source art side-by-side, onchain ID prominently, metadata name, actual traits, and one-line story casting potential. Use source cards rather than generative approximations. For each new token, if unverifiable, flag it and exclude its media from the verified gallery.
4. Sort into helpful archetypes: playful adventure companion, mystery/secret-keeper, dry comic relief, dangerous-looking ally. **Do not rank by market price or rarity**; this is casting, not shopping.
5. Clearly differentiate marketplace-preliminary vs chain-verified candidates until verification succeeds; no NFT selected, no artwork rights implied, no wallet or gas spent.
6. Publish direct GitHub gallery and mobile screenshot links, and report to user for casting decision. Coordinate with Media after selection.

## Rights and deadline
NFT ownership and metadata visibility are not automatic licenses to adapt copyright artwork. Verify permission for intended reproduction and derivative uses before publishing final scenes. No actual contract deployment, money spent or transactions are authorized by this doc. Media's selected-NFT hero art remains paused until user approval.
