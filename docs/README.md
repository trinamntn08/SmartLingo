# Documentation index

| Document | Purpose |
| --- | --- |
| [Product plan](../PROJECT_PLAN.md) | Requirements, decisions, assumptions, milestones |
| [Status](STATUS.md) | What exists and the next implementation task |
| [Session workflow](SESSION_WORKFLOW.md) | Efficient usage, automatic checkpoint commits, and resume limits |
| [Session checkpoint](SESSION_CHECKPOINT.md) | Current request, validation, and exact recovery step |
| [Codex setup](CODEX_SETUP.md) | Instructions, subagents, hooks, skills, compatibility |
| [Architecture](ARCHITECTURE.md) | Planned modules, boundaries, implementation standards, and review criteria |
| [Content guide](CONTENT_GUIDE.md) | French lesson authoring and review |
| [Testing](TESTING.md) | Tooling, application and browser checks; device limitations |
| [Environment](ENVIRONMENT.md) | Local dependencies, runtime versions, and packaging boundaries |
| [Bootstrap decision](decisions/0001-project-tooling.md) | Why the repository uses this setup |
| [Implementation standards decision](decisions/0002-implementation-standards.md) | Owner requirement for clean, modular, extensible code |
| [Checkpoint commits decision](decisions/0003-checkpoint-commits.md) | Standing authorisation to commit each completed, reviewed, validated step locally |
| [Local preview foundation](decisions/0004-local-preview-foundation.md) | Bundled drafts, persistence adapters, local read-only API |
| [Local editor publication](decisions/0005-local-editor-publication.md) | Draft revisions, preview receipts, local request guards, publication cache |
| [Learner backup](decisions/0006-learner-backup.md) | Versioned private snapshots and atomic merge restore |
| [Manual recognition review](decisions/0007-manual-recognition-review.md) | Manual ratings, local-day schedule and versioned history |
| [Visible study details](decisions/0008-visible-study-details.md) | Owner preference for directly visible meanings/examples/explanations |
| [Everyday examples and gender](decisions/0011-example-revisions-and-gender.md) | Fuller original examples, optional noun gender and immutable seed refresh |
| [Offline web assets](decisions/0012-offline-web-assets.md) | Explicit validated app downloads, cache-only removal and loopback preview |
| [Curriculum snapshots](decisions/0013-curriculum-snapshots.md) | Consistent server backups and explicit recovery to a new file |
| [First implementation plan](plans/0001-local-foundation.md) | Scope, acceptance criteria, ownership and validation |
| [Editor execution plan](plans/0002-editor.md) | First editor fields and validated publication journey |
| [Backup execution plan](plans/0003-backup.md) | Learner export, bounded import and merge validation |
| [Review execution plan](plans/0004-manual-review.md) | Recognition queue, local dates and backup compatibility |
| [Study-detail simplification](plans/0005-visible-study-details.md) | Remove study dropdowns and verify responsive presentation |
| [Everyday examples plan](plans/0009-everyday-examples.md) | Complete example sentences, compact gender and speaker icons |
| [Offline web plan](plans/0010-offline-web-downloads.md) | Download/retry/update/removal and cold offline browser verification |
| [Curriculum snapshot plan](plans/0012-curriculum-database-backup.md) | Read-only backups, no-overwrite recovery and configured API startup |
| [ADR template](templates/ADR.md) | Record a material technical decision |
| [Execution-plan template](templates/EXECUTION_PLAN.md) | Plan and track substantial implementation |
