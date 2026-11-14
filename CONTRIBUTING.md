# Development workflow

Read [AGENTS.md](AGENTS.md), [status](docs/STATUS.md), and the relevant [product plan](PROJECT_PLAN.md) before a task.

## Branches and scope

Use `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`. Keep a complete reviewable outcome per change. Preserve unrelated owner edits. Origin is configured for the [owner-selected repository](https://github.com/trinamntn08/SmartLingo); inspect live remote history before integrating.

For independent parallel tasks, assign exclusive files and agree shared schemas first. One agent owns dependency manifests and lockfiles. The primary agent integrates and verifies the combined result.

## Checks and commits

Follow the [implementation standards and review criteria](docs/ARCHITECTURE.md#implementation-standards): focused functions, cohesive modules, explicit typed boundaries, and practical extensibility. Review these alongside behaviour and failure handling before handing off a feature or fix.

The owner authorises a focused local checkpoint commit after every completed step, without asking again. A step is a small, coherent, reviewable outcome with acceptance criteria, rather than every file edit or tool call. Follow the [checkpoint policy](docs/SESSION_WORKFLOW.md#automatic-checkpoint-commits).

1. Review the complete diff for correctness, scope, architecture, and sensitive data; address findings relevant to the step.
2. Run `npm run check` and `npm test`, plus relevant application checks once implementation introduces them.
3. Update the session checkpoint with the outcome, actual validation, limitations, and exact next action; update status/decisions when needed.
4. Stage deliberate task paths, inspect `git diff --cached`, and run `npm run check:staged` and `git diff --cached --check` on the final staged content.
5. Commit with a clear subject such as `feat: add restaurant sentence practice`, then verify the new commit and remaining working tree. Report the hash and any work left uncommitted.

Do not create empty commits or bypass failed checks. If a step is interrupted or a check/commit fails, preserve the work and record the exact next action without claiming a successful checkpoint commit. Local checkpoint commits do not automatically authorise a push, merge, or publication; separately authorised remote work retains its scope.

Git pre-commit runs the structural/whitespace and staged-secret checks. It does not run the whole application suite, call APIs, or replace a review. Hooks can be bypassed or unavailable; checks are also explicit commands.

## Local data

Copy [the environment example](.env.example) to a local ignored environment file only when the API is implemented. Keep keys, databases, recordings, transcripts, generated audio, and exported learner data out of Git. Keep reproducible seed content separately under packages/content.

The paid provider path should have deterministic mocked checks and an explicitly requested manual live check. Do not claim voice evaluation is tested from a text-only mock.

## Documentation

Update [status](docs/STATUS.md) after meaningful milestones. Record material architecture changes using [the ADR template](docs/templates/ADR.md). Use [the execution-plan template](docs/templates/EXECUTION_PLAN.md) for substantial work. Label proposed capabilities and commands accurately.

No application license has been chosen. Public distribution/commercial release requires a deliberate license and media-rights decision.
