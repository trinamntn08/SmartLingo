# Session checkpoint

Updated 2026-11-24, Europe/Paris.

## Current request and source

The owner asked for an illustrated section of everyday informal French and slang. Work started from the clean Cloud workflow tip `2249086` and uses the local branch `feat/everyday-french-slang`.

## Delivered

- Slang in the learner navigation opens a reference with 287 expressions across 12 situations. Every card shows an English meaning, original bilingual example, usage note, register and generated situation photo. French and English search, category filters, audio and local notebook capture are available. Text shorthand carries a label in both Slang and saved notes. The exported offline app includes all 13 generated photographs.
- The exact designer UI skill was unavailable. The primary used the repository UI-builder guidelines and all seven visual references. Two independent authors supplied bounded source files through the repository curriculum-author role. A read-only reviewer checked the integrated flow and flagged French language tags, shorthand audio, inflected search forms and duplicate course notebook IDs. The primary resolved those findings.
- Source and media details are in the [decision](decisions/0021-slang-reference.md). The reference content and photos are pending owner review. No frequency ranking, real voice quality or physical-phone claim is made.

## Verification

- Repository checks and 18 tooling and 192 application tests passed with the pinned Node and npm. Loopback access was enabled for the isolated test fixtures and subprocess checks.
- Visual inspection of the first Slang browser pair revealed a clipped narrow-screen hero. The broader suite isolated header overflow at 320px. The final layout addresses both findings and the Slang test checks heading and viewport geometry. The first concurrent runs were stopped after width failures and offline download timeouts.
- Final system Chromium runs passed 83 development tests with one intentional duplicate-publication skip, and all eight exported offline tests. The cold offline journey loads the Slang hero, finds a French phrase and decodes its situation photo. The export manifest contains 139 files and 10,235,647 bytes at build `33c717d934fa`. Verification used isolated fixtures and mocked practice and speech boundaries.

## Completion

The commit containing this checkpoint is the recoverable feature revision. The catalogue and photos are ready for owner review in the learner preview.

Account allowance was unavailable. Both authors and the reviewer inherited the active model. Role instructions were supplied from project files.
