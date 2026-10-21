# Illustration tool audit — actual Pi/VPS environment

**Inspected 2026-10-21, approximately 07:26 UTC. Local evidence only; no image generated.**

## Finding

**An image-generation wrapper is installed and exposed, but no ready-to-use, reference-conditioned illustration route has been verified in this session.** The exposed generator sends text only. It cannot transmit the exact approved Neri reference through its current interface. A model name, an installed skill or a chat model's ability to see images does not establish an illustration capability.

The existing local raster compositor is available for supplied art; it does not draw new scenes, poses, faces, hands or environments. No final scene, rough story illustration, paid call, source upload, software/model installation, authentication refresh, deployment or publication was performed during this audit. No model-backed web-search call or remote billing/entitlement query was made either. Consequently, hosted prices, current account entitlements and service/output terms are **not certified by this local audit**.

All existing **project intake/render** gates remain closed. Those gates do not disable the separately registered `generate_image` tool: it remains technically exposed, but is **not authorized for use**. No global Pi settings were changed. This report does not approve storyboards, workflows, new generators or asset rights.

## Governing art requirements

The user has corrected the direction since the first written storyboard proposal:

- Exact approved **Neri A / The Archivist** remains locked. Supplied One Piece references guide expressive faces, strong silhouettes, existing clothing construction, confident ink and restrained cel shading—not copied characters.
- **Authored 2D adventure manga**, not painterly AI-fantasy concept art. Complexity, resolution and rendering density do not establish drawing quality.
- Grounded, oppressive institutional archives: metal filing cabinets, ordinary record shelves, censored documents, worn walls, desks and practical lighting. Deliberate negative space, readable perspective and selective detail.
- Previously generated ornate fantasy archive illustrations are **rejected as both references and production assets**. No excessive ornamentation, added glowing particles, golden haze, mystical machinery or generic AI-fantasy backgrounds. None were opened or reused as visual references in this audit.
- Story leads: Neri discovers evidence of erased history; authentic **CHOG #545 / onchain 1053** is an unexpected intrusion of color and personality. Its original image/metadata remains unchanged; no generated substitute or new Chog anatomy.
- No finished scene yet. Written boards/workflow still need revision and explicit creative approval before final illustration. Earlier proposal documents are not approval of these new directions.

## Capability matrix

| Route | Actually found | Reference conditioning | Quality/output evidence | Cost evidence | Licensing evidence / disposition |
| --- | --- | --- | --- | --- | --- |
| **Antigravity `generate_image`** | Exposed in this session; `pi-antigravity` **0.9.0** installed | **Not supported by this wrapper.** Its input is prompt, ratio, model and save path; request contains text parts only. | Aspect ratios include 16:9 and 3:4. No width/height, image-size/quality, seed, edit mask or image-reference controls. No relevant quality/likeness test performed. | Google OAuth route; actual entitlement, quota, incremental charges and hard $0 ceiling **unverified**. No per-image quote/cost returned by this tool. | Plugin is **MIT**, not an image-output license. README calls the integration unofficial. Applicable Google service/access/output terms not established here. **Do not use for locked Neri production.** |
| **Pi's generic image-model API / OpenRouter** | Image API documented in installed Pi **1.3.0** docs | Documentation supports text + image blocks. That is a documented framework capability, not a verified working route here. | No `codemode` tool exposed in this session; no OpenRouter credential found in the inspected default auth store/environment; no live image call tested. | No funded account/rate/zero-cost allowance verified. | Hosted model/provider terms would need verification. **Not an operational option in this session.** |
| **Local diffusion/image models** | No configured operational stack found in the inspected locations | No local img2img, ControlNet, IP-Adapter, character LoRA, pose/depth or inpainting workflow verified. | No relevant executables, Python ML stack or cached model weights found in inspected common locations; no exposed GPU found. | No hosted charge for truly local inference in principle, but compute, installation, weights, suitability and quality are not thereby free/available. | No deployed model-weight license to evaluate. **Not installed/verified; do not propose as ready.** |
| **Existing Sharp compositor** | **Sharp 0.34.5** resolves locally; project intake/projection/export scripts present | Not generative conditioning: incorporates already supplied raster pixels and authentic NFT source. | Exact-canvas raster validation, whole-source perspective placement, occlusion checks and PNG/lossless-WebP export exist. They do not fix poor anatomy, staging or ink quality. | Local CPU/storage on the existing VPS; no external inference/API charge. Existing VPS costs are not asserted to be zero. | Sharp is **Apache-2.0**; native dependencies have their own notices. Tool license does not grant rights to source art. **Usable only after creative signoff and real art intake.** |
| **FFmpeg/ffprobe** | FFmpeg **6.1.1-3ubuntu5** and ffprobe installed | No illustration/reference-generation workflow. | Encoding/probing/processing utilities, not an illustrator. No video/audio work requested or done. | Existing local compute; no external inference call. | This FFmpeg build reports **GPL-2.0-or-later**. Not a license to underlying images. |
| **User-managed ChatGPT illustration exports** | Previously accepted external handoff method, not a verified Pi tool | Depends on the user's actual ChatGPT interface/model and attaching the approved reference there. | No wide/portrait illustration bundles supplied; no output fidelity or independent composition verified. | User's plan, allowance and marginal cost are not visible here. Do not infer image entitlement from Pi's OpenAI chat login. | Account/service/output terms and source-art permissions remain separate. **External input route, still creative-gated—not native VPS generation.** |

