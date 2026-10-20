# CHOG / 1969 — Integration Sprint (post-first-agent pass)

**Status:** Three PRs exist: [#6 story](https://github.com/emmaGH1/chog-1969/pull/6) (draft), [#7 chain](https://github.com/emmaGH1/chog-1969/pull/7) (open), [#8 media](https://github.com/emmaGH1/chog-1969/pull/8) (draft). **Do not portray them as merged or published.** The chain contract is undeployed. Audio/video absent. No real holder wallet writes yet.

## Scope freeze
Ship one exceptional Chapter 1 (6 scenes, 6–8 min max), real Chog Genesis archive, and a <=3 min demo. No second playable chapter, world map, open-ended AI-story engine, marketplace, generic mascot characters, or unbudgeted third-party service.

## Gate 0: Security and integration
- Make `integration/pilot` worktree, separate from the 3 existing agent worktrees.
- Bring #7 and #6 into the integration branch as appropriate; resolve conflicts carefully, do not fast-merge unverified or draft art to main.
- `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `npm audit --omit=dev`; document exact production-vs-development dependency findings and patch exposed Next.js versions before public release.
- Test guest flow + real onchain read using actual token ID and correct artwork (display name != onchain ID).
- Deploy only after critical vulnerabilities are remediated/assessed; no public dev server; Vercel preview gated as appropriate.
- No wallet transaction, key access, gas spend or contract deployment without explicit approval.

## Gate 1: Authentic Chog cast
- The Chogs are genuine ERC721 Chog Genesis collection characters. Never invent a random replacement.
- Chain agent: supply a verified candidate sheet of 3–5 actual token IDs from the canonical contract, metadata names, real original unaltered images, traits, provenance and public links. Token ID 1969 -> display CHOG #1461 is one possible candidate, not yet approved.
- The user approves one token as story companion 'Pip' (a **fictional nickname**, not an official metadata rename). Do not identify owner, use owner's likeness, or imply Chog project endorsed the story.
- Media agent: produce ONE excellent hero scene, using authentic selected NFT appearance, dramatic manga treatment for human cast/environment, mobile and wide crops, real expressive acting, and a clear interaction concept. Current first-batch vector drafts are layouts only; do not promote them into final.

## Gate 2: Film-worthy product, not PowerPoint
- Story agent: integrate approved illustrations into actual panels, make investigate/reveal/escape physical in the artwork, not only button forms. Keep reduced motion and guest skip; verify 375px Android phone screenshots.
- Media agent: deliver 8 brief pre-recordable voice performances and licensed atmospheric sound only after hero art approval, never secret ElevenLabs tokens in Git.
- Integrator: mobile Chrome device QA on user phone, desktop responsive QA, metadata provenance, story reset/resume, real Chog art, confirm no fake chain writes.
- Capture authentic product footage as soon as the hero sequence is integrated.

## Gate 3: Submission
- Demo: 2:35–2:45 narrated footage: hook, actual story interaction, actual Genesis metadata, genuine onchain holder proof only if independently verified, cliffhanger, product claim.
- If no consenting real holder before freeze, preserve a **truthfully marked read-only + locally-tested contract** demo; don't fake mainnet. This is a weaker outcome and must be made explicit to judges.
- README: exact implementation status, verified chain contract, tests, live URL, demo, build requirements, no broad ungrounded claims.
- Confirm actual Chogathon deadline from signed-in dashboard: do not assume the public site's date; submit with buffer.

## Roles and communication
1. **Integrator** owns integration/pilot, CI/security, merges/QA, live deployment and demo acceptance.
2. **Chain** fixes dependency/security, selects 3–5 authentic Chog candidates; no deployment.
3. **Media** holds final asset batch until the chosen actual Chog and hero artwork are approved.
4. **Story** integrates approved hero art and makes an illustrated interaction that feels like manga.

Each role should commit frequently on its own branch and open PR. Conflicts require a coordinator, not forced pushes or resets.

## Acceptance criteria
- [ ] Genuine Chog character selected by user from onchain metadata.
- [ ] One approved cinematic illustrated playable scene in mobile preview.
- [ ] Full guest chapter from start to end, no broken progress or overflow.
- [ ] Genuine Genesis artwork/traits/ownership read from Monad in UI.
- [ ] Owner-only memory contract tests pass; mainnet deployment only if approved.
- [ ] Dependencies remediated; CI, audit and production build documented.
- [ ] <=3 min demo actually captured and uploaded; no claim of simulated mainnet action.
