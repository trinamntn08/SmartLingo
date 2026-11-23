# Add personal vocabulary directly

Status: completed
Owner: primary agent

## Outcome

Review offers an explicit Add personal word form with French, English meaning and an optional example/note. Validate before writing, preserve input on failure, save once despite repeated clicks/retries and confirm only after persistence. Entries survive reload and use the existing edit/review/backup flows without API access or curriculum publication.

## Ownership and boundaries

Primary owns a new PersonalWordForm UI, Notebook integration, focused browser checks and documentation. Use the existing notebook schema and save adapter with stable personal UUID IDs; no domain/storage/API/curriculum changes. This is a small sequential feature with primary self-review.

## Validation

Repository/TypeScript, offline/API-unavailable create/edit/reload, invalid/cancel no-write, failed-save retry identity, manual review/backup and narrow layout checks. Export the final candidate. No paid calls or owner data writes.

## Handoff

Implemented a collapsible form with schema validation, confirmed-save feedback, a synchronous duplicate-click guard and stable existing retry writes. Personal UUID IDs keep entries separate from curriculum. Repository/TypeScript and all24 focused desktop/narrow notebook/AI/review/backup browser checks pass, including six new creation cases. Invalid/cancelled forms write nothing; failed save retains the form and retry generates no new ID. Create/edit/reload/review/backup work with API access blocked. Production export passes to ignored `.tmp/personal-notebook-export`; small-screen screenshot inspected. Primary self-reviewed this small change. No storage/schema/API/content or owner-data changes, paid calls or inferred proficiency.
