# Edit lesson topic, role and estimated level

Status: completed
Owner: primary agent

## Outcome and acceptance

Owner can change a lesson's topic, learner role and estimated content level, save/preview/review/publish it and see the revised topic grouping, role badge and level filters after publication/cache reload. IDs, vocabulary targets, exercise answers, existing notebook/history and immutable publication rules remain intact. Topic and role are required; UI explains that matching dialogue role labels are edited separately and levels describe content, not learner proficiency.

Support all existing schema levels (foundation, A1, A2), including a Foundations catalogue filter. No new schema field, storage migration, content generation or dependency. Existing publication/preview guards handle these fields unchanged. Create/archive/import/unpublish, duration/order and exercise/media/target editing remain later work.

## Ownership and validation

Primary owns this small sequential editor/domain-filter/UI/test/docs step; no implementation delegation required. Read-only review can inspect completed scope if warranted. Add typed fields/selected buttons, expand CatalogueLevel to all Lesson levels and verify foundations filtering. Extend isolated editor publication test with topic/role/A2 changes and cached grouping/filter checks; retain dialogue/invalid/unsaved tests. Run repository/TypeScript, domain/application checks and full browser regressions because catalogue controls change. Build an ignored candidate export, inspect narrow screenshot, self-review, update status/checkpoint, staged checks and local commit. Keep 8082 preview stable until candidate validates; no actual owner writes/publications.

Previous checkpoint: 785f385 dialogue editor. Existing owner preview on 8082/API 3001 remains running. Usage tools unavailable; no allowance estimate/paid calls/new dependencies. No push/merge/public deployment.

## Actual outcome

Typed topic/role fields and level buttons implemented, with explicit content/proficiency and role-label guidance. CatalogueLevel now derives from the existing Lesson level type, including foundation; Foundations filtering and descriptive catalogue text are present. Primary self-reviewed the small diff, no new delegation.

Repository/TypeScript, all 94 application tests, candidate production export and full 33 browser cases pass (one deliberate duplicate publication skip). Isolated publication journey proves changed topic/Guest role/A2 grouping/filtering after cache reload while prior history/dialogue stay intact; domain test covers foundation publications. Candidate manifest generation passes with four files/1,250,949 bytes, build 6b657e91158267075364018af5ef89e2d782dcae334b3cd3fde0fc71cd120811. Narrow metadata screenshot inspected. Candidate was then copied to regular8082, preserving prior hashed scripts. HTTP hashes/sizes verify, and a fixture-only isolated production browser renders new fields and cold-loads the downloaded current app offline. No owner curriculum read/write/publication or server restart; API contract unchanged and health remains checked at handoff. Final docs/staged checks/local commit are in the checkpoint.
