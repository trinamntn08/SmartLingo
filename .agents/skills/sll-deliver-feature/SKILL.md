---
name: sll-deliver-feature
description: Implement a complete SmartLingo product slice, including learner UI, domain logic, storage, and relevant validation. Use for app features and bug fixes, not curriculum-only authoring or read-only reviews.
---

# Deliver a feature

1. Read root AGENTS.md, docs/STATUS.md, and the relevant PROJECT_PLAN.md requirements.
2. Identify the observable learner outcome, existing implementation, and smallest complete scope.
3. Write or update an execution plan under docs/plans/ for multi-step changes. Use docs/templates/EXECUTION_PLAN.md.
4. Set interface contracts before parallel work. Delegate independent tasks with exclusive file ownership when beneficial.
5. Implement the actual journey, including persisted state, useful feedback, and relevant empty/error/offline states.
6. Keep API keys server-side and AI calls explicit. Preserve manual/text alternatives.
7. Run npm run check plus appropriate application checks that actually exist. Verify behaviour rather than duplicating implementation in tests.
8. Update docs/STATUS.md and material architecture decisions. Report what works, how it was checked, and what remains.
