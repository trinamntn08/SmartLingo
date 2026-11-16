# Concurrent task sessions

Verified: 2026-11-16. Use one Git worktree, branch and checkpoint per independent task. Two chats opened on the same directory still edit the same files and Git index. File ownership alone cannot protect them from branch switches, staging or commits.

## Start another task

The existing session may keep working in `D:\dev\projects\SmartLingo`. Leave its files, branch, index and servers alone. Run the helper from a checkout containing this tooling:

```powershell
npm.cmd run session -- list
npm.cmd run session -- create notebook-filter --branch feat/notebook-filter --base HEAD
```

The result includes the absolute checkout directory, new branch, exact starting commit and checkpoint path. For this repository the directory is `D:\dev\projects\SmartLingo-sessions\notebook-filter`. The helper works from nested folders when invoked directly with Node and from linked checkouts; it always uses the main worktree to locate the sibling sessions folder. Session names use lowercase letters, numbers and single hyphens, at most 60 characters.

Open that returned folder as a separate project in Codex and start the new task there. The current chat's working directory does not change merely because a worktree was created. Give the new chat this instruction:

```text
Work only in the returned worktree on its assigned branch. Read AGENTS.md,
docs/STATUS.md, docs/PARALLEL_SESSIONS.md and the returned session checkpoint.
Implement <task>. Own <paths>. Record acceptance criteria and shared-file
dependencies before edits. Preserve other sessions and servers. Commit reviewed,
validated steps locally and report the commit; do not merge or push.
```

In the new folder:

```powershell
npm.cmd ci
npm.cmd run check
```

Each checkout needs its own dependencies. Do not junction/symlink `node_modules` or copy another session's builds, Expo cache, databases or credentials. The helper runs Git and writes session notes only; it does not install packages, launch chats/servers, read/copy `.env`, enable providers, alter client permissions or change global configuration. Git hooks already configured as `.githooks` resolve within each checkout; inspect with `git config --get core.hooksPath`. `npm run setup:codex:plan` checks the committed Codex files. Runtime discovery and hook trust still depend on the client.

`--base HEAD` means the invoking checkout's current **commit**. Uncommitted/staged changes from the running session are deliberately excluded. To build on another task, wait for its checkpoint and specify its commit or branch as the base. A new task never silently inherits that session's unfinished edits. Pick a base that contains the session helper; older commits still work as Git worktrees but need the manual workflow below.

Existing directories, branches and invalid options are refused. The helper never stashes, switches, resets, stages, removes worktrees or overwrites checkpoints. If initialization fails after Git creates the checkout, it reports the preserved path for recovery. Git's inventory is authoritative; there is no background lock service or task scheduler.

## Client-managed and existing worktrees

If the client offers **Worktree** for a new chat, that is also suitable. Select the starting branch, create the chat, verify its actual directory with `git rev-parse --show-toplevel`, and create a distinct topic branch if the client starts in detached HEAD. Then register this checkout:

```powershell
npm.cmd run session -- init notebook-filter
```

`init` requires an attached branch, creates the checkpoint once and preserves later progress. It refuses reassignment, names registered in another worktree, or an existing checkpoint without matching metadata. Registration uses a short-lived exclusive `smartlingo-session-init.lock` file in Git's common directory so simultaneous initializers cannot claim the same name. A busy initializer fails explicitly; retry after it finishes. If it crashes, inspect that lock's PID/directory and confirm that initializer has stopped before removing only the named lock file. Never delete Git's own `index.lock` or assume a lock is stale just because a command takes time. Client-managed worktrees have client-controlled cleanup; our helper creates ordinary Git worktrees outside that lifecycle. Do not hand off into the occupied main checkout while its session is still active.

If the selected base predates the helper, use ordinary Git without editing the active tree:

```powershell
git worktree add -b feat/notebook-filter D:/dev/projects/SmartLingo-sessions/notebook-filter <starting-commit>
```

Open that directory as the new project, install dependencies, and maintain a unique `docs/sessions/notebook-filter.md` checkpoint manually. Substitute an actual commit for `<starting-commit>`; do not copy the placeholder literally.

## Checkpoints, ownership and integration

