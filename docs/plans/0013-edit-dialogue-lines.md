# Edit existing dialogue lines

Status: completed
Owner: primary agent

## Outcome and acceptance

The owner can edit each existing dialogue line's speaker role, French text and English translation in the local editor, save an immutable revision, inspect it in the real temporary lesson preview and explicitly publish it. Loading the publication preserves those edits after API loss/reload. Empty required fields fail before any save request. Unsaved dialogue text survives learner/home navigation and the editor remains usable at 320px.

Keep line count/order, vocabulary IDs/targets, exercises, media and prior learning data unchanged. No schema, storage, dependency or automatic approval/publication change. Adding/deleting/reordering lines and broader target/exercise/media editing remain later work. The existing revision-scoped preview/receipt/cache protections apply without new adapters.

## Implementation and ownership

Primary owns this small sequential UI change in DraftFields.tsx, relevant editor browser assertions, documentation and checks/self-review. No new subagent or model override needed; usage limits unavailable. Reuse the existing Field and typed Lesson dialogue contracts. Update editor scope/help text to match actual fields. All publication checks use the isolated in-memory test API and fresh browser contexts, never the owner's API3001.

## Validation and preview

Run repository/TypeScript, relevant application checks and browser editor journeys: French/English/role draft save, isolated preview, explicit publication and cached reload, empty-field no-request rejection, 320px unsaved navigation. Build a separate ignored candidate export to verify Metro while preserving the running owner export on 8082. Inspect narrow screenshot. Update status/checkpoint, final staged whitespace/secret checks and focused local commit.

Previous checkpoint b076f3d is curriculum backup/recovery. No push/merge/public deployment or owner data edits.

## Actual outcome

Primary implemented and self-reviewed the small UI-only change, including typed immutable line updates and corrected scope text. `npm.cmd run check` passes. Seven focused browser cases pass with one deliberate duplicate publication skip: role/French/English save/isolated preview/publication/cache reload; blank French rejects before POST, corrected text enables save; 320px/home navigation preserves unsaved dialogue. Narrow screenshot inspected. Exported current app to `.tmp/dialogue-export` using Expo's explicit output directory, then ran offline manifest generation there: four files/1,249,933 bytes. Existing schema/domain/API/storage/curriculum modules are unchanged; their 18 tooling/93 application tests and prior full browser/offline baseline were not repeated. After validation, promoted candidate app assets into the regular 8082 preview using native copies and single-file index/manifest replacements, preserving old hashed scripts for existing tabs. All four served hashes/sizes verify; an isolated fixture-only production browser renders dialogue fields with no page errors or edits. API health remains ok; actual owner content was not inspected or altered by the smoke. Final docs/staged checks and local commit are recorded in the checkpoint.
