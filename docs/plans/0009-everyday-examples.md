# Fuller everyday examples and compact word controls

Status: completed
Owner: primary agent

## Outcome and acceptance
Owner requests fuller everyday example sentences for every word, still useful at A1–A2, and short gender markers next to words instead of repeated gender prose. Subsequent steering replaces Listen buttons with a speaker icon beside the word. Rewrite all 353 canonical examples/translations; retain targets/IDs/meanings, activities, original media and personal vocabulary. Show m./f./m./f. where appropriate, keep useful notes and omit empty ones. Icon playback keeps keyboard labels, stop/error behaviour and a 44px target.

## Contracts and ownership
Primary owns optional gender/empty-note schema, authoring helper, starter entries, presentation/editor controls, shared exports/fingerprint manifest, non-API tests and docs. Two curriculum authors (gpt-6.1-sol medium) own food-home and daily-life examples/notes/gender in disjoint files. API builder (gpt-6.1-sol medium) owns immutable seed refresh/startup/API tests/test server. Independent read-only reviewer (gpt-6.1-sol high) checks content/metadata and seed preservation after a slot is free. At most three helpers concurrently; usage tools unavailable. No new dependency or paid call.

Authoring tuple gains optional details with gender/picture; runtime gender is optional masculine/feminine/both. Empty notes are valid; no filler needed. Explicit legacy noun prefixes can render as compact labels without guessing from French articles. Editor selects the effective gender, and a gender edit removes only that redundant legacy prefix while keeping useful notes.

Examples change curriculum: bump bundled drafts to revision2 rather than mutate revision1. SHA256 fingerprints captured from all 60 old revision1 seeds permit one transactional append only when the stored head is that exact untouched draft and the incoming revision is consecutive. Edited heads, publications and newer revisions stay untouched. Older history/notebook/ratings remain; revised lessons start their own progress. New drafts remain unapproved.

## Validation
Schema/ID/target/example-length/UTF-8 and translation/French review; all prior lesson exercises remain solvable. Verify optional notes/gender, legacy clear, safe seed append/rollback/idempotence and owner-data preservation. Run repository/type, application/tooling and browser checks with icon-only playback, gender/example visibility, editable empty notes, revision-relative publication and narrow error layout; inspect screenshots/export. Review, update checkpoint, stage deliberate paths and commit locally.

## Continuation on 2026-11-15
Owner authorised committing this completed step and proceeding through pending work until allowance ends. Primary resumed the existing uncommitted implementation on `feat/everyday-examples-and-gender`; no unrelated initial edits identified. Usage/reset tools are unavailable; no allowance estimate or automatic resume is claimed.

Independent read-only `change-reviewer` used `gpt-6.1-sol` high: all 60 historical fingerprints match Git `8009796`; in-memory refresh appends all 60 once with zero publications; IDs/targets/meanings/media/exercises stay unchanged. Read-only `curriculum-author` used `gpt-6.1-sol` medium: reviewed all canonical examples/genders/translations. Primary corrected socks (à porter), particular-week weekdays (lundi et mardi), availability (toute la journée vendredi), and clarified tartines/attentivement wording. These are original drafts, with actual owner review still required.

Repository/TypeScript, 16 tooling/66 application tests and web export pass. Added browser verification of 44px icons, keyboard play/stop through a fake speech boundary, and editable empty notes/no-gender through saved preview/publication/cache reload. Browser run passed 29 cases with one deliberate skip; two added playback cases initially failed because the test used a mock voice with the native utterance constructor. Both passed after mocking the utterance boundary too. No application defect was hidden or check disabled. Narrow vocabulary screenshot inspected; real audible voice/phone/owner content review remain pending. See checkpoint for commit outcome.
