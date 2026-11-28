# GitHub and phone-driven Codex Cloud work

Prepared: 2026-11-16 (Europe/Paris). Environment activation and remote check results are recorded in [the session checkpoint](SESSION_CHECKPOINT.md); this guide alone does not establish that an environment is published.

Source selection refreshed 2026-11-24. Use the current branch in the Japanese-enabled learner lineage after verifying all GitHub branch heads. Client navigation and external service details retain their original check date below.

## Scope and acceptance

The owner requested a second working route that can be driven from a phone without keeping the Windows computer running. GitHub stores the source and pull requests; Codex Cloud supplies the computer that edits and tests it. This does not deploy the learner app, transfer personal study data, publish curriculum, or configure automatic task resumption.

Accept this setup when the current source is on GitHub without rewriting history, a setup pull request exposes its checks, a published SmartLingo cloud environment passes its baseline checks, and a phone-started task can verify the expected checkout. Repository preparation can finish before account-specific environment activation.

## Source baseline

For current French/Japanese learner work, start source selection with `origin/feat/french-daily-opening`, the shared local preview lineage verified on 2026-11-24. Fetch and compare all GitHub branches, then check any Cloud changes relevant to the requested outcome before selecting the base. The earlier `origin/feat/unified-learning-hub`, the older `main`, the Android branch and the hosted branch remain useful history for their own tasks. [Repository state](REPOSITORY_STATE.md) records source and worktree context.

For an explicitly requested hosted continuation, also inspect `codex/free-learner-cloud-deploy` and the [historical deployment brief](CLOUD_DEPLOY_PROMPT.md). That older branch contains hosting capability gates, not the current Japanese hub; its checkpoint reports account/network-blocked publication and no live URL. A release of the current app needs deliberate reconciliation and validation before deployment. Fetch again before relying on any recorded SHA; Git synchronization alone does not combine the implementations.

The earlier `chore/cloud-workflow` preparation is preserved in Git. Account-specific work and `chore/concurrent-sessions` tooling remain separate branch work, not capabilities established by this checkout. The owner's later automatic task-branch commit/push instruction is reconciled here through [ADR 0021](decisions/0021-automatic-task-branch-pushes.md); it is policy, not installed automation. Do not select a branch simply because its name sounds relevant.

