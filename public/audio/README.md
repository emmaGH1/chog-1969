# Optional voice — preserved script references, production held

**Gate 1 override:** no voice synthesis or recording batch before the actual Genesis character selection and one-hero art approval. Pip and the Chog witness each require a verified real NFT identity; Pip is a fictional nickname, not an invented replacement. `voice-plan.json` keeps both bindings null. The exact existing lines and editorial direction files remain unchanged as references; their old performance descriptions do not define the actual NFT's appearance or canonical personality. See `docs/HERO_SCENE_APPROVAL.md`.

**No recordings exist in this delivery.** No `.mp3`, `.wav`, music bed, cloned voice or sound effect is supplied. `voice-plan.json` uses `audioFile: null` deliberately; `plannedOutput` names are future deliverables, not URLs for application playback.

- `voice-plan.json`: all eight verbatim lines from `docs/VOICE_AND_DEMO.md`, distinct character direction, estimated pacing and pronunciation proposals.
- `lines/*.txt`: one exact spoken line per file, including punctuation and capitalization. Never speak file IDs or direction.
- `lines/*.performance.xml`: vendor-neutral **SSML-like planning notation**, not a tested ElevenLabs payload. `<performance>` and `<direction>` are editorial metadata. An approved provider may support only some or none of the inner SSML tags; adapt outside the app and audition a single approved test before batching. Do not blindly submit the XML as text.

Regenerate/check locally from the repository root:

```sh
node scripts/prepare-voice-lines.mjs
node scripts/prepare-voice-lines.mjs --check
```

## Recording approval gate

**Prerequisite:** user-selected verified NFT identities and approved hero art; separate voice permission and budget follow, not precede, those gates.

1. Approve voice casting, original/consenting voice talent or a provider-licensed synthetic voice, provider terms for intended distribution, and the maximum budget. No celebrity or identifiable character impersonation. No voice cloning without verified consent.
2. Confirm pronunciation with the story/brand owner. Keep Sera's two lines and Pip's two lines on their respective same voices.
3. Approve **one** dry audition per voice. Timings in the manifest are planning estimates, not measured durations.
4. Record offline or synthesize once in an approved local workflow. Any credentials stay in environment/local tooling, never in public files, source code, prompts, logs or a commit. Never request or commit API secrets. Do not invoke browser TTS or a recurring network request when a reader opens a page.
5. Keep a dry PCM master, ideally 48 kHz / 24-bit mono; export optimized mono MP3 around 96–128 kbps for delivery after audition. Normalize dialogue consistently (a starting target around -18 LUFS integrated, true peak at most -1 dBTP), check actual short-clip loudness and avoid clipping. Preserve intentional pauses; trim only dead lead-in/tail.
6. Record provider/voice identifier, consent/license evidence, allowed use, creation date, measured duration, file hash and export settings in a **non-secret** provenance record. Only then change `audioFile` from null to the real checked-in delivery file. The source-preparation checker currently enforces script-only status; update it deliberately when recordings are approved rather than inventing files to pass it.
7. Align captions to real waveforms after recording. No speculative SRT timestamps. Exact on-page dialogue stays visible whether audio is on or off. Reader must opt in to playback; narration must never block continuing, puzzle solving or touch interaction. Stop or replace the current line when navigating away.

## Music policy

Silence is the zero-cost approved baseline. No music license has been acquired. If music is requested, record the exact track, creator, source URL, license/version, commercial/public-distribution permissions and any attribution before use. "Royalty-free" or streaming availability is not evidence of permission. A purchased library, external generation service or paid voice call requires explicit approval first. If a licensed instrumental is later approved, duck it under voices and test intelligibility on a phone speaker; never hide weak voice audio under an atmospheric wash.
