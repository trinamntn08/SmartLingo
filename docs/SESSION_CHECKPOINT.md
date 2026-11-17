# Session checkpoint

Updated: 2026-11-17, Europe/Paris. Open-course integration planning is complete, reviewed and validated. The commit containing this note is the checkpoint; its hash and verified remote upload are reported at handoff.

## Request and scope

The owner requested the French curriculum researcher skill, initially considering full Le Nouveau Taxi! 1–3 (A1–B1) study directly inside SmartLingo with one lesson per study day. The final instruction rules out seeking publisher permission and requires freely reproducible resources with attribution. The current task is a substantial implementation plan with parallel research, not implementation or publication.

Branch `docs/taxi-daily-course`, baseline `0ab3feb`; started clean. The earlier interrupted turn created this branch but left no product changes. The final branch name retains that starting reference; the actual plan excludes proprietary Taxi reproduction. Previous documentation-cleanup checkpoint `0ab3feb` was already uploaded to its separate branch. No unrelated work was found.

## Completed outcome

- [Plan 0027](plans/0027-open-course-integration.md) defines an original/open-material daily A1–B1 course: complete website study and exercises, exact resume, English support, vocabulary/review, source coverage, media, editor/import/publication, migrations/backups, eligible offline packs, security and phased acceptance. It assigns exclusive future parallel ownership after shared contracts are agreed.
- Recommends eligible legacy Français interactif and BCcampus activity companion material for the beginner pilot, with original practical/intermediate lessons. Current Liberté is an optional share-alike supplement. Records version-specific licences, media/third-party exceptions, the separate Tex copyright conflict and incomplete/noncommercial alternatives. No complete commercially reusable B1 replacement or per-asset clearance is claimed.
- [ADR 0022](decisions/0022-open-course-planning.md) records the owner's final source constraint. PROJECT_PLAN, STATUS and the docs index link the plan and explicitly distinguish it from implemented functionality.
- Official source pages/licence terms were browsed on 2026-11-17. No full textbook was copied, no message sent to publishers and no paid provider call made. API/runtime content, databases, learner data, media, manifests/lockfile and existing processes remain unchanged.
- Inspected live remote heads: hosted branch `codex/free-learner-cloud-deploy` remains `c88bc41`; this task does not merge it, deploy a website or establish a hosted API.

## Validation and review

- `npm.cmd run check`: PASS repository/documentation checks and TypeScript (exit 0).
- `git diff --check`: PASS, including the final OER-only plan and documentation links.
- `npm.cmd run check:staged` and `git diff --cached --check`: PASS for the six deliberately staged Markdown paths; rerun after this validation-note update before commit.
- Two read-only specialists returned curriculum/source and architecture/migration findings. Independent read-only plan reviewer found no actionable issue in all six final Markdown paths. It also ran repository/TypeScript and whitespace checks successfully; new UT Pressbooks access was not independently revalidated because it returned 403.
- No application/browser/offline/provider/device suites rerun for this Markdown-only task. Source-page inspection is not a full content/media-rights audit or proof of learning effectiveness. Exact legacy PDF licence notices remain an inventory task: adoption-page CC BY evidence was checked, a linked preface returned 404, a chapter had no extracted licence notice and the combined PDF exceeded the browser tool limit.

## Next step and delivery

No engine implementation is authorised by completing this planning task. The next proposed slice is to pin eligible legacy Français interactif/BCcampus pilot files, record licence exceptions and coverage, and specify one complete daily lesson. Exclude or replace any permission-only/unclear asset instead of negotiating permission. B1 runtime support and original intermediate curriculum remain future work.

Delivery procedure for this completed step: stage only the six reviewed Markdown paths, run `npm.cmd run check:staged` and `git diff --cached --check`, create a focused commit and push `docs/taxi-daily-course` normally to origin. Verify the live remote SHA matches local HEAD and report its actual value at handoff. On resume, compare Git/remote state first; do not repeat already completed delivery or start implementation from this plan alone. No merge, force-push, content import or publication/deployment is part of this task. If delivery fails, preserve work and record the precise command failure and recovery action here.

## Delegation and usage

Three exposed `gpt-6.1-sol` / medium subagents used fresh contexts: curriculum-author (read-only curriculum/OER evidence), api-builder (read-only current architecture/compatibility) and change-reviewer (independent read-only final plan). Primary owns all edits, integration, checkpoint, staging and Git delivery. No claim that repository role files/hooks loaded automatically.

Usage observation 2026-11-17: account-allowance reporting tool unavailable, not zero or unlimited. No automatic resume configured. All work is documentation only; ignored caches, owner/browser data and other branches remain outside this checkpoint.
