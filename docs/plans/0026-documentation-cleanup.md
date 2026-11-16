# Documentation audit and consolidation

Requested 2026-11-16: review all project documentation for freshness and redundancy, then clean it up without changing product behaviour.

Acceptance criteria:

- Inventory every tracked Markdown file, including plans, decisions, templates and installed/prepared skill copies; distinguish current instructions, dated evidence and future proposals.
- Make README a concise entry point, STATUS the current capability/gap summary, PROJECT_PLAN the target requirements and SESSION_CHECKPOINT the current task handoff. Put detailed operational instructions in one linked guide.
- Correct obsolete translation, lesson-count, media-coverage, preview-port, command and completion claims against source. Preserve original source retrieval dates, rights records and review/publication limits.
- Retain distinct audit/decision evidence and reproducible installer mirrors. Remove repeated current-state narratives; label historical material rather than silently rewrite old evidence.
- Run repository/TypeScript and documented tests, both curriculum integrity validators, whitespace/staged checks and independent read-only review. Create a focused checkpoint commit; do not merge, publish curriculum or deploy a site.

Primary owns root guides, status/index/workflow/checkpoint, architecture clarification and dated status archive. One helper owns curriculum/media Markdown; one owns operational/testing/setup/cloud Markdown; one independently inventories plans/ADRs/templates/reference/tooling/skill documentation read-only. An independent reviewer checks the final integrated change. No production code, JSON curriculum, manifest, lockfile, media, secret or owner database is in scope.

The source baseline is `cf4fedb`. Other task branches contain unmerged cloud/concurrent-session work; their commands must not be presented as installed capabilities of this checkout. The later owner instruction for automatic completed-task commits/pushes is reconciled from `a3913dd` and its existing ADR 0021 without merging unrelated source. Other working trees remain untouched.

## Reviewed outcome

Reviewed all 95 existing Markdown files; the final set adds local operations, dated preview history, this plan and the already accepted ADR 0021. README/STATUS/TESTING now have distinct concise roles, historical audits/plans are clearly labelled, catalogue/photo coverage reflects runtime, and installer mirrors/rights/unique evidence remain intact. A final fetch found hosted implementation at `c88bc41` on a separate branch; the Cloud handoff now resumes it and accurately reports blocked publication instead of calling implementation unstarted.

Repository/TypeScript checks, 18 tooling/190 application tests, both curriculum integrity validators, full local-link/anchor and mirror checks pass. Independent review found no actionable issue; a cosmetic history-heading encoding loss was corrected. Final checkpoint/staged checks, focused commit and verified task-branch push complete delivery. No product code, data, JSON content or media changed.
