# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Documentation audit/consolidation complete and validated. The commit containing this note is the checkpoint; its resulting hash and verified remote delivery are reported at handoff.

## Request, scope and source

Owner requested reviewing all docs for freshness and redundancy, then cleaning them up. Branch `docs/documentation-cleanup`, source baseline `cf4fedb`; started clean. All 95 pre-existing tracked Markdown files were inventoried across current guides, curriculum/media, plans/ADRs, templates, fixtures/reference instructions and installed/prepared skills. Four additions bring the reviewed Markdown set to 99: local operations, dated preview history, plan 0026 and the already accepted ADR 0021 reconciled from another branch.

Only Markdown changes are in scope. No application/tooling code, curriculum JSON, media, manifest/lockfile, database, configuration values, provider call or running process changed. Other worktrees and task branches remain untouched.

## Completed cleanup

- README is a short installation/run/navigation page; old section anchors remain as pointers. Detailed learner/editor, speech/AI, offline and both backup procedures now have one home in [LOCAL_OPERATIONS](LOCAL_OPERATIONS.md), retaining privacy/recovery safeguards and process-only key configuration.
- STATUS is a source-based capability/gap/milestone summary. Earlier dated milestone/verification evidence moved to [preview history](history/local-preview-2026-11.md); full original files remain in Git. TESTING now owns commands/isolation/coverage/gaps; old detailed results are recoverable with `git show cf4fedb:docs/TESTING.md`.
- PROJECT_PLAN target requirements are separated from current delivery; corrected the obsolete hidden-translation preference, native/architecture framing, old sizing estimates and completed first backlog. Development/setup/environment/cloud/voice guides use current code-based claims and dated external evidence rather than live-service or provider guarantees.
- Current catalogue rows match all 123 runtime lessons; corrected two old starter titles. Refreshed all 722 photo-coverage rows: 397 covered (116 literal / 281 contextual), 325 gaps, 120 existing images. No photo/content/rights approval added. Historical 120-lesson/741-appearance audit tables/JSON stay intact and explicitly dated; six bridge and five correction candidates remain outside the runtime catalogue.
- Clarified six historical plan records with stale next-step/scope framing. Retained distinct decisions, linguistic/source/rights evidence and reproducible installed/prepared skill mirrors instead of deleting useful records.
- Reconciled the owner's explicit 2026-11-16 standing instruction from `a3913dd`: completed, reviewed, validated task checkpoints are committed and pushed automatically, with live remote SHA verification. Copied that branch's existing ADR 0021 and aligned AGENTS/session/contribution/Codex/Cloud guidance and ADR 0003. This is a documented owner policy, not new tool automation or a merge of unrelated code. No force pushes, direct main updates, merging, deployment or curriculum publication are authorised by it.
- A final `git fetch origin` found new hosted implementation branch `codex/free-learner-cloud-deploy`, head `c88bc41` at inspection. Read its checkpoint/diff: it reports local release validation complete, account/network-blocked publication and no live URL. Updated the hosting plan/Cloud continuation prompt and current summaries to resume that work; no hosted source was merged and no remote tests were claimed as rerun here.

## Actual validation and review

- `npm.cmd run check`: PASS repository/documentation and TypeScript, including final policy/checkpoint/hosted-continuation edits. Staged checks follow before commit.
- `npm.cmd test`: PASS 18 tooling / 190 application tests; no paid calls. Subsequent edits are documentation/policy only, with runtime/source unchanged.
- Both curriculum validators PASS: current review pack plus all eight negative fixtures; unchanged historical 120-lesson/741-appearance scope with current 123 runtime count reported separately.
- Final complete custom Markdown inspection: 99 files / 368 local file-and-anchor references PASS; all nine installed/prepared skill resource pairs byte-identical, ADR 0021 identical to its recorded owner-policy source, and every tracked change Markdown-only. Curriculum helper additionally compared all 123 catalogue rows, 722 photo rows and 741 historical target/meaning rows against runtime; four photo/visual tests passed.
- Independent read-only reviewer found no actionable correctness/privacy/recovery/regression issue in the integrated guides and checked source-based operational limits/loopback/recovery boundaries. Fixed its cosmetic lost-punctuation heading finding. It also reviewed the final standing-policy, hosted-continuation and checkpoint deltas with no actionable finding. An ad-hoc prose-encoding guard initially misidentified URL query separators; excluding URL tokens corrected that verification false positive, with no product/data change.
- `git diff --check` and final staged content/secret/whitespace checks: PASS. Initial staged whitespace check caught extra blank EOF lines in the two new moved-content guides; trimmed them and reran successfully. All 44 staged paths match reviewed Markdown. Commit/push SHA verification is reported at handoff. No browser/export/offline/provider or physical-device suites rerun for Markdown-only changes; external catalogues/prices/model lifecycles were not freshly verified and are not presented as fresh facts.

## Remaining work and remote handoff

This documentation task adds no product functionality or deployment. Owner/native-teacher curriculum/media review, physical-device/audio/accessibility acceptance, candidate lesson integration, full editor/learner controls and actual hosted publication remain as described in [STATUS](STATUS.md#remaining-work). Old source snapshots and cloud/deployment handoffs are recoverable at `cf4fedb`, curriculum research at `8ba59ae`, cloud policy at `a3913dd`, and the separately implemented hosted release at `c88bc41`.

Delivery procedure: commit the reviewed/staged Markdown, inspect the live `origin/docs/documentation-cleanup` head, push this branch normally and verify remote SHA equals local HEAD. Report actual hash/upload result and preserve a precise recovery action if any check/push fails. On a later resume, inspect Git and the handoff before repeating delivery that may already be verified. Do not merge other branches, deploy a site or publish lessons. After verified delivery, no authorised documentation work remains pending.

## Delegation and usage

Two bounded documentation workers used exposed `gpt-6.1-sol` / medium, one read-only plans/decisions/mirror inventory helper used `gpt-6-luna` / medium, and an independent read-only change-reviewer used `gpt-6.1-sol` / medium, all fresh contexts under session routing. Exclusive files were assigned; primary owned integration/core guides/history/policy/checkpoint/commit/push. Reviewer used sll-review-change; no claim of runtime role/hook activation.

Usage observation 2026-11-16: account-allowance tool unavailable, not zero/unlimited. No automatic resume configured. Ignored caches/temp validation files and owner/browser data stay local and outside the checkpoint.
