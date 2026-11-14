---
name: sll-review-change
description: Perform a read-only review of SmartLingo changes for reproducible defects, learning correctness, data integrity, privacy, and verification gaps.
---

# Review a change

1. Read AGENTS.md and inspect the actual diff against the stated base.
2. Trace the changed user flow and its persistence/API boundaries. Consult official documentation for uncertain APIs.
3. Check secrets, recording retention, cancellation, retries, notebook saving, offline behaviour, answer alternatives, and progress integrity where relevant.
4. Check draft/publication separation and source/rights records for changed curriculum.
5. Run suitable existing checks without changing files or spending API credits.
6. Report confirmed findings first: severity, file/line, trigger, impact, and evidence. Separate uncertain risks.
7. If no actionable findings exist, say so and list material verification gaps.
8. Do not edit, commit, or invent a clean test result.
