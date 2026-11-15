# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Current request and outcome

Owner requested a current-status check, local checkpoint commit and remaining-work/next-step recommendations. Status review is complete; no new feature was started. The working tree was clean initially: all existing feature work was already committed. Primary reviewed the latest notebook-search diff and project milestones using `sll-review-change` in a read-only review phase, then corrected documentation under the explicit checkpoint request. No confirmed actionable code finding in this bounded review; this is not a full codebase/French-quality audit. No delegation was needed for this small sequential task.

Updated README, STATUS and TESTING to correct obsolete lesson counts/revisions, level/picture coverage, implemented AI recording, duration editing and test inventory. STATUS now records milestone gaps and an ordered remaining-work list. This note is included in the local status-review checkpoint; report its actual hash only after Git confirms creation. Final index/secret/whitespace checks are required before that commit.

## Git and preserved work

- Branch: `feat/french-course-rework`. Latest source checkpoint: `35f8853` (notebook search), after `57a2f25` (personal entries), `90634c2` (duration editing), `dece895` (AI practice) and `baa3679` (curriculum).
- Curriculum: 24 banks/120 draft lessons, 741 appearances/689 canonical senses/680 written forms. Original 60 lessons revision 3, additions revision 1. Owner approval/publication remains outstanding. [Catalogue](COURSE_CATALOGUE.md), [research](CURRICULUM_RESEARCH.md), [plan 0016](plans/0016-french-course-rework.md).
- Live `git ls-remote --heads origin` during this review: only `main` at `1c6e943a3a2f4d9fdbf6886a71ac31c0d3b235ef`. `35f8853` is 21 commits beyond that ancestor. Feature work is locally committed but is not on that remote. Origin is the owner-selected `https://github.com/trinamntn08/SmartLingo.git`.
- Only four task documentation paths belong in this checkpoint: README.md, docs/STATUS.md, docs/TESTING.md and this file. No push, merge, history rewrite, publication or deployment is authorised by this request or performed here.

## Actual validation

- `npm.cmd run check`: passes repository validation and TypeScript, including the documentation refresh.
- `npm.cmd test`: 18/18 tooling and 136/136 application tests pass.
- `npm.cmd run test:e2e`: 57 passed, one intentional duplicate-publication skip, approximately 1.8 minutes. Desktop and narrow Chromium; fixture API/browser storage and fake AI/audio, no paid calls or owner database writes.
- `npm audit --json`: exit 1; three moderate findings in Expo/fingerprint/minimatch, zero high/critical. No dependency change or remediation claimed. See [investigation](plans/0011-build-tool-audit.md).
- `git diff --check`: passes after README/status/testing edits; final index checks precede commit.
- No production rebuild, preview promotion or separate `test:offline` rerun: application code is unchanged. Prior production/offline results remain historical evidence, not fresh checks.

Earlier source verification: optional AI practice had independent read-only review resolving terminal retry recovery, transcript overwrite and transcription guidance. Actual UI/API/reviewer routing was `gpt-6.1-sol`, medium. Current review uses the primary only. Previous production candidate remains ignored at `.tmp/final-session-export`, four hashed files/1,415,858 bytes, build `0bb10acfaef70a836c4c2ac21a28a822bc96e2262c79b9fcc12b6cb39a6cc67a`; its private 390px smoke checked unavailable AI, download/cold offline lesson and personal entry/search. It is not a deployed release.

## Preserved runtime and limits

Owner preview8082/API3001 listeners remain PIDs30084/16248 at review start; neither was restarted/replaced. Check listeners again before future work. Earlier candidate8083 was not listening at this review. Existing exported previews/processes may predate current source and need a separately deliberate rebuild/restart/promotion to expose new features. Test servers use8081/3002 with isolated fixtures.

No real .env read, paid provider call, retained recording, owner learner write/publication, backup/restore or API database switch was performed. Real AI requires server process environment `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL` and optional `OPENAI_TRANSCRIPTION_MODEL`; never request keys in chat. Local counters reset on restart and are not billing totals; transcription tokens are excluded. Provider/model/French/transcription quality, actual microphone/audible replay, phone/Safari/native and screen readers remain unverified. Serving remains loopback-only; physical-phone access requires a separately designed supported route.

## Next exact step

Recommend owner testing and approval of one restaurant journey: study → notebook/edit → review → backup/reload → offline return → optional AI role-play, including real audio/microphone and physical-device checks. Keep curriculum draft until explicit owner review/publication. Preserve the owner preview until a deliberate build-promotion step.

Next development slice, if requested: generated French speech/cache. Acceptance criteria: server-only credentials; explicit paid generation; stable text/language/voice/settings identity; stale-text/revision invalidation; repeat playback/download without duplicate paid generation; text/error fallback; fake-provider and offline checks. Real generation and voice-quality approval are separate. Later: one editor capability at a time, safe cross-tab learner reset/onboarding, per-topic downloads, production/listening practice, reviewed pictures, dependency remediation before distribution, then native/accounts/realtime work. Status review alone does not start that backlog.

Latest capability observation: 19:14 Europe/Paris, 2026-11-15; no account-allowance lookup exposed, so usage is unavailable rather than zero/unlimited. No automatic resume is configured. Local commits are not off-device backups; a future push needs separate owner authorisation.
