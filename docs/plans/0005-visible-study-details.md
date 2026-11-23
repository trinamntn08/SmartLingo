# Show study details directly

Status: completed
Owner: primary agent

## Outcome
The owner requested a simpler study view with meanings, examples, translations and explanations visible without expanding controls. Show vocabulary support, dialogue translations/grammar and saved notebook meanings directly. Preserve explicit recall reveal/rating and exercise hints as practice controls.

## Steps and ownership
Primary owns this small sequential UI change, existing browser expectations and the matching product preference/checkpoint documents. No module/storage/schema changes or dependencies. Remove the now-unused generic study reveal component, simplify the detail grouping and verify desktop/narrow layouts. Existing owner preference takes precedence over the earlier optional-reveal default.

## Validation
Run npm check, existing browser journeys with immediate-visibility assertions, inspect lesson screenshots at desktop/phone sizes, and export web. Review the focused diff, update the checkpoint and create a deliberate local commit. No owner learning data is modified by tests.

## Result
Meaning, example translation and labelled explanation render directly on vocabulary cards. Dialogue translations/grammar and notebook meanings also render directly, including editor lesson previews. Narrow screens use a small illustration beside the word. Removed the unused study Reveal component and updated existing browser assertions and product instructions to match the explicit owner preference.

Validation: npm check, all 16 tooling/54 application tests, final browser run (21 passed, one deliberate duplicate publication skip) and final web export passed. Desktop/narrow screenshots inspected; 320px flow has no horizontal overflow. Primary reviewed the focused source/documentation diff; no domain/storage changes or paid calls. Long text can require scrolling. The local checkpoint containing the final session note records commit identity/recovery.