Before starting a task or handing off the shared preview, follow the [full inventory and Cloud-to-local checks](SESSION_WORKFLOW.md#cloud-to-local-handoff). Use the source named by the task and verify its ancestry before making a new task branch. Check the actual GitHub ref and verified SHA for delivery evidence. Never force-push, replace this repository or overwrite another task's branch.

## Hand off Cloud work to local

1. In Cloud, record the requested outcome, changed feature, base SHA, actual checks and pending work in the checkpoint and work log. For a learner change, include where to open it and whether local integration remains pending. Commit the handoff notes with the reviewed change.
2. Push the assigned task branch to GitHub under the standing checkpoint policy. Read its live ref with `git ls-remote --exit-code --heads origin refs/heads/<task-branch>` and verify the returned SHA against `git rev-parse HEAD`. Include the GitHub branch link, full verified SHA, checks and learner entry point in the final handoff. If the push is blocked, preserve the commit and report the exact failure and how the source can be recovered.
3. When resuming locally, find the handoff among all fetched branches, compare the Cloud changes with the intended preview branch, and record their disposition. For authorised integration, verify the new build and the feature from the shared preview before calling it available there. [Cloud-to-local procedure](SESSION_WORKFLOW.md#cloud-to-local-handoff)

## Create the reusable environment

The following client navigation was checked on 2026-11-16; labels may change. Use the same ChatGPT account on web/desktop and phone. In a new task, choose **Work in > Cloud > Select environment > Create environment**, or **Settings > Codex Cloud > Environments > Create environment**. Select `trinamntn08/SmartLingo`; connect GitHub if required. Existing connector access does not prove that Codex Cloud is enabled for the account.

Give the setup conversation this brief:

```text
Prepare a reusable Codex Cloud environment named SmartLingo for
https://github.com/trinamntn08/SmartLingo.git.
Fetch all GitHub branch heads and compare the full live and fetched inventories.
Start with the verified shared learner branch, feat/french-daily-opening,
and inspect relevant Cloud work across branches before selecting the base.
Read docs/REPOSITORY_STATE.md and confirm the intended source ancestry.
Do not silently substitute the older hosted implementation for the current app.
Inspect live history before creating a separate setup task branch.
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
For repository changes, commit the handoff, push the assigned task branch,
and verify its live GitHub SHA as described in docs/SESSION_WORKFLOW.md.
```

On a Linux cloud runner use `npm`, not the Windows-only `npm.cmd` spelling found in historical checkpoints. The repository version files and engine checks remain authoritative. `npm run setup:finish` is a one-time bootstrap for repositories without history and must not be rerun here.

Keep provider secrets unset for normal development. The tests use fake providers and temporary data. Allow package registries and the exact runtime/browser download hosts needed by installation; investigate a failed hostname before expanding access. Do not upload local SQLite databases, browser profiles, recordings, or real `.env` files.

Review the setup report and configuration, then save and select **Publish**. Environment publication saves the development setup; it is separate from GitHub merging, app deployment, and curriculum publication. Repository skills travel with source. Personal skills on the Windows computer do not automatically sync, and repository hook/role files do not prove runtime activation.

## Connect the SmartLingo APK folder in Google Drive

1. Install [rclone for Windows](https://rclone.org/downloads/). Open PowerShell in the extracted folder and run `.\rclone.exe authorize drive`. Approve rclone in the browser on that same PC with the Google account that can access the SmartLingo Drive folder. The local callback URL only works on the machine running rclone.
2. Copy the entire JSON object printed between the rclone output markers, including both braces and the `refresh_token` field. Paste it straight into the value field in step 3. Keep it out of chat, screenshots, repository files and Git.
3. Open **Settings → Codex Cloud → Environments → SmartLingo → Edit → Environment variables → Manage**. Set the values below. Rclone reads the JSON directly from the running process, so use the environment-variable panel. Save the dialog, then publish if the editor shows unpublished changes.

   | Key | Value |
   | --- | --- |
   | `RCLONE_CONFIG_SMARTLINGO_DRIVE_TYPE` | `drive` |
   | `RCLONE_CONFIG_SMARTLINGO_DRIVE_TOKEN` | The complete rclone JSON object, with no extra quotes or code fences |

4. If public internet access is restricted, check **Additional allowed domains** for `www.googleapis.com` and `oauth2.googleapis.com`. The first serves Drive requests and the second refreshes credentials.
5. Start a fresh Cloud chat with **SmartLingo** selected. With rclone available, run this read-only check. It suppresses file names.

   ```bash
   rclone lsf smartlingo_drive: --drive-root-folder-id 1ixuZ1ZR-NnYeoA15sCN9d4AQCuoLi42_ >/dev/null
   ```

   Exit code `0` means the listing request succeeded. An empty listing can mean no entries are visible. Verify the folder ID against the Drive link and the account's folder access separately before relying on an empty result. A listing alone cannot confirm upload permission.

If rclone cannot find the remote, check the exact `TYPE` key and remote name, then verify the token variable is present without displaying it. A token decoding error means the saved value needs to be checked for complete JSON. If Google returns HTTP `401`, reauthorize on Windows and replace the token value, then repeat the test in a fresh Cloud chat.

[rclone browser authorization](https://rclone.org/remote_setup/) · [Codex Cloud environment variables](https://learn.chatgpt.com/docs/environments/cloud-environments#configure-environment-variables-and-network-secrets)

## Phone acceptance task

On the phone open **Codex**, select the published SmartLingo environment, and send:

```text
Verify this SmartLingo cloud setup without changing source files.
Fetch all GitHub branch heads and compare the live and fetched inventories.
Inspect the working tree, the current shared learner lineage and matching
Cloud handoffs before selecting the source. Preserve other tasks and report
any source blocker. Report the inventory count, current branch and full SHA,
the live source SHA and any relevant Cloud work pending integration.
Confirm the shared Japanese learner is present. Read AGENTS.md,
docs/REPOSITORY_STATE.md and docs/SESSION_CHECKPOINT.md.
Run npm run check and npm test. Report the results and any blockers.
```

Reopen the same task to continue its existing work across devices. Start a new task for independent work, using its own branch. Include the requested outcome; the standing checkpoint policy covers committing/pushing validated work, while creating a draft pull request follows the task's scope. Keep merging and deployment explicit owner decisions. Task history and local learner browser storage are separate; source checkout does not restore notebook entries or local editor publications.

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