## 1. Exposed generator: what its implementation actually does

Installed source root:

`/home/builder/.pi/agent/npm/node_modules/pi-antigravity/`

Sources inspected completely: `README.md`, `package.json`, `LICENSE`, `src/index.ts`, `src/image/image.ts`.

### Input and reference limits

`src/index.ts` registers exactly these `generate_image` fields:

```text
prompt       string
aspectRatio  optional enum
model        optional string
path         optional project-relative output path
```

`buildImageGenerateRequest()` in `src/image/image.ts` constructs:

```text
contents: [{ role: "user", parts: [{ text: sanitizeText(prompt) }] }]
imageConfig: { aspectRatio }
candidateCount: 1
```

There is no input `inlineData`, input file/image URL reader, image attachment array, edit mask, pose/depth map or reference-strength parameter. Its `inlineData` handling is for **returned images**, not incoming references. Reading the Neri JPEG with Pi's `read` tool attaches it to the chat; that chat image is **not forwarded into this separate generation request**. A filename, description or base64 string inside `prompt` would still be text, not verified image conditioning.

This does not claim that every underlying Gemini service lacks image-reference support. It establishes that **this installed route does not expose or send it**. Modifying the wrapper or calling a different endpoint would be new work requiring verified service support, permissions and cost—not an already available capability.

### Output controls and model fallback

- Default requested model: `gemini-3-pro-image`.
- Hard-coded fallbacks include `gemini-3.1-flash-image` and `gemini-3-pro-image-preview`. These are source constants, **not confirmed account entitlements**. The inspected cache had no image-named model entries.
- The loop can try other models/endpoints after errors including 403, 404, 429 and several 5xx statuses. A requested model is not guaranteed to be the model that ultimately returns an image. The returned tool details include the actual selected model if generation succeeds.
- 16:9 matches the wide ratio; 3:4 matches portrait. **Neither proves native 1920×1080 or 1200×1600 output.** No explicit resolution setting is sent.
- Returned MIME/data are written to disk; default location is `.pi/generated-images/`. That directory did not exist in this project at inspection time.
- Prompt limit: 8,000 characters. No exposed seed, linework/style fidelity control, transparent-layer guarantee, conditioning weight or character-identity lock.
- No generated sample was requested. Manga acting, exact Neri identity, anatomy, continuity, useful layer separation and scene quality therefore remain **untested**, not inferred from a model's name or advertised resolution.

### Account, cost and service licensing

Passive inspection found an Antigravity OAuth record with a refresh credential and a stored access expiry already past. **No token values, email addresses or account/project identifiers were printed or copied into this report.** No refresh was attempted. A refresh credential does not prove that refresh will succeed or that an image model is permitted.

The image result exposes images/text/model/paths, not a price quote or per-image billing record. The source does not establish a dollar spending cap. OAuth sign-in, zero prices in a chat-model catalog, available quota or a plugin's MIT license are **not evidence that image generation is free or authorized for this account**. Public Gemini API prices, even if obtained separately, must not be substituted for this Cloud Code Assist/Antigravity route's actual terms.

The plugin README explicitly says it is unofficial and not endorsed by Google. Its MIT license covers the plugin software; it does not establish Google service-access permission, commercial output rights, data handling, reference-upload permission or rights in Neri/CHOG art. Applicable service and output terms remain **unverified**, not assumed permissive. No current vendor pricing/terms were fetched or authenticated for this audit.

## 2. Other advertised routes are not installed capabilities

The installed Pi docs at:

`/home/builder/.pi/agent/install/releases/1.3.0/node_modules/@earendil-works/pi-coding-agent/docs/`

