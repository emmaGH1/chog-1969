# CHOG / 1969 — real-product demo storyboard and capture plan

**Deliverable now:** editorial plan, not a recorded or rendered video. Target **2:40 / 160 seconds**, hard ceiling **3:00 / 180 seconds**. Source capture must prove real interactions. No fabricated browser UI, simulated wallet success, unverified holder decision or implied deployed contract.

## Capture readiness / stop gates

- A local review gallery is delivered at `public/media/review.html`; that is **not** an integrated chapter. Story/app owner must approve and integrate the first art batch before describing the chapter as illustrated. At least two illustrated interactive moments remain an application-owner integration task. Until then, describe the visuals as drafts and the application as a development build.
- Run app checks and an actual desktop + phone reading pass on the exact commit used for recording. Build/typecheck alone do not establish a running server. A hosted URL must be real and reachable; a local build must visibly be called local.
- Chain owner verifies the current real collection, chain ID, contract and token data before capture. The supplied project brief names Monad mainnet chain ID `143` and Chog Genesis token `1969`; this media plan does **not** independently certify either a live read or token ownership. Record the actual returned values and capture time.
- Only perform a holder write with a consenting real holder, tested wallet flow and separate explicit transaction/spend approval. No purchase of a Genesis NFT is required. Never borrow another person's wallet or use an unrelated address as proof of authorization.
- If a local contract test is not demonstrably available, do **not** invent one for the fallback. Use the read-only/limitations version below. No wallet or chain secrets in recordings, logs or files.
- Voice and music are optional. `public/audio` contains scripts, not recordings. Default to live presenter narration or text captions and silence; recording/provider rights and any spend still need approval.

## Timecoded storyboard / edit decision plan

All ranges are contiguous and total 160 seconds. Capture handles of 3–5 seconds at both ends; cut those handles out, not the evidence inside an interaction.

| Time / duration | Real picture / action | Presenter copy or character line | Evidence, label and fallback |
| --- | --- | --- | --- |
| 0:00–0:18 / 18s | Open the actual cover, then the actual first chapter page. Show the illustrated archive/close-up **only after integration**. One deliberate cursor move into the story. | “The world forgot the Chogs. One apprentice finds a drawing that refuses to stay on the page. CHOG / 1969 is an independent fan-made interactive story about who gets to preserve a memory.” | Label independent fan story. If art is not integrated, show real current UI and say “development build; illustration drafts pending integration.” Never insert gallery art into a browser mockup and call it live. |
| 0:18–0:48 / 30s | In `/chapter/1`, continue to the drawer; focus the input; enter an incorrect four-digit code, show the real hint, enter `1969`, click unlock and hold the actual success state before continuing. | “You read, inspect, and solve. The two record numbers form 1969. A wrong answer gives a hint; the correct one opens the next beat.” | Keep input, pointer and response legible. Show the uninterrupted input-to-result sequence at real speed. No hard cut that implies an unavailable action worked. |
| 0:48–1:12 / 24s | Continue to Pip's actual reveal, then the Redactor scene. Click **Keep the evidence** (or choose burn and keep that route consistent). Hold consequence text. | Optional approved Pip line: “Excuse me? I'm a legendary being of unimaginable power.” Presenter: “Pip breaks the monochrome. Keeping the evidence changes the escape consequence.” | Reveal and choice are the two intended illustrated moments, but only call them illustrated when the integration is real. Label this branch a **local reading choice**, not a canonical onchain vote. |
| 1:12–1:34 / 22s | Open `/archive` through the real chapter link. Let the actual read finish. Capture token identity, collection/contract, owner/tokenURI and image only as safely rendered by the live app. | “The story points to a real collectible identity, not an altered token image. This dossier reads the collection's onchain record. The artwork in our story is separate fan art.” | If RPC fails, show the honest error and record a retry as a separate take; do not replace error UI with fixture data. Only label “Monad mainnet read” when actually verified. Metadata availability is not proof of holder permission. |
| 1:34–2:10 / 36s | **A: approved real-holder path:** show the correct chain, consenting holder connection, actual signature/transaction confirmation, receipt/explorer evidence, then refresh and show canonical state. **B: implemented local-test path:** show the real local test/receipt and refresh only if available. **C: current read-only path:** show verified read-only data and the actual limitations, not invented controls. | A: “The connected holder authorizes this decision. Here is the confirmed result, and here is the same state after refresh.” B: “This is a local contract test, not a mainnet write. Real-holder integration remains unverified.” C: “Read-only identity is available. Holder-authorized canonical writes are not demonstrated in this build, and we are not claiming one.” | Use persistent, specific environment label: **LOCAL TEST — NO MAINNET WRITE** for B, **READ-ONLY DEMO — HOLDER WRITE NOT DEMONSTRATED** for C. If a real approval takes longer than 36 seconds, shorten other non-evidence shots or choose fallback; never time-warp or fake success. A refresh of localStorage is **not** evidence of onchain persistence. |
| 2:10–2:35 / 25s | Return to the real chapter endpoint and show its actual ending. Only use harbor art if it exists and is integrated at capture time; otherwise show current ending text. Refresh local reading progress in a separate uninterrupted shot if useful. | “The chapter ends at a missing photograph and a question the archive cannot erase. Our goal is a readable story where a collectible's identity can anchor a memory, and its holder can eventually authorize what becomes canonical.” | Say “eventually” if writes are not demonstrated. Do not claim all queued art exists. Separate local progress from canonical state. Show actual mobile reading footage briefly only if recorded and checked. |
| 2:35–2:40 / 5s | Editorial end card over a freeze of the real product; title, repository and the actually verified running URL (or explicit local-build label). | “CHOG / 1969. The world forgot. The chain didn't.” | Repository: `https://github.com/emmaGH1/chog-1969`. Do not invent a live domain. Caption: independent fan story / not official Chog canon. |

