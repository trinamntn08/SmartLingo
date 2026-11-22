# 0031: separate app composition, design primitives and feature lifecycles

Date: 2026-11-22
Status: accepted

## Context

The shared French/Japanese learner grew by adding language choice, reports, kana, audio and local settings. App mounting, navigation/model composition and Profile accumulated in one entry point. Base controls also imported generated-audio UI, and the content entry point contained entire seed lessons. The owner requested a maintainability/extensibility review and cleanup.

## Decision

Keep App responsible for learner/editor mounting and browser hash integration. Put scoped learner model composition/rendering in `src/app/LearnerApp`, session destinations/guards in `src/app/useLearnerNavigation`, and Profile rendering in `src/profile/ProfileScreen`. Preserve mounted workspaces, unsaved editor state, independent language history and pending-write guards.

Keep design tokens/styles and Button/Badge independent of audio, persistence and external services. `src/audio/Speak` composes generic controls with existing audio/provider adapters. Shared visual values move to `designTokens`; theme exports remain compatible and feature-specific layouts stay local. Do not create a speculative UI package or routing framework.

Keep original restaurant/bakery seed payloads in a content module and catalogue composition in the package entry point. Preserve exact exported payloads, stable IDs/revisions and histories.

Share response-disconnect listener cleanup within the API, leaving validation, JSON/binary protocols, provider admission and feature errors at existing boundaries. Validate resource-free service options before speech database acquisition. Stop learner audio on direct editor hash transitions.

## Consequences

The next UI task can change a screen or shared token without editing app mounting, and primitive consumers no longer depend on audio features. Independent regressions cover the two confirmed lifecycle defects. Existing offline, storage, publication and paid-call rules remain unchanged; there is no migration, dependency addition or content revision.

Further endpoint configuration, JSON size budgets, historical catalogue allocation and beginner UX work remain separate follow-ups documented in [the review](../CODEBASE_REVIEW.md). More modules are useful only while each retains a clear responsibility; this decision does not justify splitting every function or centralizing every local style.
