# 0020: Independent task sessions use Git worktrees

Date: 2026-11-16. Status: accepted for the owner-requested concurrent-session setup.

## Context

The owner wants several sessions working on different tasks simultaneously while an existing session continues editing the main checkout. Separate chats on one checkout share source files, branch and staging index; assigning different files alone does not make commits or branch operations safe.

## Decision

Give each independent task a separate worktree, topic branch, local dependencies and tracked task checkpoint. Add a Node/Git helper for creation, registration and authoritative inventory; store only advisory session metadata in ignored `.codex/sessions/session.json`. Do not copy uncommitted changes or private runtime files. Keep normal reviewed local checkpoint commits.

Global summaries are integration responsibilities; task checkpoints replace repeated writes to the root checkpoint. Lifecycle context points at the registered task note without changing hook definitions or client trust. An existing task's branch/files/index/processes remain untouched.

## Consequences

Concurrent implementation, builds and unit checks are isolated. Shared refs/configuration, ports, account allowance, browser origins and fixed-port browser suites still need coordination. Connected API/browser tests remain serialized with current hardcoded client origins. No permission defaults, provider credentials, app security guards, push/merge authorisation, paid calls or background scheduler are added. Dependencies take additional disk space per checkout. Worktrees prevent accidental shared-file edits, not integration conflicts.

See [operating instructions and verified limits](../PARALLEL_SESSIONS.md).
