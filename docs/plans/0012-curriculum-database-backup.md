# Server curriculum database backup and recovery

Status: completed
Owner: primary agent

## Outcome and acceptance

The owner can explicitly create a consistent SQLite backup of the local curriculum, including every immutable draft/published revision, then restore it to a new file and start the local API against that verified recovery file. Existing files, running API data, learner IndexedDB and current preview remain untouched. Commands refuse overwrite and invalid/unsupported/corrupt curriculum databases. No automatic publication, merging, secret/recording backup, upload, paid call or public endpoint.

This bounded first slice uses local CLI commands, not editor buttons or automatic replacement of the running database. A completed backup exposes a validated snapshot only after successful copy/integrity/content checks. Restore means making another verified snapshot at a fresh path; server switching is explicit after stopping the chosen API process. Keep backups privately/off-device; the default ignored local backup directory is not remote protection.

## Contracts and ownership

Primary owns `curriculum-backup-contracts.ts`, path configuration, CLI entrypoint, package commands, server integration, CLI/config tests and docs. `api-builder` (gpt-6.1-sol medium) owns only `apps/api/src/curriculum-backup.ts` and `apps/api/tests/curriculum-backup.test.ts`: `createCurriculumSnapshot(sourcePath, destinationPath): Promise<CurriculumSnapshotReport>` and `inspectCurriculumSnapshot(path): CurriculumSnapshotSummary`. Snapshot reports expose counts/path, never lesson payloads. Independent read-only review follows for source safety, schema validation and no-overwrite recovery. No new dependencies. Usage tools unavailable; bounded delegation. Others preserve these exclusive boundaries.

Use Node24 `node:sqlite` online `backup` from a read-only source connection into a uniquely named sibling staging file. Validate supported user_version1, full SQLite integrity including index/table correspondence, exact expected curriculum schema, and every lesson row/ID/revision before exposing the new file. No seeding/migration/write against the source. An exclusive final publish (same-directory hard link that fails if destination exists) prevents races/overwrites; cleanup only owned staging artifacts. Source and destination must differ; destination ends .sqlite. Missing/corrupt/future-schema/foreign-table/invalid historical revision/occupied destination failures preserve source and target. Streaming row iteration and an 8 MiB per-row limit bound validation memory. Filesystems must support hard links. OS cleanup failure after a successful publish may leave a private staging directory; the valid completed snapshot is retained.

Primary adds `SMARTLINGO_DATABASE_PATH` for an explicit existing recovered file, resolving relative paths against repository root regardless npm workspace cwd. Default startup remains data/smartlingo.sqlite. Configuring a missing recovery file must fail rather than silently seed a new database. No real .env file is read. The owner's running API/8082 preview is not restarted or modified to test recovery; all operational checks use temporary databases and isolated ports.

## Official references checked 2026-11-15

- [Node24.19 SQLite source documentation](https://github.com/nodejs/node/blob/v24.19.0/doc/api/sqlite.md): DatabaseSync readOnly/timeout/defensive defaults, asynchronous sqlite.backup and source-connection behavior. The versioned nodejs.org URL was inaccessible; used exact-version official source and installed Node24 typings.
- [SQLite online backup API](https://www.sqlite.org/backup.html): coherent snapshots of a running database; copying raw files without the API can miss transaction state.

## Validation and checkpoint

Temporary SQLite fixtures cover all revisions, published selection, WAL/uncheckpointed data, readonly/no source mutation, independent copies, existing target/collision, corrupt historical row/schema/version/foreign data, cleanup and reopening a recovered file. CLI parse/help/errors/restore-to-new-file and configured-server smoke checks must never open owner storage. Run repository/TypeScript and relevant combined suites, independent review, final whitespace/staged-secret checks, docs and focused local commit. Existing learner/browser behavior is unchanged; no repeated full browser suite unless implementation changes justify it.

Previous checkpoints: fea47df offline preview, 5aa1bf2 documented unresolved build-tool audit. Stable owner preview remains http://localhost:8082/API3001.

## Completed outcome and review

Both public npm CLI commands and explicit recovery-file startup are implemented. Repository/TypeScript and all 18 tooling/93 application tests pass. Four CLI/config cases execute actual child commands, reject bad parsing/missing/foreign files, recover privately and start an isolated API without touching default storage. Ten snapshot cases cover full history/WAL, new independent copies, destination aliases/races, schema/history/index corruption, staging cleanup and native deadline rejection in an isolated child. Both npm --help routes run successfully.

Independent change-reviewer (gpt-6.1-sol high) reproduced a corrupt PK index accepted by quick_check and content iteration. Builder replaced it with full integrity_check(1), added the exact fixture and passed all snapshot tests; reviewer independently passed that targeted regression and found no outstanding actionable defect. The first Windows smoke exposed fsync on a read-only staging descriptor; fixed to use r+ for staging only, preserving a read-only source. Primary integrated and ran the full combined suite, then repeated all application tests after the integrity fix. No learner/browser/served export/dependency change; prior browser/export checks remain valid and were not repeated.

Remaining limits: CLI-only snapshots; hard-link filesystem required; cleanup failure after final publication may leave private staging; explicit symlink/parent-alias, active concurrent-writer contention and power-loss durability are unverified. No actual owner backup/restore/API switch performed. Final staged checks/local commit are recorded in the checkpoint. Next bounded pending capability is learner data reset or further editor fields, preserving the owner preview.
