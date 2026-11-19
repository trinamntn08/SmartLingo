# ADR 0025: Original Japanese daily-course drafts through B1

Date: 2026-11-19
Status: accepted for implementation; curriculum approval pending

## Context

The owner explicitly requested continuing Japanese course integration through B1. The fetched starting checkout had only a French daily-course pilot. Japanese must not inherit French gender, audio, notebook labels or an unsupported proficiency claim.

## Decision

Extend the separate daily-course contract to `ja-JP` and estimated B1 days. Keep the legacy French lesson/editor schema at foundation/A1/A2. Bundle 13 original AI-assisted Japanese draft days, with English explanations, kana target/example readings, contextual choices, dialogue and manual production review. Reuse existing course-event persistence, keyed by course ID/revision/day/block, with exact multi-day resume and free day/level browsing.

Allow source-free original courses only with author/rights/review provenance. Retain the French source-attribution contract and exact existing vocabulary. No textbook text, exercise answers, recordings or images are imported. Broad Japan Foundation level descriptions are research references, not redistribution licences or endorsements.

Add optional language/readings to notebook entries. Missing language keeps the existing French interpretation and payload. Japanese cards and saved notes use text support without calling French speech. Existing recognition ratings apply to either language; edits preserve language and allow updating readings. No database stores/indexes change, so IndexedDB remains version 4.

Export learning backup format **v4**, accepting imports v1/v2/v3. The format bump prevents an older client accepting a new Japanese backup and silently stripping language/readings through its older schema. Do not voluntarily relicense original owner content or publish drafts.

## Alternatives

Putting Japanese in the French lesson catalogue would also require editor, speech and topic changes outside this bounded journey. External course links would not provide in-app study or offline lessons. Retaining backup v3 would allow older readers to discard Japanese metadata silently.

## Consequences

This is a starter route spanning estimated task levels, not complete A1–B1 coverage or proof of proficiency. Native-speaker/owner review, broader vocabulary/kana/kanji instruction, listening, independent production feedback and course authoring/publication remain open. Ordinary study needs no AI/provider calls. New backups need this version of the app; keep older backups separately when using older app versions.
