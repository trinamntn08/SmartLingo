# GitHub and phone-driven Codex Cloud work

Reviewed: 2026-11-16 (Europe/Paris). GitHub state and CI below were checked directly. The owner confirms republishing the environment and opening it on the phone; a command-level Cloud acceptance report has not yet been supplied. See [the session checkpoint](SESSION_CHECKPOINT.md) for the current handoff.

For a beginner diagram-led explanation of the app, data storage, remote work and deployment stages, read [Architecture and deployment explained](ARCHITECTURE_EXPLAINED.md).

## Scope and acceptance

The owner requested a second working route that can be driven from a phone without keeping the Windows computer running. GitHub stores the source and pull requests; Codex Cloud supplies the computer that edits and tests it. This does not deploy the learner app, transfer personal study data, publish curriculum, or configure automatic task resumption.

Accept this setup when the current source is on GitHub without rewriting history, a setup pull request exposes its checks, a published SmartLingo cloud environment passes its baseline checks, and a phone-started task can verify the expected checkout. Repository preparation can finish before account-specific environment activation.

## Current readiness

| Area | Verified state on 2026-11-16 |
| --- | --- |
| GitHub backup | All 25 local branch heads match GitHub; upload checkpoint `4d6a4a1` |
| Current app CI | [Run 43951957211](https://github.com/trinamntn08/SmartLingo/actions/runs/43951957211) on `4d6a4a1` succeeds: repository/TypeScript, 18 tooling, 190 application, 81 browser and 8 offline cases; one intentional browser skip |
| Cloud environment | Owner confirms it was updated and republished |
| Phone access | Owner confirms opening the republished environment under Codex on the phone |
| Command-level acceptance | Still to record: correct fetched source, runtime versions and successful checks from a new phone-started Cloud task |
| Default branch | `main` remains the old scaffold; [PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) is open, draft and mergeable, not merged |

No additional hosting, permanent provider key or local-PC connection is needed for ordinary source work. A successful Cloud task that verifies the checkout and runs checks is the final setup confirmation. The first real remote implementation should also deliver a pushed task branch and PR; cloud-side write delivery has not been exercised in this chat. Merging PR #1 is optional for this setup while tasks explicitly use the app branch; later integration would make the default branch current.

## Source baseline

GitHub `main` was verified at `1c6e943a3a2f4d9fdbf6886a71ac31c0d3b235ef` on 2026-11-16. The complete local learner checkpoint `d5a56eda48751fc8889d2c38b2b4828f52ee31fc` is its descendant, 27 commits ahead. Branch `chore/cloud-workflow` includes that history and the remote workflow preparation. Use that branch until its pull request is explicitly approved and merged; an environment that checks out old `main` will contain only the old tooling scaffold.

The branch is uploaded and [draft PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) is open. Preparation checkpoint `1c5b5d4` is verified on GitHub. The setup report supplied by the owner initially showed only 16 tooling tests and no application: that is the old baseline. If an environment has already been published from that baseline, choose **Edit**, prepare the current branch using the brief below, verify the actual app checks, then **Republish** before starting a new task.

Application fix checkpoint `5d80acb` passes [Linux verification](https://github.com/trinamntn08/SmartLingo/actions/runs/43945569030), and the latest reviewed upload `4d6a4a1` passes the full run linked above. Use the latest fetched remote branch including this fix. A greetings-only ancestor check is insufficient: old preparation `1c5b5d4` includes greetings but lacks the focus fix.

| Branch | Purpose and integration state |
| --- | --- |
| `main` at `1c6e943` | Default branch, old tooling scaffold; do not use as the app baseline yet |
| `chore/cloud-workflow` | Current tested learner, focus fix and Cloud documentation; use latest `origin/chore/cloud-workflow` for ordinary app work |
| `chore/a1-a2-curriculum-review` at `8ba59ae` | Uploaded research/candidate drafts and validator, not integrated into the app branch or published curriculum |
| `chore/concurrent-sessions` at `8e36885` | Uploaded local worktree tooling, not integrated into the app branch; its commands are not available here yet |
| Other uploaded branches | Preserved feature/history checkpoints; uploading them does not combine their changes |

Before any later handoff, inspect the live branches and pull requests again. Saved environment files are not a substitute for a pushed commit. Never force-push, replace this repository, or overwrite another task's branch. Keep separate tasks on separate branches and inspect their current remote heads before updating them.

## Create the reusable environment

Use the same ChatGPT account on web/desktop and phone. In a new task, choose **Work in > Cloud > Select environment > Create environment**, or **Settings > Codex Cloud > Environments > Create environment**. Select `trinamntn08/SmartLingo`; connect GitHub if required. Existing connector access does not prove that Codex Cloud is enabled for the account.

Give the setup conversation this brief:

```text
Prepare a reusable Codex Cloud environment named SmartLingo for
https://github.com/trinamntn08/SmartLingo.git.
Fetch origin and use the latest origin/chore/cloud-workflow, not older main
or a stale local branch. Inspect and preserve existing work before updating.
Report HEAD and the fetched remote tip. Require them to match for this setup,
and confirm 5d80acbf7e921c860b4ce7ea256f84093611dfb7 is an ancestor of HEAD.
Read AGENTS.md, docs/STATUS.md, docs/SESSION_CHECKPOINT.md and
docs/SESSION_WORKFLOW.md. Inspect the working tree before changing anything.
Use Node 24.19.0 and npm 11.17.0 as required by the repository.
Install dependencies with npm ci and Git hooks with npm run setup.
Install Chromium and its OS dependencies using the local Playwright package:
npx playwright install --with-deps chromium
Run npm run check and npm test. Then run
npm run test:e2e -- --workers=2 and npm run test:offline sequentially.
Report actual results and fix setup failures before publication.
Use isolated test data and existing fake providers. Do not supply production
credentials, read real .env files, call paid providers, publish lessons,
merge branches, deploy the app, or change the owner's local computer.
Record the tested installation commands and instructions to start services
on demand. Do not leave the learner/API running for every unrelated task.
```

On a Linux cloud runner use `npm`, not the Windows-only `npm.cmd` spelling found in historical checkpoints. The repository version files and engine checks remain authoritative. `npm run setup:finish` is a one-time bootstrap for repositories without history and must not be rerun here.

Keep provider secrets unset for normal development. The tests use fake providers and temporary data. Allow package registries and the exact runtime/browser download hosts needed by installation; investigate a failed hostname before expanding access. Do not upload local SQLite databases, browser profiles, recordings, or real `.env` files.

Review the setup report and configuration, then save and select **Publish**. Environment publication saves the development setup; it is separate from GitHub merging, app deployment, and curriculum publication. Repository skills travel with source. Personal skills on the Windows computer do not automatically sync, and repository hook/role files do not prove runtime activation.

To update an existing setup: **Settings / Paramètres > Codex Cloud > Environments / Environnements > SmartLingo > … > Edit / Modifier**. Describe the change in the setup conversation, let it prepare/test the environment, save, then select **Republish / Republier**. An unpublished environment uses **Publish / Publier**. Start a new task after republishing; existing tasks keep their own saved files and tools. The owner has already confirmed this publication step, so repeat it only if setup configuration needs another change.

## Phone acceptance task

On the phone open **Codex**, select the published SmartLingo environment, and send:

```text
Verify SmartLingo in this new Cloud task without editing source files.
Fetch origin and inspect the working tree. Use the latest fetched
origin/chore/cloud-workflow as the baseline only if existing work is preserved.
If this task has existing edits or commits, preserve them and report the
blocker rather than resetting, overwriting or claiming a fresh acceptance run.
Report branch, HEAD, origin/chore/cloud-workflow SHA and git status.
Require HEAD to match that fetched remote tip, and confirm
5d80acbf7e921c860b4ce7ea256f84093611dfb7 is an ancestor of HEAD.
Read AGENTS.md and docs/SESSION_CHECKPOINT.md. Report node --version
and npm --version. Verify dependencies are installed from package-lock.json,
run npm run setup if needed, then npm run check and npm test.
Report actual results. Do not call paid providers, edit/publish curriculum,
push changes, merge branches or deploy anything for this read-only check.
```

Reopen the same task to continue its existing work across devices. Start a new task for independent work, using its own branch. For an implementation task, state the requested outcome and task-branch/PR target; reviewed commits and pushes follow the standing policy below. Request a draft PR when a review handoff is wanted. Keep merging and deployment explicit owner decisions. Task history and local learner browser storage are separate; source checkout does not restore notebook entries or local editor publications.

The owner's 2026-11-16 standing instruction makes committing and pushing the assigned task branch automatic after completed, reviewed, validated steps. No repeat push confirmation is needed. Follow [the checkpoint workflow](SESSION_WORKFLOW.md#automatic-checkpoint-commits), inspect live remote history and verify the pushed SHA. This does not merge, deploy, publish curriculum or push unrelated branches.

After the acceptance report passes, no further repository setup is required for ordinary Cloud work. Use this task brief for a real change:

```text
Work in the SmartLingo Cloud environment using the latest
origin/chore/cloud-workflow as the base. Read AGENTS.md and the checkpoint.
Create a separate task branch, implement [requested outcome], run relevant
checks, update the handoff, commit and push that branch, and open a draft PR
against chore/cloud-workflow. Do not merge, deploy or publish curriculum.
```

Targeting the app branch keeps a new PR limited to its task while `main` is old. After PR #1 is deliberately merged, refresh this guide and use updated `main` for later task branches. Do not merge the research or local-session tooling branches just to make Cloud work possible.

## GitHub verification

[The workflow](../.github/workflows/verify.yml) runs on pull requests, pushes to `main`, and manual dispatch once present on the default branch. It uses Ubuntu 24.04, the repository's Node version and npm 11.17.0. It runs repository/TypeScript and tooling/application tests, plus Chromium desktop/narrow and exported offline journeys. Browser tests use two workers; offline tests retain their one-worker configuration.

Actions have read-only repository permissions and do not receive provider secrets or publish anything. Failed browser diagnostics contain isolated test fixtures and expire after seven days. No deployment or public preview URL is created. Green checks become evidence only after the remote jobs actually finish; branch protection is not configured by adding a workflow file.

If setup is interrupted, consult [the checkpoint](SESSION_CHECKPOINT.md) and the pull request's checks before continuing. A Cloud task can work while the PC is asleep, but quota recovery, scheduled continuation, and indefinite background work are not established by this setup.

## Official references

Checked on 2026-11-16:

- [Codex Cloud environments and mobile continuation](https://learn.chatgpt.com/docs/environments/cloud-environments)
- [Codex plan eligibility and Cloud access](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [GitHub checkout action](https://github.com/actions/checkout)
- [GitHub Node setup action](https://github.com/actions/setup-node)
- [Playwright continuous integration](https://playwright.dev/docs/ci-intro)
