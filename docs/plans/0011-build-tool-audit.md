# Build-tool minimatch audit remediation

Status: investigation completed; remediation remains pending
Owner: primary agent

## Outcome and acceptance

Resolve the three linked moderate findings in Expo → @expo/fingerprint → minimatch without downgrading Expo/React or altering the owner’s served preview. Confirm actual nested resolution, reproducible installation, ignore-pattern compatibility, repository/application checks and production export. If a compatible fix is unavailable, preserve dependencies and record the precise blocker; do not suppress the audit or claim success.

## Evidence and approach

On 2026-11-15, npm registry reports Expo 58.0.25 and fingerprint 0.21.10 as current stable releases. Fingerprint still requests minimatch ^10.2.6; the [upstream advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) affects 7 through 11.0.0 and is patched from 11.0.1. npm's automated fix would downgrade Expo to SDK52. Current minimatch is 11.0.8, supporting Node20/22+ (project uses Node24).

[Minimatch's official changelog](https://github.com/isaacs/minimatch/blob/main/changelog.md) describes actual major-version changes: removed regexp/AST/internal methods and changed trailing-empty-segment matching. Fingerprint's runtime uses Minimatch constructor, pattern, negate and match, not the removed APIs. A narrow override scoped to fingerprint 0.21.10 may be compatible, but must be tested rather than assumed. [npm override documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides) permits parent/version-scoped overrides. Previous ineffective generic override was removed; verify lockfile and installed nested package, not just root manifest.

## Steps and ownership

Primary alone owns package/lockfile, compatibility checks and docs. Small sequential dependency step; no new implementation agent. Test candidate in an ignored isolated install first, then scoped root override and actual nested resolution/audit. Independently review any retained override and its test evidence before final checks/checkpoint commit. Stable exported owner preview on localhost8082/API3001 stays running; do not overwrite its export or reuse it for fault-injection tests. No paid APIs, global npm changes, push or public release.

## Actual outcome

Installed minimatch 11.0.8 only in an ignored compatibility fixture. A VM-injected fingerprint Path helper agreed with the existing matcher for 24 representative default/optimizationLevel2 cases, including parent directories, native build paths, dot directories and negated keep paths. This is a bounded compatibility observation, not complete upstream support.

A scoped root override for `@expo/fingerprint@0.21.10` → `minimatch:11.0.8` was tried with `npm install --ignore-scripts`, then explicit `npm update minimatch --workspaces --include-workspace-root --ignore-scripts`. `npm ls`/`npm explain` still resolved 10.2.6, and audit still reported three moderate findings. The second command only relocated the same vulnerable version from nested to hoisted storage. Both deliberate manifest/lockfile experiments were reverted. A clean install from the original lockfile restores the original dependency layout; no ineffective override, SDK downgrade or suppression is retained.

The outstanding issue is unchanged: current Expo/fingerprint has no stable published dependency range accepting the patched minimatch release. Revisit an upstream-compatible release or a separately validated reproducible resolution mechanism before wider distribution. Do not repeat the same ineffective override and claim the root manifest resolved the audit. This investigation changes documentation only and leaves the served export unchanged.
