# Session checkpoint

Updated: 2026-11-16, Europe/Paris. A1–A2 curriculum research/review and compatible draft preparation complete. The commit containing this note is the local checkpoint; report its hash after Git confirms it.

## Authorised request and outcome

Owner requested the French curriculum researcher skill: architecture/content review, CEFR/FLE research, coherent A1/A2 topics, deduplication, progressive revision, validated app-compatible content and extensible B1/B2. Branch `chore/a1-a2-curriculum-review`; inherited cloud-preparation commit `1c5b5d4` and curriculum baseline `d5a56ed` are preserved. Started with no task edits. No production module or dependency changed.

[Review pack](curriculum/README.md) contains all 25-bank/123-lesson progression, canonical support/occurrence ledger, per-bank findings, 32-seed-area reconciliation, fourteen successfully inspected primary-source records and explicit inaccessible-source limits. Every topic has selected lexical clusters, a bilingual communicative model/task with success criteria, prerequisites, transfer/revision and topic-linked B1/B2 goals. Runtime ordering and level support remain unchanged; this recommended route is not consumed by the app.

Six standalone runtime-schema bridge drafts address family, colours, pain locations, compound prices, predictable payment clarification and a short practical written message: 54 appearances, 35 new senses, 19 exact canonical reused appearances. Five full existing-lesson revision+1 candidates correct four corrupted question explanations and one stale pronoun reference; only grammar explanations change. All eleven candidates are unregistered/unpublished drafts. They are not API-import envelopes; future integration needs actual-head reconciliation, application checks and saved-revision owner preview/publication.

All 123 shipped full lesson payloads/revisions remain exact, including all 765 appearances/722 canonical IDs/713 written forms. One semantic breakfast teaching link yields 721 provisional teaching concepts/44 recycled appearances while preserving both historical IDs and exact cards; nine same-form groups keep explicit sense/context decisions. This does not claim exhaustive semantic deduplication, native review or complete CEFR coverage. No owner data, seed baseline, media/audio, running preview, API or provider was changed/accessed.

## Actual validation and review

- `npm.cmd run check`: PASS repository tooling and TypeScript; final documentation/staged checks follow this note.
- `node --import tsx scripts/verify-curriculum-review.mjs --self-test`: PASS all 25 topics/all 123 assignments, full-payload fingerprints, canonical support, draft/schema/reference/band/DAG/encoding/notebook constraints, six bridge drafts and five exact correction candidates. All accepted candidate sentence answers build from their pieces. All current lessons have at least one buildable answer. Eight negative fixtures rejected bad prerequisites/references, missing coverage, accidental publication, unsolvable sentences, shared-support drift, unrecorded edits and stale fingerprints.
- Focused domain/content command in the [pack overview](curriculum/README.md): PASS all 30 tests across topics, examples, greetings, learning and review scheduling. `node --import tsx scripts/verify-curriculum-topic-audit.mjs`: PASS unchanged historical 120-lesson/741-appearance scope, current 123 runtime lessons reported separately.
- `git diff d5a56ed -- packages/content packages/domain apps/api apps/learner`: empty, confirming runtime/source preservation. `git diff --check`: PASS. Final staged check/commit verification follow.
- Primary inspected all six new bilingual drafts and integrated artifacts; independent read-only change-reviewer found no unresolved confirmed actionable defect in the bounded pack/validator review. No browser/export/offline/provider suites were rerun: no runtime change or candidate editor registration/preview occurred. Prior application/browser evidence remains in STATUS and earlier checkpoints.
- During validation, fixed a comparison-key curly/straight-apostrophe mismatch. The initial overstrict all-current-answer check caught the legacy valid typed variant sœur/soeur, which cannot both be built from one fixed spelling; current content retains at least one buildable path, while every accepted candidate answer is required buildable. Initial Windows inline quoting failed before using stdin scripts. A source-status patch used stale text before rereading and preserving the inherited cloud checkpoint. These did not change runtime content or bypass checks.

## Review limits and next exact step

Research/draft preparation requested here is complete. Review the pack and candidate French before selecting any integration. Apply the five support fixes through current-head editor saves or deliberate immutable seed revisions; register selected bridges only with the existing content/publication workflow and meaningful application checks. The old 741-appearance recommendations remain proposals, not 139 confirmed errors. Alphabet/phonetic instruction, independent listening/reading/free writing, medicine-label comprehension, broader banking tasks and learner trials remain documented gaps. Native-teacher/owner approval, actual audio, phone/Safari/native and screen-reader review remain open.

Previously recorded preview: `http://localhost:8082`, API `http://127.0.0.1:3001`; no restart or new live verification in this research step. No publication, paid call, secret read, push, merge or deployment.

## Preserved cloud-setup follow-up

Separate earlier request: `1c5b5d4` locally prepared `.github/workflows/verify.yml`, [cloud/phone guide](CLOUD_WORKFLOW.md) and ADR 0020. Its checkpoint records 18 tooling/190 application tests and bounded independent review. At that preparation, fetched `origin/main` was `1c6e943`; GitHub upload/draft PR, actual Linux CI, account-specific environment activation and phone acceptance remained pending. This research step did not recheck or perform those remote/account actions. Consult `git show 1c5b5d4:docs/SESSION_CHECKPOINT.md` for exact previous actions and re-inspect live remote state before continuing; do not treat this curriculum commit as uploaded or a Cloud environment as active.

## Delegation and usage

Two curriculum-author helpers and one independent read-only change-reviewer used exposed `gpt-6.1-sol` / high via explicit fresh contexts, following session routing. Exclusive files: topic plan/review/refinements; bridge drafts/notes; review read-only. Primary owned architecture/source comparison, ledger/validator, integration, status/checkpoint and commit. Skills applied: french-curriculum-researcher and sll-author-french; reviewer used sll-review-change. Role instructions were read; no claim of separate role sandbox/hook activation.

Usage observation 2026-11-16: no account-allowance tool exposed; unavailable, not zero/unlimited. No automatic resume configured. Required final stage/check/commit remains the active handoff action until Git confirms it; no new implementation scope is implied.
