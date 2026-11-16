# ADR 0004: Bundle draft lessons and isolate local persistence

Date: 2026-11-14
Status: accepted for the first local implementation slice

## Context
The first learner journey must run without an API key, retain work after reload, and preserve the planned Expo/Fastify/SQLite architecture. Curriculum requires owner review before publication. There is no existing learner data to migrate.

## Decision
- Use npm workspaces and TypeScript packages: framework-independent domain contracts/checking, validated original content, Expo learner, and local Fastify API.
- Bundle two explicitly labelled draft lessons for local preview. The read-only local API also exposes drafts as preview content. This does not publish curriculum or implement content editing.
- Store browser learning events and notebook entries in separate IndexedDB version-1 stores behind `LearningRepository`. Events are immutable and keyed by UUID; identical retries are idempotent and conflicting reuse fails. Atomic create-if-absent lesson capture preserves existing personal notes even across stale tabs; explicit notebook editing uses a separate update method.
- Scope progress to stable lesson ID and attempted revision. Store supported attempts separately through hint counts; completion is practice history, not a proficiency measure. Spaced review scheduling is deferred.
- Keep SQLite content revisions behind an API-local repository. Use Node 24's built-in SQLite to avoid a native npm database build for this local slice; experimental-runtime warnings are acknowledged. Bind to loopback and expose no editing endpoints.
- Offer optional device synthetic speech through a small adapter. No provider credentials, paid generation, recordings, or pronunciation scores. Browser voice availability and quality vary; text remains sufficient to complete lessons.

## Consequences
The first learning loop is independent of API uptime. It still needs the web assets to load: a service worker, downloadable packs, export/restore, native adapters, full review scheduling, and editor preview/publication are separate work. Browser storage can be cleared or evicted; this preview must not be presented as a durable backup. Domain contracts can support future storage/audio adapters without importing browser or provider types.