were read for `models.md`, `codemode.md`, `extensions.md`, `configuration.md`, `settings.md`, `security.md`, `providers.md`, `cli.md` and `packages.md`.

`models.generateImages()` can accept image blocks in the documented generic API. However, this session exposes no `codemode` tool; OpenRouter authentication was absent from the inspected default auth store and environment. No local/project MCP configuration file was present at the standard paths. No settings were changed to enable another route. An additional chat-model gateway configuration is not evidence of a reference-conditioned image endpoint.

`media-use`'s skill/provider instructions mention HeyGen, mflux and other optional providers. Those instructions are **not proof of installation, login, reference editing, zero cost or asset licensing**. No `heygen`, `hyperframes`, `codex`, `gemini`, `mflux-generate`, `ollama`, ComfyUI/Invoke CLI, GIMP, Krita, Inkscape or Blender executable was found on the inspected PATH. No HeyGen host API configuration was present in the inspected environment. None was installed or called.

Local observations:

- Linux x86_64; 4 visible CPUs; approximately 7.8 GiB RAM, with about 3.9 GiB available at inspection. Resource availability can change.
- No `nvidia-smi` executable or `/dev` NVIDIA/render GPU device found. This is an observation of exposed resources, not a claim about all physical hardware or possible remote services.
- No Torch, Diffusers, Transformers, Pillow, OpenCV, ONNX, TensorFlow, Safetensors, Accelerate, Comfy/Invoke or Hugging Face package matched in the inspected Python environment's installed-distribution metadata.
- No model checkpoint/weight files found in inspected common Hugging Face/Torch/Ollama/model locations; Hugging Face cache approximately 60 KiB. Other Python environments/locations were not exhaustively searched.
- No local listener on common image/inference ports 7860, 8188, 9090 or 11434. Different-port services are not ruled out.

Do not turn these findings into a claim that CPU inference is theoretically impossible. The defensible conclusion is **no operational local generation/conditioning stack was established here**.

## 3. Actual local finishing capability and its boundary

Project source: `scripts/lib/awakening-raster.mjs`, `scripts/lib/awakening-intake.mjs`, `scripts/lib/awakening-review.mjs`, `scripts/awakening-pipeline.mjs`.

The existing compositor can validate and combine delivered raster artwork with the whole authentic NFT, then export lossless review assets. Previous code/unit checks concern raster integrity and preservation, not drawing quality. The new artistic end-to-end render remains unperformed because actual illustration inputs are absent.

It cannot turn the approved character sheet into an authored new pose, repair incorrect hands, invent convincing institutional staging, redraw expressive faces or make a token paste-in feel narratively integrated by adding effects. Sharp/FFmpeg/SVG availability is **not a replacement for illustration**. Historical SVG renderers remain frozen; rejected ornate art is not a fallback.

Software licenses and original-source hashes do not resolve asset copyright, adaptation/reproduction/publication rights, attribution or final user approval. No ownership or endorsement is inferred from the Genesis token evidence.

## Disposition

1. Keep final-art generation, final-art intake and compositing paused. `status` still reports pending creative signoff and missing wide/portrait bundles; production/export flags remain false.
2. Do **not** use the text-only Antigravity wrapper to approximate approved Neri, and do not upload Pip to any generator.
3. Revise the written storyboards/workflow to the user's manga/institutional/story-first corrections before seeking creative approval. The audit itself is not that revision or approval.
4. Treat any future reference-conditioned generator as unverified until actual image-input transport, service entitlement, output controls, cost and applicable rights are established. Do not buy/install a workaround or invoke a test without authorization.
5. Retain the previously accepted user-managed ChatGPT export route as an **external handoff**, not a claim that Pi has a verified ChatGPT illustration tool. Actual files and visual inspection are still required.

## Recheck evidence (no credentials)

Source SHA-256s at inspection:

```text
pi-antigravity/package.json
5f858710b30efba520e89ab638bfed0417c7ccb9a26f438c8cbb4dff672b1dc3
pi-antigravity/src/index.ts
30415d05751ef2ac3f2a3be5f33e7bea22e35c30d599b8e9f062bc84aebb9fd4
pi-antigravity/src/image/image.ts
6104cfc81d77efff8faf11a63cab72d26cad043b9257af066b4dda6e083d374c
```

Useful offline rechecks: inspect those installed files; resolve Sharp's package version/license; inspect executable presence and GPU nodes; run `node scripts/awakening-pipeline.mjs status`. Do not run a generator, OAuth refresh, account switch, model installation or model-backed search merely to reproduce this report. This is a time-bounded audit of the actual exposed/inspected environment, not a promise of future service availability or a legal opinion.
