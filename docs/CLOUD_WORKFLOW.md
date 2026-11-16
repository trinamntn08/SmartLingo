# GitHub and phone-driven Codex Cloud work

Prepared: 2026-11-16 (Europe/Paris). Environment activation and remote check results are recorded in [the session checkpoint](SESSION_CHECKPOINT.md); this guide alone does not establish that an environment is published.

## Scope and acceptance

The owner requested a second working route that can be driven from a phone without keeping the Windows computer running. GitHub stores the source and pull requests; Codex Cloud supplies the computer that edits and tests it. This does not deploy the learner app, transfer personal study data, publish curriculum, or configure automatic task resumption.

Accept this setup when the current source is on GitHub without rewriting history, a setup pull request exposes its checks, a published SmartLingo cloud environment passes its baseline checks, and a phone-started task can verify the expected checkout. Repository preparation can finish before account-specific environment activation.

## Source baseline

For the newer free learner website task, start from `docs/free-testing-deployment` and use the [copyable deployment prompt](CLOUD_DEPLOY_PROMPT.md). The `chore/cloud-workflow` instructions below describe the earlier reusable-environment setup, not the latest deployment-task source. Live fetch on 2026-11-16 also confirmed `origin/chore/a1-a2-curriculum-review` is available; `main` remains at `1c6e943`. Select the task's named source branch rather than assuming `main` contains the current learner.

GitHub `main` was verified at `1c6e943a3a2f4d9fdbf6886a71ac31c0d3b235ef` on 2026-11-16. The complete local learner checkpoint `d5a56eda48751fc8889d2c38b2b4828f52ee31fc` is its descendant, 27 commits ahead. Branch `chore/cloud-workflow` includes that history and the remote workflow preparation. Use that branch until its pull request is explicitly approved and merged; an environment that checks out old `main` will contain only the old tooling scaffold.

Before any later handoff, inspect the live branches and pull requests again. Saved environment files are not a substitute for a pushed commit. Never force-push, replace this repository, or overwrite another task's branch. Keep separate tasks on separate branches and inspect their current remote heads before updating them.

## Create the reusable environment

Use the same ChatGPT account on web/desktop and phone. In a new task, choose **Work in > Cloud > Select environment > Create environment**, or **Settings > Codex Cloud > Environments > Create environment**. Select `trinamntn08/SmartLingo`; connect GitHub if required. Existing connector access does not prove that Codex Cloud is enabled for the account.

Give the setup conversation this brief:

```text
Prepare a reusable Codex Cloud environment named SmartLingo for
https://github.com/trinamntn08/SmartLingo.git.
Fetch origin and use chore/cloud-workflow, not the older main branch.
Confirm that d5a56eda48751fc8889d2c38b2b4828f52ee31fc is an ancestor of HEAD.
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

## Phone acceptance task

On the phone open **Codex**, select the published SmartLingo environment, and send:

```text
Verify this SmartLingo cloud setup without changing source files.
Fetch origin, inspect the working tree and check out chore/cloud-workflow
only if doing so preserves existing work. Report git branch --show-current,
git log -1 --oneline, and whether d5a56eda48751fc8889d2c38b2b4828f52ee31fc
is an ancestor of HEAD. Read AGENTS.md and docs/SESSION_CHECKPOINT.md.
Run npm run check and npm test. Report the results and any blockers.
```

Reopen the same task to continue its existing work across devices. Start a new task for independent work, using its own branch. For an implementation task, include the requested outcome and ask it to push the tested task branch and open or update a draft pull request. Keep merging and deployment explicit owner decisions. Task history and local learner browser storage are separate; source checkout does not restore notebook entries or local editor publications.

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
