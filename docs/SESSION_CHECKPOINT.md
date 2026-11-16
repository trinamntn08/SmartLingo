# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Beginner architecture/remote/deployment guide and standing automatic commit/push policy completed, independently reviewed and locally validated. Final staged checks and remote delivery follow this note.

## Current authorised request and scope

Owner requested an easy-to-understand architecture/system/remote/deployment document, with diagrams, then explicitly instructed automatic commits and remote pushes once work finishes. Started clean at `2249086` in isolated worktree `D:/dev/projects/SmartLingo-sessions/cloud-workflow`, branch `chore/cloud-workflow`. Primary owns all edits and integration. No application code, dependency manifests, curriculum, storage boundaries or actual hosting configuration changed. No deployment is requested by writing the deployment guide.

## Completed documentation

- New `docs/ARCHITECTURE_EXPLAINED.md`: plain-language frontend/API/shared-package explanation, source tree, data/backup/origin map, ordinary study/editor/AI flows, phone/Cloud/GitHub/CI workflow, local run commands, static-owner-preview steps and the separate future hosted-API work. Three native Mermaid diagrams cover current system, remote development and proposed hosting. Root-only offline URLs, hardcoded loopback clients, loopback/Origin server guards, lack of public auth/account sync and durable-storage requirements are explicit; no promise that uploading dist deploys editor/AI.
- README, documentation index, technical architecture, Cloud workflow and environment guide link the beginner guide. CONTRIBUTING now also accurately states process-environment configuration instead of implying the API auto-loads .env.
- New ADR0021 records the owner's standing instruction: after a completed, reviewed, validated step, deliberately stage task paths, commit, inspect the live remote task head, push normally and verify its SHA. Updated root AGENTS.md, session workflow, CONTRIBUTING, README, Codex/Cloud docs and ADR0003 to remove stale local-only scope. Applies to local/Cloud tasks; no repeated push confirmation, no blanket staging/all-branch pushes, direct main updates, force pushes, merges, deployment or curriculum publication. Failures preserve accurate local/remote status and next action. No watcher/hook automation added.

## Validation and review

- Source-based read-only technical review confirms browser IndexedDB/CacheStorage vs API curriculum/speech SQLite separation, temporary conversation/recording flows, fixed127.0.0.1 clients, local Host/Origin/listen restrictions, preview-server restrictions and root worker/asset paths. Primary authored the guide; independent reviewer (`gpt-6.1-sol`, medium, reused) owns no files.
- Three diagrams rendered successfully with zero page errors using Mermaid12.3.0 and isolated headless Playwright; all PNGs visually inspected. Improved remote-flow layout to a compact sequence diagram and rerendered it successfully. Rendering packages/scripts/PNG/SVG outputs remain ignored under `.tmp/architecture-render`; app manifests/lockfile unchanged. No paid image/provider call.
- Official sources checked: Expo website export/hosting, Fastify deployment recommendations, OpenAI Cloud environments and GitHub Mermaid support. Repository Markdown links are checked with the normal check command; README recovery heading/anchor was checked directly.
- Independent final guide/policy review: no unresolved actionable finding. `npm.cmd run check`: PASS repository links/configuration/TypeScript. `npm.cmd test`: PASS 18 tooling/190 application tests. `git diff --check`: PASS. Final staged checks follow before commit. No product UI or provider behaviour changed, so browser/offline suites were not manually repeated for this documentation/policy step. The standing policy explicitly supplies the separate push authorisation mentioned in older skill text; no skill-file rewrite is needed.

## Remote delivery and remaining Cloud acceptance

Owner explicitly authorises committing and pushing this work and future completed task checkpoints. Stage only these guide/policy/link/handoff paths, inspect staged content, run required checks, commit and push `chore/cloud-workflow` normally. Verify remote commit SHA and all local/remote branch heads, then report the actual checkpoint hash and guide link. Do not merge PR #1 or publish an app/lesson.

All25 local branches were previously uploaded and matched GitHub at `4d6a4a1`; current app base is this Cloud branch, not default main (`1c6e943`, old scaffold). Uploaded curriculum-review `8ba59ae` and concurrent-session tooling `8e36885` remain separate/unmerged. PR #1 is the existing draft handoff. The guide records design/deployment work; it does not integrate those branches.

Owner confirms republishing the SmartLingo Cloud environment and opening it on the phone. Still record a fresh Cloud task's command-level acceptance using `docs/CLOUD_WORKFLOW.md#phone-acceptance-task`: fetch current app tip, preserve existing work, verify HEAD equality and fix5d80acb ancestry, report runtime/dependencies and actual check/test results. Last directly inspected full Linux run43951957211 on4d6a4a1 passes18tooling/190application/81browser+1intentionalskip/8offline. Source code is unchanged by this documentation task; a new automatic docs CI run may follow the push.

## Preservation and capabilities

Other worktrees/branches and owner preview8082/API3001 are untouched. No real .env reads, owner database access, paid provider calls, learner migration, deployment, merge or curriculum publication. Cloud management tools are not exposed in this local session; account publication/phone access is owner-reported. Physical-phone learner/audio, Safari/native, screen-reader and provider quality remain product checks separate from Cloud coding access.

Account allowance unavailable (no exposed usage tool,2026-11-16); no automatic resume configured. Skills: repository documentation routing/editorial guidance from pages:write-page (no external Page created; established repo destination), source-based review, and independent sll-review-change review. Current owner instruction authorises primary documentation edits and automatic remote delivery.