- Each helper-created checkout has ignored `.codex/sessions/session.json` pointing to tracked `docs/sessions/<name>.md`. The start hook points at that note when the client executes the hook. Without hook support, read it manually. If metadata is lost, recover it deliberately; do not overwrite an existing note.
- For registered sessions, their task note replaces `docs/SESSION_CHECKPOINT.md` as the frequently updated checkpoint, including failures, usage observations, actual checks and next actions. Keep the root checkpoint as an entry point/legacy history. Read shared STATUS for context, but verify it against this branch's files.
- Before edits, record the request, acceptance criteria and exclusive file ownership in the task note. Separate worktrees prevent filesystem interference; changes to the same files can still conflict when integrated. Agree shared contracts first. Assign one owner to manifests/lockfiles, schemas, global status/checkpoint summaries and shared documentation for each integration step.
- Each session reviews, stages explicit paths and commits only in its own checkout. The existing local checkpoint authorisation applies. Worktree indexes and branches are separate; refs, repository configuration and stash are shared. Do not modify shared Git configuration, run cross-session stash operations, prune others' worktrees, or rewrite/delete another task's branch.
- Sessions can implement, typecheck, run tooling/application tests and build in parallel. Browser suites and API-connected journeys have the limits below. Shared account usage is not increased by opening more sessions; check exposed allowance and avoid unnecessary duplicate heavy runs.
- One designated integrator combines completed task commits, resolves conflicts, updates global STATUS/root checkpoint and runs combined checks **after the owner authorises integration**. First inspect live remote history as required by AGENTS.md. Do not merge into, cherry-pick into or switch the active owner's checkout. This setup authorises no push, merge or publication.

## Servers, browser storage and tests

Worktrees separate source files, local npm/Expo caches, `apps/learner/dist`, test artifacts and default `data/*.sqlite` files. They do not separate TCP ports, environment variables inherited by terminals, OS processes or browser storage at the same origin. Record any owned server's port, PID, origin and data path in the task note before using it. Check listeners first; a planned port is not a reservation. Do not stop another session's process or accept Expo's automatic port fallback without checking where it started.

| Operation | Current behavior and concurrency rule |
| --- | --- |
| `npm run check`, `npm test`, `npm run build:web` | Run inside each checkout with its own installed dependencies/output. Limit heavy parallel jobs if the machine struggles. |
| Learner development | Defaults to 8081. For bundled study in a second session, use `npm.cmd run web --workspace @smartlingo/learner -- --port 8091` after checking that port. Choose distinct ports for later sessions. |
| `npm run preview:web` | Fixed port 8082. Preserve the owner's server; use the explicit isolated preview below. |
| `npm run dev:api` | Defaults to 3001; `PORT` can select another port. Default curriculum/speech SQLite paths resolve inside that worktree. Do not inherit explicit database paths pointing to owner data. |
| Editor, AI practice, saved neural generation | Learner clients currently target API 3001; API browser origins are allowlisted. A learner on 8091 plus an API on 3011 is **not** a working connected pair. Do not widen guards or reuse the owner's API for convenience. Use bundled study for independent previews; coordinate one reserved connected-test window with the owner/integrator. |
| `npm run test:e2e` | Uses fixed 8081 and test API 3002, with additional hardcoded test origins. Development-server reuse can connect to another task. Serialize between sessions, ensure those ports are free, and use `CI=1` in the test terminal to refuse reuse. |
| `npm run test:offline` | Builds this checkout and uses fixed 8082. It refuses existing-server reuse. Run only in an agreed window after the owner of 8082 has released it; leave the running owner preview untouched otherwise. |

An isolated exported preview on a free port, from the task root after `npm.cmd run build:web`:

```powershell
node --input-type=module -e "import { createWebPreview } from './scripts/serve-web.mjs'; createWebPreview().listen(8092, '127.0.0.1', () => console.log('http://localhost:8092'));"
```

This serves that checkout's export without changing the fixed-port script. Ordinary bundled study/offline storage is isolated at `http://localhost:8092`. Editor/AI access is not configured there. Use one stable hostname per preview; `localhost` and `127.0.0.1` are different browser origins. Never copy another origin's learner data implicitly.

For an intentionally isolated API-only check, clear inherited database overrides in that terminal first, set `$env:PORT = '3011'`, then run `npm.cmd run dev:api`. Keep credentials unconfigured for ordinary tests. Closing that terminal discards its environment changes. Do not set machine/user-wide variables. No automated port allocation or fully parallel browser-suite support is claimed by this setup.

## Finish and cleanup

Run the relevant checks, `git diff --check`, final staged checks and a focused local checkpoint commit in the task checkout. Report its absolute path, branch, commit, tests and any remaining servers/data. Keep the worktree available for review. Do not remove it while its chat/processes are active or before all work has been preserved and integrated or explicitly retained.

When cleanup is authorised, verify `git status --short` is empty in the **named task directory**, inspect ignored local data/builds too (`git status --short --ignored`), and stop only that task's processes. From another checkout run `git worktree remove <absolute-task-directory>` without `--force`. Git's clean check does not protect ignored data; retain/export needed local files first. Keep the branch/commits until integration is confirmed. Never use recursive shell deletion, forced removal or automatic branch deletion as session cleanup.

## References

Checked 2026-11-16: [official Git worktrees](https://git-scm.com/docs/git-worktree) document separate working files/indexes and shared refs/configuration; [official Codex worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) describe per-chat worktrees, detached HEAD, handoff and managed cleanup. Client controls vary; manual Git worktrees remain usable without those controls. The repository's three-subagent cap is per-session delegation configuration, not a switch that isolates separate user chats.
