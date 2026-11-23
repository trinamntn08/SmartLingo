# 0040 — Adopt the Cloud learner updates on the shared preview

Accepted 2026-11-23 for the local web preview.

## Context

Cloud revisions `563fdaa` and `47eebaf` share an older base. The current learner has since added language-specific Today recommendations, a guided course, URL restoration, language-scoped learning data and expanded Japanese study.

## Decision

Apply the Cloud presentation and draft lessons to the current French/Japanese branch. Today keeps the existing lesson and kana recommendations and adds direct starter-topic actions. Learn keeps its listening, speaking and letter routes. Within the topic library, learners see vocabulary first and can jump to ordered lessons. On a narrow screen, the topic choices scroll horizontally when opened. Lesson advances move keyboard focus to the new activity. Browser history keeps its saved route and scroll.

The French cycling and household-waste drafts are added in course order. The Japanese starter adds four distinct lessons under three topic names. Nineteen Japanese expressions and two French expressions reuse their existing canonical vocabulary IDs, with Cloud lesson IDs retained. Japanese practice accepts harmless spacing and final punctuation variations while preserving kana voicing and internal punctuation. Existing guided course, kana, and library progress scopes continue to use their current identities. The original Cloud refs remain the source record for the handoff.

## Consequences

The preview stays on `http://localhost:8082`, with the same browser data. New content enters as bundled drafts and follows the existing owner review workflow. The [integration plan](../plans/0051-integrate-cloud-learner-updates.md) records verification and remaining device and language review.