## Shot capture checklist

1. **Freeze scope:** note branch, full commit SHA, environment (local/dev/preview), capture UTC, browser version, OS and viewport. Coordinate with integrator; do not deploy as part of capture preparation.
2. **Rehearse without recording:** fresh reader state using the real restart control. The current app's reading progress uses `chog1969:pilot`; only clear that key if restart is insufficient, document it, and never clear unrelated wallet/session data. Rehearse `1968` → `1969` and choose the same route in all takes.
3. **Capture:** 1920×1080 or native 16:9 desktop, 30 fps, 100% browser zoom. Readability wins over decorative framing. Keep real mouse/tap behavior and stable browser content. Silence notifications, close unrelated tabs and prevent credential dialogs before recording. Do not composite a different browser state into a wallet or RPC shot.
4. **Phone insert:** record actual phone Chrome at its native portrait dimensions, or clearly label a desktop device-emulation insert. Check text, touch targets, puzzle keyboard and images at roughly 390 px wide; a resized raster preview is not a phone/browser QA pass.
5. **Audio:** separate dry presenter mic track; capture opted-in application audio only when actual licensed files exist. No paid provider calls just to record a demo. Leave room for real UI feedback and character pauses. Music may remain absent.
6. **Evidence:** one raw take for code entry→unlock, one for route selection→consequence, one for NFT read, and (only if approved) one for authorization→confirmation→refresh. Preserve full raw evidence locally. A visibly labeled cut may remove idle time outside those proof sequences; never splice a success onto a failed attempt.
7. **Privacy:** do not record private keys, seed phrases, API tokens, wallet recovery screens or unrelated personal data. Obtain holder permission for showing their public address. If sensitive information appears, stop and recapture; blurring is not permission to stage results.
8. **No footage in this commit:** keep bulky raw files outside source control, e.g. `/tmp/chog-demo-capture/` for scratch (not durable archival storage); agree durable approved storage with the integrator. Save non-secret evidence notes alongside capture deliverables, not credentials.

### Evidence log template

| Take | Raw filename | Capture UTC | App commit / environment | Viewport / device | Action and observed result | Chain/block/receipt if verified | Consent or limitations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | not recorded | pending | pending | pending | Cover → chapter | n/a | Draft art integration pending |
| D02 | not recorded | pending | pending | pending | Wrong code → hint → correct code → unlock | n/a | Local reader state |
| D03 | not recorded | pending | pending | pending | Choice → actual consequence | n/a | Not canonical state |
| D04 | not recorded | pending | pending | pending | Genuine NFT read / actual error | pending | No ownership claim from read alone |
| D05 | not recorded | pending | pending | pending | A / B / C path, chosen after capability verification | pending / n/a | Separate transaction approval required for A |
| D06 | not recorded | pending | pending | pending | Ending / refresh / real phone insert | n/a | Label emulation if not a physical phone |

## Edit and delivery rules

- All product proof is authentic browser footage. Simple editorial chapter labels or an end card may be graphics, but are not substitutes for real screens. Do not animate fake data, wallet controls or NFT metadata to imply completed features.
- Use hard cuts at semantic beats; no slideshow transitions or generic neon tunnels. Keep subtitles outside faces and puzzle controls, preferably two short lines, approximately 36–42 characters per line. Use a small high-contrast treatment, not a giant caption box. Create timing from the recorded speech, not the estimates in the voice plan. Check at phone size.
- Export a 1920×1080 H.264 MP4 at 30 fps, AAC audio if audio exists; include sidecar captions and a thumbnail from genuine footage. Preserve source capture frame rate/time base where possible. Target 160 seconds; reject anything over 180 seconds.
- Verify the actual exported duration using `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-demo.mp4` and watch the whole export once. Check audibility on phone speakers and with audio off. Exact final filename, duration, codec and hashes belong in delivery notes after export, not before.
- If a composition-based edit is later authorized, use the HyperFrames product-demo workflow with source browser footage; do not synthesize product screens. No composition/video is created here. The installed CLI was probed with `npx --no-install hyperframes usage --json` and is unavailable; usage is **unknown**. No package was installed, remote render invoked or allowance inferred. A future render requires a fresh tool/usage check and the existing no-spend/no-deploy approvals.

## Ready-to-record acceptance

- [ ] Approved and actually integrated art; two genuine illustrated interactive moments, or explicit development limitation.
- [ ] Real browser walkthrough passes; desktop/phone QA recorded by the application owner.
- [ ] Verified live read or honest visible failure; no fixture dressed as mainnet.
- [ ] A/B/C holder-proof path chosen based on actual capability and approval, not ambition.
- [ ] Consent and licenses logged for every voice/music/brand element used.
- [ ] Real destination URL checked or local-build label used.
- [ ] Final runtime <=180s, sidecar captions aligned, full export watched.
