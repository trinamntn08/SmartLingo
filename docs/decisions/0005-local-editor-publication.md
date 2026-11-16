# ADR 0005: Local draft revisions, preview receipts and learner publication cache

Date: 2026-11-14
Status: accepted for local beta implementation

The owner authorised continuing implementation beyond the first learner slice. Extend [ADR 0004](0004-local-preview-foundation.md) with first editor fields and explicit local publication; do not approve the seeded AI drafts during development.

- Keep SQLite's existing immutable revision schema. Save appends a draft only when the expected latest revision matches. Publishing appends another revision; newer drafts do not replace the highest published revision. Earlier revisions/events remain intact.
- Require an expiring opaque receipt bound to the latest saved draft and an explicit owner-review flag before publication. Receipts are bounded in memory and invalid after save/publish/restart. This verifies workflow order, not linguistic accuracy or user identity.
- Keep editor preview learning state in memory, separate from the real notebook/events. Expose answer keys/provenance to support actual owner review. First fields affect headings and support text; the full content editor remains future work.
- Bind API to loopback and reject non-loopback Host headers. Restrict browser origins/preflights and require JSON/custom header for editor operations. No public/LAN hosting until real authentication is implemented. These browser protections are not a substitute for authentication.
- Use IndexedDB v2 to add published-content records without changing v1 learning data. The learner explicitly loads publications, validates and atomically caches them, and keeps them with API unavailable. Do not cache drafts or downgrade newer cached revisions. Do not infer mastery from completion.
- Keep request timeouts and explicit retries; stale saves/publications return conflicts. A failed request never silently changes the form or publishes a replacement. Align editable vocabulary limits with notebook capture so valid lesson text can always be saved.

Tests use a separate in-memory content server for simulated review/publication; the owner's on-disk curriculum stays draft. Full offline installation, review scheduling, import/export and editor restore/unpublish are outside this decision.
