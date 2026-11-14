# ADR 0002: Clean, modular, extensible implementation

Date: 2026-11-14
Status: accepted (explicit owner requirement)

## Context

Before implementation, the owner requested clean, modular, extensible code and functions that each do one job. SmartLingo is planned for multiple platforms and languages, with replaceable storage and AI providers.

## Decision

Adopt the [implementation standards and review criteria](../ARCHITECTURE.md#implementation-standards) for every feature and fix. Keep functions focused and modules cohesive. Separate UI, domain rules, use-case coordination, and external adapters through small typed contracts. Keep domain logic independent of frameworks and providers.

Use composition and configuration for concrete reuse and planned variation. Keep the simplest design that supports the current slice and agreed boundaries; add further abstractions when there is a demonstrated need.

## Alternatives

- A single module mixing UI, learning logic, storage, and providers would make isolated verification and future platform changes harder.
- A general plugin framework or mandatory abstraction for every function would add complexity before a need exists.
- Fixed function/file length limits would measure size rather than responsibility and clarity.

## Consequences

Implementation reviews must assess responsibility, dependency direction, testability, and extension paths alongside behaviour. Material boundary or contract changes require a decision record. The project plan, contributor workflow, and agent instructions link these requirements.

This decision documents standards for future work. It does not scaffold the app or establish automatic architecture enforcement.
