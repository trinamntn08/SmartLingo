# Share the French course interface across languages

Status: completed
Owner: primary agent

## Outcome

French and Japanese use the same Learn landing, course launch, selection, outline and lesson reader. Japanese letters remain an available route and a recommended next activity when appropriate. The original French course stays the design reference. Japanese curriculum order, readings, audio, practice, progress and existing URLs remain usable.

## Source and scope

The initial Cloud checkout at `2249086` predates Japanese. The task worktree starts from `5d31ae05296820483d786569daa1d5ae1155905e`, which includes the combined learner, Japanese curriculum redesign, and native-speaker recordings. French and Japanese are the two runtime target languages. English provides explanations and interface copy.

## Steps and validation

1. Centralise the guided catalogue and use the authored units for both languages. Keep distinct curriculum and practice data on the existing lesson contracts.
2. Use the French Learn navigation and course presentation for both languages. Retain the kana entry and existing language-specific activities.
3. Verify the public entry points, desktop and phone-width layouts, lesson completion, saved resume, existing URLs and offline loading. Run the repository, application and browser checks.

## Result

One registry supplies the ordered French and Japanese courses and topics. The French launch card is shared with the Japanese guided course and kana recommendation. Learn opens the same course picker in both languages. Guided practice, older links and saved progress carry forward. The course hash, both browser layouts, and the desktop and phone cold-offline checks passed. [Verification and remaining checks](../SESSION_CHECKPOINT.md)
