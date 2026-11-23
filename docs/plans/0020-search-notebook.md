# Search saved vocabulary

Status: completed
Owner: primary agent

## Outcome

Search saved curriculum, AI and personal notebook entries by French, English meaning or example/note, with existing accent/apostrophe normalization. Show match count and a clear action/empty state. Filtering must not delete entries, change the review queue or discard an unsaved note edit.

## Ownership and validation

Primary owns Notebook UI, focused browser coverage and documentation. Reuse normalizeSearch; no new storage/domain/API/content rules. Validate accent/English/example search, empty/clear behavior, hidden unsaved edit preservation, reload and unchanged stored entries. Run repository/TypeScript, focused notebook regressions, export and staged checks; primary self-review for this small sequential change.

## Handoff

Implemented matching/counts/empty/clear states while keeping filtered cards mounted to retain unsaved fields. Repository/TypeScript and twelve focused notebook/review browser cases pass; final full Chromium suite:57 passed/one deliberate duplicate-publication skip. Search covers accent-insensitive French, English and examples; clearing/reloading restores entries, with edits preserved. Final production/offline smoke also creates a personal entry and finds it by unaccented French without network/API. Primary self-reviewed and inspected the narrow view. Refreshed README overview and removed an obsolete fixed sixty-lesson download label after the separately completed curriculum expansion. No data/schema/API/curriculum changes, paid calls or owner preview changes.
